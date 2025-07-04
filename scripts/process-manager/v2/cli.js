#!/usr/bin/env node

const ProcessManagerV2 = require('./ProcessManagerV2');
const path = require('path');

// Service configurations
const SERVICES = {
  web: {
    command: 'pnpm',
    args: ['turbo', 'run', 'dev', '--filter=web'],
    cwd: path.join(__dirname, '../../..'),
    port: 3000,
    readyCheck: {
      type: 'port',
      port: 3000,
      timeout: 30000
    }
  },
  studio: {
    command: 'pnpm',
    args: ['turbo', 'run', 'dev', '--filter=studio'],
    cwd: path.join(__dirname, '../../..'),
    port: 3333,
    readyCheck: {
      type: 'port',
      port: 3333,
      timeout: 30000
    }
  },
  storybook: {
    command: 'pnpm',
    args: ['turbo', 'run', 'storybook', '--filter=ui'],
    cwd: path.join(__dirname, '../../..'),
    port: 6006,
    readyCheck: {
      type: 'port',
      port: 6006,
      timeout: 45000
    }
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const target = args[1];

async function main() {
  const pm = new ProcessManagerV2();
  
  // Wait for initialization
  await pm.init();
  
  switch (command) {
    case 'start':
      if (target === 'all') {
        console.log('🚀 Starting all services...\n');
        for (const [name, config] of Object.entries(SERVICES)) {
          await pm.start(name, config);
          // Small delay between services to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else if (SERVICES[target]) {
        await pm.start(target, SERVICES[target]);
      } else {
        console.error(`Unknown service: ${target}`);
        console.log('Available services:', Object.keys(SERVICES).join(', '));
        process.exit(1);
      }
      break;
      
    case 'stop':
      if (target === 'all') {
        await pm.stopAll();
      } else if (target) {
        await pm.stop(target);
      } else {
        console.error('Please specify a service or "all"');
        process.exit(1);
      }
      break;
      
    case 'restart':
      if (target === 'all') {
        console.log('🔄 Restarting all services...\n');
        for (const [name, config] of Object.entries(SERVICES)) {
          await pm.restart(name, config);
        }
      } else if (SERVICES[target]) {
        await pm.restart(target, SERVICES[target]);
      } else {
        console.error(`Unknown service: ${target}`);
        process.exit(1);
      }
      break;
      
    case 'status':
      const services = await pm.status();
      
      console.log('\n📊 Service Status:\n');
      console.log('Service      Status      PID       Port      Uptime');
      console.log('─'.repeat(55));
      
      services.forEach(service => {
        const name = service.name.padEnd(12);
        const status = (service.status || 'stopped').padEnd(12);
        const pid = (service.pid || '-').toString().padEnd(10);
        const port = (service.port || '-').toString().padEnd(10);
        const uptime = service.uptime || '-';
        
        // Color code status
        let statusDisplay = status;
        if (service.status === 'running') {
          statusDisplay = `\x1b[32m${status}\x1b[0m`; // Green
        } else if (service.status === 'stopped') {
          statusDisplay = `\x1b[90m${status}\x1b[0m`; // Gray
        } else if (service.status === 'error' || service.status === 'failed') {
          statusDisplay = `\x1b[31m${status}\x1b[0m`; // Red
        }
        
        console.log(`${name} ${statusDisplay} ${pid} ${port} ${uptime}`);
      });
      
      console.log('');
      break;
      
    case 'logs':
      if (!target) {
        console.error('Please specify a service');
        process.exit(1);
      }
      
      const logFile = path.join(__dirname, '../../../.turbo-logs', `${target}.log`);
      console.log(`📄 Logs for ${target}:`);
      console.log(`   ${logFile}`);
      console.log('\nTail with: tail -f ' + logFile);
      break;
      
    default:
      console.log(`
🚀 Turbo Process Manager v2

Commands:
  start <service|all>    Start service(s)
  stop <service|all>     Stop service(s)
  restart <service|all>  Restart service(s)
  status                 Show service status
  logs <service>         Show log file location

Services:
  web        Next.js app (port 3000)
  studio     Sanity Studio (port 3333)
  storybook  UI components (port 6006)

Examples:
  pnpm pm2 start all
  pnpm pm2 stop web
  pnpm pm2 restart studio
  pnpm pm2 status
`);
  }
}

// Run the CLI
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});