const { spawn } = require('child_process');
const EventEmitter = require('events');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const os = require('os');

class ProcessManagerV2 extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      pidDir: options.pidDir || '.turbo-pids',
      logDir: options.logDir || '.turbo-logs',
      stateFile: options.stateFile || '.turbo-state.json',
      maxStartupRetries: options.maxStartupRetries || 3,
      startupTimeout: options.startupTimeout || 30000,
      shutdownTimeout: options.shutdownTimeout || 5000,
      ...options
    };
    
    this.processes = new Map();
    this.state = {
      services: {},
      lastAction: null,
      startedAt: new Date().toISOString()
    };
    
    this.init();
  }

  async init() {
    // Create necessary directories
    await this.ensureDirectories();
    
    // Load persisted state
    await this.loadState();
    
    // Clean up stale processes
    await this.cleanupStaleProcesses();
    
    // Set up signal handlers
    this.setupSignalHandlers();
  }

  async ensureDirectories() {
    await fs.mkdir(this.options.pidDir, { recursive: true });
    await fs.mkdir(this.options.logDir, { recursive: true });
  }

  async loadState() {
    try {
      const stateData = await fs.readFile(this.options.stateFile, 'utf8');
      const savedState = JSON.parse(stateData);
      this.state = { ...this.state, ...savedState };
    } catch (error) {
      // No state file, start fresh
    }
  }

  async saveState() {
    await fs.writeFile(
      this.options.stateFile,
      JSON.stringify(this.state, null, 2),
      'utf8'
    );
  }

  async cleanupStaleProcesses() {
    console.log('🧹 Cleaning up stale processes...');
    
    // Clean up PID files
    try {
      const pidFiles = await fs.readdir(this.options.pidDir);
      for (const file of pidFiles) {
        if (file.endsWith('.pid')) {
          const pidPath = path.join(this.options.pidDir, file);
          const pidContent = await fs.readFile(pidPath, 'utf8');
          const pid = parseInt(pidContent.trim());
          
          if (!this.isProcessRunning(pid)) {
            await fs.unlink(pidPath);
            console.log(`  ✓ Removed stale PID file: ${file}`);
          }
        }
      }
    } catch (error) {
      // Directory might not exist yet
    }
    
    // Clean up state
    for (const serviceName in this.state.services) {
      const service = this.state.services[serviceName];
      if (service.pid && !this.isProcessRunning(service.pid)) {
        this.state.services[serviceName] = {
          ...service,
          status: 'stopped',
          pid: null,
          stoppedAt: new Date().toISOString()
        };
      }
    }
    
    await this.saveState();
  }

  isProcessRunning(pid) {
    if (!pid) return false;
    
    try {
      process.kill(pid, 0);
      return true;
    } catch (error) {
      return false;
    }
  }

  async start(serviceName, config) {
    console.log(`\n🚀 Starting ${serviceName}...`);
    
    // Check if already running
    const existingService = this.state.services[serviceName];
    if (existingService?.pid && this.isProcessRunning(existingService.pid)) {
      console.log(`  ⚠️  ${serviceName} is already running (PID: ${existingService.pid})`);
      return { success: true, alreadyRunning: true, pid: existingService.pid };
    }
    
    // Update state
    this.state.services[serviceName] = {
      status: 'starting',
      startedAt: new Date().toISOString(),
      config
    };
    await this.saveState();
    
    let attempts = 0;
    let lastError = null;
    
    while (attempts < this.options.maxStartupRetries) {
      attempts++;
      
      try {
        // Clean up any existing process on the port
        if (config.port) {
          await this.ensurePortAvailable(config.port, serviceName);
        }
        
        // Start the process
        const proc = await this.spawnProcess(serviceName, config);
        
        // Store process reference
        this.processes.set(serviceName, proc);
        
        // Update state
        this.state.services[serviceName] = {
          ...this.state.services[serviceName],
          status: 'running',
          pid: proc.pid,
          attempts
        };
        await this.saveState();
        
        // Write PID file
        await this.writePidFile(serviceName, proc.pid);
        
        console.log(`  ✅ ${serviceName} started successfully (PID: ${proc.pid})`);
        
        return { success: true, pid: proc.pid };
        
      } catch (error) {
        lastError = error;
        console.log(`  ❌ Attempt ${attempts} failed: ${error.message}`);
        
        if (attempts < this.options.maxStartupRetries) {
          console.log(`  🔄 Retrying in 2 seconds...`);
          await this.delay(2000);
        }
      }
    }
    
    // All attempts failed
    this.state.services[serviceName] = {
      ...this.state.services[serviceName],
      status: 'failed',
      error: lastError.message,
      failedAt: new Date().toISOString()
    };
    await this.saveState();
    
    return { success: false, error: lastError.message };
  }

  async spawnProcess(serviceName, config) {
    const { command, args = [], cwd, env = {} } = config;
    
    // Create log file
    const logFile = path.join(this.options.logDir, `${serviceName}.log`);
    const logStream = fsSync.createWriteStream(logFile, { flags: 'a' });
    
    // Spawn process
    const proc = spawn(command, args, {
      cwd: cwd || process.cwd(),
      env: { ...process.env, ...env },
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    // Handle output
    proc.stdout.pipe(logStream);
    proc.stderr.pipe(logStream);
    
    // Handle process events
    proc.on('exit', async (code, signal) => {
      console.log(`\n⚠️  ${serviceName} exited (code: ${code}, signal: ${signal})`);
      
      this.processes.delete(serviceName);
      await this.removePidFile(serviceName);
      
      this.state.services[serviceName] = {
        ...this.state.services[serviceName],
        status: 'stopped',
        pid: null,
        exitCode: code,
        exitSignal: signal,
        stoppedAt: new Date().toISOString()
      };
      await this.saveState();
      
      this.emit('service:exit', { serviceName, code, signal });
    });
    
    proc.on('error', async (error) => {
      console.error(`\n❌ ${serviceName} error: ${error.message}`);
      
      this.state.services[serviceName] = {
        ...this.state.services[serviceName],
        status: 'error',
        error: error.message
      };
      await this.saveState();
    });
    
    // Wait for process to be ready
    if (config.readyCheck) {
      await this.waitForReady(serviceName, proc.pid, config.readyCheck);
    } else {
      // Default: wait a bit for process to stabilize
      await this.delay(1000);
    }
    
    return proc;
  }

  async waitForReady(serviceName, pid, readyCheck) {
    const { type, port, url, timeout = this.options.startupTimeout } = readyCheck;
    const startTime = Date.now();
    
    console.log(`  ⏳ Waiting for ${serviceName} to be ready...`);
    
    while (Date.now() - startTime < timeout) {
      // Check if process is still running
      if (!this.isProcessRunning(pid)) {
        throw new Error(`Process died during startup`);
      }
      
      let isReady = false;
      
      try {
        switch (type) {
          case 'port':
            isReady = await this.isPortInUse(port);
            break;
            
          case 'http':
            isReady = await this.checkHttpEndpoint(url || `http://localhost:${port}`);
            break;
            
          default:
            // Simple process check
            isReady = true;
        }
        
        if (isReady) {
          console.log(`  ✅ ${serviceName} is ready!`);
          return;
        }
      } catch (error) {
        // Not ready yet
      }
      
      await this.delay(1000);
    }
    
    throw new Error(`Service failed to become ready within ${timeout}ms`);
  }

  async stop(serviceName, force = false) {
    console.log(`\n🛑 Stopping ${serviceName}...`);
    
    const service = this.state.services[serviceName];
    if (!service || service.status === 'stopped') {
      console.log(`  ℹ️  ${serviceName} is not running`);
      return { success: true, alreadyStopped: true };
    }
    
    const proc = this.processes.get(serviceName);
    const pid = service.pid;
    
    if (!proc && !pid) {
      console.log(`  ℹ️  No process found for ${serviceName}`);
      return { success: true };
    }
    
    try {
      // Update state
      this.state.services[serviceName] = {
        ...service,
        status: 'stopping'
      };
      await this.saveState();
      
      // Try graceful shutdown
      if (proc) {
        proc.kill(force ? 'SIGKILL' : 'SIGTERM');
      } else if (pid) {
        process.kill(pid, force ? 'SIGKILL' : 'SIGTERM');
      }
      
      // Wait for process to exit
      const stopped = await this.waitForProcessStop(serviceName, pid, this.options.shutdownTimeout);
      
      if (!stopped && !force) {
        console.log(`  ⚠️  Process didn't stop gracefully, force killing...`);
        if (proc) proc.kill('SIGKILL');
        else if (pid) process.kill(pid, 'SIGKILL');
      }
      
      // Clean up
      this.processes.delete(serviceName);
      await this.removePidFile(serviceName);
      
      this.state.services[serviceName] = {
        ...service,
        status: 'stopped',
        pid: null,
        stoppedAt: new Date().toISOString()
      };
      await this.saveState();
      
      console.log(`  ✅ ${serviceName} stopped`);
      return { success: true };
      
    } catch (error) {
      console.error(`  ❌ Failed to stop ${serviceName}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async restart(serviceName, config) {
    console.log(`\n🔄 Restarting ${serviceName}...`);
    
    // Stop the service
    await this.stop(serviceName);
    
    // Small delay to ensure cleanup
    await this.delay(1000);
    
    // Start the service
    return this.start(serviceName, config);
  }

  async stopAll() {
    console.log('\n🛑 Stopping all services...');
    
    const services = Object.keys(this.state.services);
    const results = [];
    
    for (const serviceName of services) {
      const service = this.state.services[serviceName];
      if (service.status === 'running') {
        const result = await this.stop(serviceName);
        results.push({ service: serviceName, ...result });
      }
    }
    
    return results;
  }

  async status() {
    const services = [];
    
    for (const [name, service] of Object.entries(this.state.services)) {
      const isRunning = service.pid && this.isProcessRunning(service.pid);
      
      services.push({
        name,
        status: isRunning ? 'running' : service.status,
        pid: service.pid,
        port: service.config?.port,
        uptime: isRunning && service.startedAt ? 
          this.formatUptime(Date.now() - new Date(service.startedAt).getTime()) : null
      });
    }
    
    return services;
  }

  // Utility methods
  
  async ensurePortAvailable(port, serviceName) {
    const inUse = await this.isPortInUse(port);
    
    if (inUse) {
      console.log(`  ⚠️  Port ${port} is in use, attempting to free it...`);
      
      // Don't kill processes indiscriminately - just fail if port is taken
      throw new Error(`Port ${port} is already in use. Please stop the conflicting service first.`);
    }
  }

  async isPortInUse(port) {
    const net = require('net');
    
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
      
      server.once('listening', () => {
        server.close();
        resolve(false);
      });
      
      server.listen(port);
    });
  }

  async checkHttpEndpoint(url) {
    const http = require('http');
    const https = require('https');
    
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      
      client.get(url, (res) => {
        resolve(res.statusCode < 500);
      }).on('error', () => {
        resolve(false);
      });
    });
  }

  async writePidFile(serviceName, pid) {
    const pidFile = path.join(this.options.pidDir, `${serviceName}.pid`);
    await fs.writeFile(pidFile, pid.toString(), 'utf8');
  }

  async removePidFile(serviceName) {
    const pidFile = path.join(this.options.pidDir, `${serviceName}.pid`);
    try {
      await fs.unlink(pidFile);
    } catch (error) {
      // File might not exist
    }
  }

  async waitForProcessStop(serviceName, pid, timeout) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (!this.isProcessRunning(pid)) {
        return true;
      }
      await this.delay(100);
    }
    
    return false;
  }

  setupSignalHandlers() {
    const shutdown = async (signal) => {
      console.log(`\n📛 Received ${signal}, shutting down gracefully...`);
      
      await this.stopAll();
      
      // Save final state
      this.state.lastAction = `Shutdown via ${signal}`;
      await this.saveState();
      
      process.exit(0);
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

module.exports = ProcessManagerV2;