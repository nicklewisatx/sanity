const { spawn } = require('child_process');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const Logger = require('./utils/logger');
const PidManager = require('./utils/pid');
const PortManager = require('./utils/port');
const HealthChecker = require('./utils/health');
const config = require('./config');

class ProcessManager extends EventEmitter {
  constructor() {
    super();
    
    this.logger = new Logger({ level: config.getLogLevel() });
    this.pidManager = new PidManager();
    this.portManager = new PortManager(this.logger);
    this.healthChecker = new HealthChecker(this.logger);
    
    this.processes = new Map();
    this.serviceStates = new Map();
    this.healthCheckIntervals = new Map();
    
    // Clean up on exit
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('exit', () => this.cleanup());
    
    // Cleanup stale PIDs on startup
    this.pidManager.cleanup();
  }

  async startService(serviceName) {
    const service = config.getService(serviceName);
    if (!service) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    // Check if already running
    const runningPid = this.pidManager.getRunningPid(serviceName);
    if (runningPid) {
      this.logger.info(`${service.displayName} is already running (PID: ${runningPid})`);
      return { success: true, pid: runningPid, alreadyRunning: true };
    }

    this.logger.info(`Starting ${service.displayName}...`);
    this.setServiceState(serviceName, 'starting');

    try {
      // Ensure port is available
      await this.portManager.ensurePortAvailable(service.port, service.displayName);

      // Create log file
      const logStream = this.createLogStream(service.logFile);

      // Spawn process
      const proc = this.spawnService(service, logStream);
      
      this.processes.set(serviceName, proc);
      this.pidManager.writePid(serviceName, proc.pid);

      // Handle process events
      this.setupProcessHandlers(serviceName, proc, service);

      // Wait for service to be healthy
      const healthResult = await this.waitForHealthy(serviceName, proc.pid, service);

      if (healthResult.success) {
        this.setServiceState(serviceName, 'running');
        this.startHealthMonitoring(serviceName);
        this.logger.info(`${service.displayName} started successfully (PID: ${proc.pid})`);
        
        return { success: true, pid: proc.pid };
      } else {
        throw new Error(healthResult.error || 'Service failed health checks');
      }
    } catch (error) {
      this.logger.error(`Failed to start ${service.displayName}: ${error.message}`);
      this.setServiceState(serviceName, 'stopped');
      
      // Clean up
      await this.stopService(serviceName, true);
      
      return { success: false, error: error.message };
    }
  }

  async stopService(serviceName, force = false) {
    const service = config.getService(serviceName);
    if (!service) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    const proc = this.processes.get(serviceName);
    const pid = this.pidManager.getRunningPid(serviceName);

    if (!proc && !pid) {
      this.logger.info(`${service.displayName} is not running`);
      return { success: true, alreadyStopped: true };
    }

    this.logger.info(`Stopping ${service.displayName}...`);
    this.setServiceState(serviceName, 'stopping');
    this.stopHealthMonitoring(serviceName);

    try {
      if (proc) {
        // Try graceful shutdown first
        proc.kill('SIGTERM');
        
        // Wait for process to exit
        const stopped = await this.waitForProcessExit(proc, service.shutdownTimeout);
        
        if (!stopped && force) {
          this.logger.warn(`Force killing ${service.displayName}`);
          proc.kill('SIGKILL');
        }
      } else if (pid) {
        // Process managed externally
        process.kill(pid, force ? 'SIGKILL' : 'SIGTERM');
      }

      // Clean up
      this.processes.delete(serviceName);
      this.pidManager.removePid(serviceName);
      this.setServiceState(serviceName, 'stopped');
      
      this.logger.info(`${service.displayName} stopped`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to stop ${service.displayName}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async restartService(serviceName) {
    this.logger.info(`Restarting ${serviceName}...`);
    
    const stopResult = await this.stopService(serviceName);
    if (!stopResult.success) {
      return stopResult;
    }

    // Wait before restarting
    const service = config.getService(serviceName);
    if (service?.restartDelay) {
      await new Promise(resolve => setTimeout(resolve, service.restartDelay));
    }

    return this.startService(serviceName);
  }

  async startAll(services = null) {
    const servicesToStart = services || config.getAllServices().map(s => s.name);
    const results = [];

    // Start services with staggered timing in Claude mode
    for (const serviceName of servicesToStart) {
      const result = await this.startService(serviceName);
      results.push({ service: serviceName, ...result });

      if (config.isClaudeModeEnabled() && result.success) {
        // Small delay between services in Claude mode
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  async stopAll() {
    const runningServices = Array.from(this.processes.keys());
    const results = [];

    for (const serviceName of runningServices) {
      const result = await this.stopService(serviceName);
      results.push({ service: serviceName, ...result });
    }

    return results;
  }

  getStatus() {
    const services = config.getAllServices();
    const status = [];

    for (const service of services) {
      const state = this.serviceStates.get(service.name) || 'stopped';
      const pid = this.pidManager.getRunningPid(service.name);
      const proc = this.processes.get(service.name);
      const uptime = proc?.startTime ? Date.now() - proc.startTime : null;

      status.push({
        name: service.name,
        displayName: service.displayName,
        state,
        pid,
        port: service.port,
        uptime
      });
    }

    return status;
  }

  // Private methods

  spawnService(service, logStream) {
    const [command, ...args] = service.command.split(' ');
    
    const spawnOptions = {
      cwd: service.cwd,
      env: { ...process.env, ...service.env },
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe']
    };

    if (config.isClaudeModeEnabled() && command === 'pnpm') {
      // Add turbo args for Claude mode
      const turboArgs = config.getTurboArgs();
      args.push(...turboArgs);
    }

    const proc = spawn(command, args, spawnOptions);
    proc.startTime = Date.now();

    // Pipe output to log file and logger
    proc.stdout.pipe(logStream);
    proc.stderr.pipe(logStream);

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      lines.forEach(line => {
        this.logger.child(service.name).info(line.trim());
      });
    });

    proc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      lines.forEach(line => {
        this.logger.child(service.name).error(line.trim());
      });
    });

    return proc;
  }

  setupProcessHandlers(serviceName, proc, service) {
    proc.on('exit', (code, signal) => {
      this.logger.warn(`${service.displayName} exited with code ${code} (signal: ${signal})`);
      
      this.processes.delete(serviceName);
      this.pidManager.removePid(serviceName);
      this.stopHealthMonitoring(serviceName);
      
      const wasRunning = this.serviceStates.get(serviceName) === 'running';
      this.setServiceState(serviceName, 'crashed');

      // Auto-restart if enabled and was running
      if (wasRunning && config.isAutoRestartEnabled(serviceName)) {
        this.logger.info(`Auto-restarting ${service.displayName}...`);
        setTimeout(() => {
          this.startService(serviceName).catch(err => {
            this.logger.error(`Failed to auto-restart ${service.displayName}: ${err.message}`);
          });
        }, service.restartDelay || 2000);
      }
    });

    proc.on('error', (error) => {
      this.logger.error(`${service.displayName} process error: ${error.message}`);
      this.setServiceState(serviceName, 'crashed');
    });
  }

  async waitForHealthy(serviceName, pid, service) {
    const healthConfig = service.readyCheck;
    
    return this.healthChecker.waitForHealthy(
      healthConfig,
      pid,
      {
        interval: healthConfig?.interval || 1000,
        maxAttempts: Math.ceil(service.startupTimeout / (healthConfig?.interval || 1000)),
        onAttempt: (attempt, result) => {
          if (!result.healthy) {
            this.logger.debug(`${service.displayName} health check attempt ${attempt}: ${result.error || 'not ready'}`);
          }
        }
      }
    );
  }

  startHealthMonitoring(serviceName) {
    const interval = config.getHealthCheckInterval();
    const service = config.getService(serviceName);
    
    if (!service?.readyCheck || interval <= 0) return;

    const checkHealth = async () => {
      const pid = this.pidManager.getRunningPid(serviceName);
      const result = await this.healthChecker.performHealthCheck(service.readyCheck, pid);
      
      if (!result.healthy) {
        this.logger.warn(`${service.displayName} is unhealthy: ${result.error}`);
        this.setServiceState(serviceName, 'unhealthy');
      } else if (this.serviceStates.get(serviceName) === 'unhealthy') {
        this.logger.info(`${service.displayName} is healthy again`);
        this.setServiceState(serviceName, 'running');
      }
    };

    const intervalId = setInterval(checkHealth, interval);
    this.healthCheckIntervals.set(serviceName, intervalId);
  }

  stopHealthMonitoring(serviceName) {
    const intervalId = this.healthCheckIntervals.get(serviceName);
    if (intervalId) {
      clearInterval(intervalId);
      this.healthCheckIntervals.delete(serviceName);
    }
  }

  setServiceState(serviceName, state) {
    this.serviceStates.set(serviceName, state);
    this.emit('stateChange', { service: serviceName, state });
  }

  createLogStream(logFile) {
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    return fs.createWriteStream(logFile, { flags: 'a' });
  }

  async waitForProcessExit(proc, timeout) {
    return new Promise((resolve) => {
      let timeoutId;
      
      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
      };

      proc.once('exit', () => {
        cleanup();
        resolve(true);
      });

      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          cleanup();
          resolve(false);
        }, timeout);
      }
    });
  }

  async shutdown(signal) {
    this.logger.info(`Received ${signal}, shutting down...`);
    
    await this.stopAll();
    
    // Give a moment for cleanup
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }

  cleanup() {
    // Stop all health monitoring
    for (const serviceName of this.healthCheckIntervals.keys()) {
      this.stopHealthMonitoring(serviceName);
    }
    
    // Clean up any remaining processes
    for (const [serviceName, proc] of this.processes) {
      try {
        proc.kill('SIGKILL');
      } catch (error) {
        // Process might already be dead
      }
    }
  }
}

module.exports = ProcessManager;