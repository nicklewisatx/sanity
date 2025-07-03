const http = require('http');
const net = require('net');

class HealthChecker {
  constructor(logger) {
    this.logger = logger;
  }

  async checkHttp(url, timeout = 5000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const req = http.get(url, { timeout }, (res) => {
        const responseTime = Date.now() - startTime;
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            healthy: true,
            status: res.statusCode,
            responseTime
          });
        } else {
          resolve({
            healthy: false,
            status: res.statusCode,
            responseTime,
            error: `HTTP ${res.statusCode}`
          });
        }
        
        // Consume response data to free up memory
        res.resume();
      });
      
      req.on('error', (error) => {
        resolve({
          healthy: false,
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          healthy: false,
          error: 'Request timeout',
          responseTime: timeout
        });
      });
    });
  }

  async checkTcp(host, port, timeout = 5000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const socket = new net.Socket();
      
      socket.setTimeout(timeout);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve({
          healthy: true,
          responseTime: Date.now() - startTime
        });
      });
      
      socket.on('error', (error) => {
        resolve({
          healthy: false,
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          healthy: false,
          error: 'Connection timeout',
          responseTime: timeout
        });
      });
      
      socket.connect(port, host);
    });
  }

  async checkProcess(pid) {
    if (!pid) {
      return {
        healthy: false,
        error: 'No PID provided'
      };
    }
    
    try {
      process.kill(pid, 0);
      return {
        healthy: true,
        pid
      };
    } catch (error) {
      return {
        healthy: false,
        error: 'Process not found',
        pid
      };
    }
  }

  async performHealthCheck(config, pid) {
    if (!config) {
      // If no health check config, just check process
      return this.checkProcess(pid);
    }
    
    const results = [];
    
    // Always check process if PID provided
    if (pid) {
      const processCheck = await this.checkProcess(pid);
      if (!processCheck.healthy) {
        return processCheck;
      }
      results.push(processCheck);
    }
    
    // Perform configured health check
    switch (config.type) {
      case 'http':
        const httpResult = await this.checkHttp(config.url, config.timeout);
        results.push(httpResult);
        break;
        
      case 'tcp':
        const tcpResult = await this.checkTcp(
          config.host || 'localhost',
          config.port,
          config.timeout
        );
        results.push(tcpResult);
        break;
        
      case 'custom':
        if (typeof config.check === 'function') {
          const customResult = await config.check();
          results.push(customResult);
        }
        break;
    }
    
    // Aggregate results
    const healthy = results.every(r => r.healthy);
    const errors = results.filter(r => r.error).map(r => r.error);
    
    return {
      healthy,
      checks: results,
      error: errors.length > 0 ? errors.join(', ') : undefined
    };
  }

  async waitForHealthy(config, pid, options = {}) {
    const {
      interval = 1000,
      maxAttempts = 30,
      onAttempt = () => {}
    } = options;
    
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      const result = await this.performHealthCheck(config, pid);
      onAttempt(attempts, result);
      
      if (result.healthy) {
        return {
          success: true,
          attempts,
          result
        };
      }
      
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    return {
      success: false,
      attempts,
      error: 'Max health check attempts reached'
    };
  }
}

module.exports = HealthChecker;