const { execSync } = require('child_process');
const net = require('net');

class PortManager {
  constructor(logger) {
    this.logger = logger;
  }

  async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(false);
        } else {
          resolve(true);
        }
      });
      
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      
      server.listen(port);
    });
  }

  killProcessOnPort(port) {
    if (process.platform === 'win32') {
      this.logger.warn('Port cleanup not implemented for Windows');
      return;
    }

    try {
      // Find process using the port
      const lsofCmd = `lsof -ti:${port}`;
      const pids = execSync(lsofCmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
      
      if (pids.length > 0) {
        pids.forEach(pid => {
          try {
            this.logger.info(`Killing process ${pid} on port ${port}`);
            process.kill(parseInt(pid), 'SIGTERM');
          } catch (error) {
            this.logger.debug(`Failed to kill process ${pid}: ${error.message}`);
          }
        });
        
        // Give processes time to terminate
        return new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      // No process found on port, which is fine
      this.logger.debug(`No process found on port ${port}`);
    }
  }

  async ensurePortAvailable(port, serviceName) {
    const available = await this.isPortAvailable(port);
    
    if (!available) {
      this.logger.warn(`Port ${port} is in use, attempting to free it for ${serviceName}`);
      await this.killProcessOnPort(port);
      
      // Check again
      const nowAvailable = await this.isPortAvailable(port);
      if (!nowAvailable) {
        throw new Error(`Failed to free port ${port} for ${serviceName}`);
      }
      
      this.logger.info(`Port ${port} is now available for ${serviceName}`);
    } else {
      this.logger.debug(`Port ${port} is available for ${serviceName}`);
    }
  }

  async waitForPort(port, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const available = await this.isPortAvailable(port);
      if (!available) {
        // Port is in use, which means service is up
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }

  getPortsStatus(ports) {
    return Promise.all(
      ports.map(async (port) => {
        const available = await this.isPortAvailable(port);
        return {
          port,
          status: available ? 'free' : 'in use'
        };
      })
    );
  }
}

module.exports = PortManager;