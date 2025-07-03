const fs = require('fs');
const path = require('path');

class Config {
  constructor() {
    this.isClaudeMode = process.env.CLAUDE_MODE === 'true';
    this.configFile = '.turbo-pm.config.js';
    this.defaults = {
      logLevel: process.env.PM_LOG_LEVEL || 'info',
      autoRestart: process.env.PM_AUTO_RESTART === 'true',
      healthCheckInterval: parseInt(process.env.PM_HEALTH_CHECK_INTERVAL) || 30000,
      claude: {
        concurrency: 4,
        timeout: 60000,
        noDaemon: true
      },
      turbo: {
        concurrency: this.isClaudeMode ? 4 : undefined,
        noDaemon: this.isClaudeMode ? true : false
      }
    };
    
    this.services = this.loadServices();
    this.userConfig = this.loadUserConfig();
  }

  loadServices() {
    const services = {};
    const servicesDir = path.join(__dirname, 'services');
    
    fs.readdirSync(servicesDir).forEach(file => {
      if (file.endsWith('.js')) {
        const serviceName = file.replace('.js', '');
        services[serviceName] = require(path.join(servicesDir, file));
      }
    });
    
    return services;
  }

  loadUserConfig() {
    const configPath = path.join(process.cwd(), this.configFile);
    
    if (fs.existsSync(configPath)) {
      try {
        return require(configPath);
      } catch (error) {
        console.error(`Failed to load config file: ${error.message}`);
      }
    }
    
    return {};
  }

  getService(name) {
    const baseService = this.services[name];
    if (!baseService) return null;
    
    // Merge with user config if available
    const userServiceConfig = this.userConfig.services?.[name] || {};
    
    return {
      ...baseService,
      ...userServiceConfig,
      env: {
        ...baseService.env,
        ...userServiceConfig.env
      },
      readyCheck: {
        ...baseService.readyCheck,
        ...userServiceConfig.readyCheck
      }
    };
  }

  getAllServices() {
    return Object.keys(this.services).map(name => this.getService(name));
  }

  getTurboArgs() {
    const args = [];
    
    if (this.defaults.turbo.noDaemon) {
      args.push('--no-daemon');
    }
    
    if (this.defaults.turbo.concurrency) {
      args.push(`--concurrency=${this.defaults.turbo.concurrency}`);
    }
    
    return args;
  }

  getLogLevel() {
    return this.userConfig.logLevel || this.defaults.logLevel;
  }

  isAutoRestartEnabled(serviceName) {
    const service = this.getService(serviceName);
    return service?.autoRestart || this.defaults.autoRestart;
  }

  getHealthCheckInterval() {
    return this.userConfig.healthCheckInterval || this.defaults.healthCheckInterval;
  }

  isClaudeModeEnabled() {
    return this.isClaudeMode;
  }
}

module.exports = new Config();