const fs = require('fs');
const path = require('path');

class PidManager {
  constructor(pidDir = '.turbo-pids') {
    this.pidDir = pidDir;
    this.ensurePidDir();
  }

  ensurePidDir() {
    if (!fs.existsSync(this.pidDir)) {
      fs.mkdirSync(this.pidDir, { recursive: true });
    }
  }

  getPidFile(serviceName) {
    return path.join(this.pidDir, `${serviceName}.pid`);
  }

  writePid(serviceName, pid) {
    const pidFile = this.getPidFile(serviceName);
    fs.writeFileSync(pidFile, pid.toString());
  }

  readPid(serviceName) {
    const pidFile = this.getPidFile(serviceName);
    if (!fs.existsSync(pidFile)) {
      return null;
    }
    
    try {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim());
      return isNaN(pid) ? null : pid;
    } catch (error) {
      return null;
    }
  }

  removePid(serviceName) {
    const pidFile = this.getPidFile(serviceName);
    if (fs.existsSync(pidFile)) {
      fs.unlinkSync(pidFile);
    }
  }

  isProcessRunning(pid) {
    if (!pid) return false;
    
    try {
      // Sending signal 0 checks if process exists without actually sending a signal
      process.kill(pid, 0);
      return true;
    } catch (error) {
      return false;
    }
  }

  getRunningPid(serviceName) {
    const pid = this.readPid(serviceName);
    if (pid && this.isProcessRunning(pid)) {
      return pid;
    }
    // Clean up stale PID file
    this.removePid(serviceName);
    return null;
  }

  cleanup() {
    // Remove all PID files for processes that are no longer running
    if (!fs.existsSync(this.pidDir)) return;
    
    const files = fs.readdirSync(this.pidDir);
    files.forEach(file => {
      if (file.endsWith('.pid')) {
        const serviceName = file.replace('.pid', '');
        if (!this.getRunningPid(serviceName)) {
          this.removePid(serviceName);
        }
      }
    });
  }

  getAllRunningServices() {
    if (!fs.existsSync(this.pidDir)) return [];
    
    const services = [];
    const files = fs.readdirSync(this.pidDir);
    
    files.forEach(file => {
      if (file.endsWith('.pid')) {
        const serviceName = file.replace('.pid', '');
        const pid = this.getRunningPid(serviceName);
        if (pid) {
          services.push({ name: serviceName, pid });
        }
      }
    });
    
    return services;
  }
}

module.exports = PidManager;