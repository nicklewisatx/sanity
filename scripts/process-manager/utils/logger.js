const fs = require('fs');
const path = require('path');
const { format } = require('util');

class Logger {
  constructor(options = {}) {
    this.level = options.level || process.env.PM_LOG_LEVEL || 'info';
    this.logDir = options.logDir || '.turbo-logs';
    this.serviceName = options.serviceName || 'process-manager';
    this.colors = {
      debug: '\x1b[36m',
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  shouldLog(level) {
    return this.levels[level] >= this.levels[this.level];
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formatted = format(message, ...args);
    return `[${timestamp}] [${level.toUpperCase()}] [${this.serviceName}] ${formatted}`;
  }

  log(level, message, ...args) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, ...args);
    
    // Console output with colors
    if (process.stdout.isTTY) {
      console.log(`${this.colors[level]}${formattedMessage}${this.colors.reset}`);
    } else {
      console.log(formattedMessage);
    }

    // File output
    this.writeToFile(formattedMessage);
  }

  writeToFile(message) {
    const logFile = path.join(this.logDir, `${this.serviceName}.log`);
    fs.appendFileSync(logFile, message + '\n');
    
    // Rotate logs if needed
    this.rotateLogsIfNeeded(logFile);
  }

  rotateLogsIfNeeded(logFile) {
    try {
      const stats = fs.statSync(logFile);
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (stats.size > maxSize) {
        // Rotate logs
        for (let i = 4; i >= 1; i--) {
          const oldFile = `${logFile}.${i}`;
          const newFile = `${logFile}.${i + 1}`;
          if (fs.existsSync(oldFile)) {
            if (i === 4) {
              fs.unlinkSync(oldFile);
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        fs.renameSync(logFile, `${logFile}.1`);
      }
    } catch (error) {
      // Ignore rotation errors
    }
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  child(serviceName) {
    return new Logger({
      level: this.level,
      logDir: this.logDir,
      serviceName
    });
  }
}

module.exports = Logger;