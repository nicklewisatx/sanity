#!/usr/bin/env node

const ProcessManager = require('./ProcessManager');
const config = require('./config');

// CLI argument parsing
const args = process.argv.slice(2);
const command = args[0];
const target = args[1];

const manager = new ProcessManager();

// Format uptime for display
function formatUptime(ms) {
  if (!ms) return '-';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Display status in a table format
function displayStatus(status) {
  // Calculate column widths
  const nameWidth = Math.max(10, ...status.map(s => s.displayName.length)) + 2;
  const stateWidth = 10;
  const pidWidth = 8;
  const portWidth = 12;
  const uptimeWidth = 10;

  // Header
  console.log('┌' + '─'.repeat(nameWidth) + '┬' + '─'.repeat(stateWidth) + '┬' + '─'.repeat(pidWidth) + '┬' + '─'.repeat(portWidth) + '┬' + '─'.repeat(uptimeWidth) + '┐');
  console.log('│' + ' Service'.padEnd(nameWidth) + '│' + ' Status'.padEnd(stateWidth) + '│' + ' PID'.padEnd(pidWidth) + '│' + ' Port'.padEnd(portWidth) + '│' + ' Uptime'.padEnd(uptimeWidth) + '│');
  console.log('├' + '─'.repeat(nameWidth) + '┼' + '─'.repeat(stateWidth) + '┼' + '─'.repeat(pidWidth) + '┼' + '─'.repeat(portWidth) + '┼' + '─'.repeat(uptimeWidth) + '┤');

  // Rows
  for (const service of status) {
    const statusIcon = {
      running: '\x1b[32m✓\x1b[0m',
      stopped: '\x1b[31m✗\x1b[0m',
      starting: '\x1b[33m⟳\x1b[0m',
      stopping: '\x1b[33m⟳\x1b[0m',
      crashed: '\x1b[31m!\x1b[0m',
      unhealthy: '\x1b[33m!\x1b[0m'
    }[service.state] || '?';

    const portStatus = service.state === 'running' ? service.port.toString() : `${service.port} (free)`;
    
    console.log(
      '│' + ` ${service.displayName}`.padEnd(nameWidth) +
      '│' + ` ${statusIcon} ${service.state}`.padEnd(stateWidth + 10) + // Extra padding for color codes
      '│' + ` ${service.pid || '-'}`.padEnd(pidWidth) +
      '│' + ` ${portStatus}`.padEnd(portWidth) +
      '│' + ` ${formatUptime(service.uptime)}`.padEnd(uptimeWidth) + '│'
    );
  }

  // Footer
  console.log('└' + '─'.repeat(nameWidth) + '┴' + '─'.repeat(stateWidth) + '┴' + '─'.repeat(pidWidth) + '┴' + '─'.repeat(portWidth) + '┴' + '─'.repeat(uptimeWidth) + '┘');
  
  if (config.isClaudeModeEnabled()) {
    console.log('\n\x1b[33mClaude Mode enabled\x1b[0m (concurrency limited, no-daemon mode)');
  }
}

// Main CLI logic
async function main() {
  try {
    switch (command) {
      case 'start':
        if (target === 'all' || !target) {
          console.log('Starting all services...');
          const results = await manager.startAll();
          
          const failed = results.filter(r => !r.success);
          if (failed.length > 0) {
            console.error('\nFailed to start some services:');
            failed.forEach(f => console.error(`- ${f.service}: ${f.error}`));
            process.exit(1);
          } else {
            console.log('\nAll services started successfully!');
            displayStatus(manager.getStatus());
          }
        } else {
          const result = await manager.startService(target);
          if (!result.success) {
            console.error(`Failed to start ${target}: ${result.error}`);
            process.exit(1);
          }
        }
        break;

      case 'stop':
        if (target === 'all' || !target) {
          console.log('Stopping all services...');
          await manager.stopAll();
          console.log('All services stopped.');
        } else {
          const result = await manager.stopService(target);
          if (!result.success) {
            console.error(`Failed to stop ${target}: ${result.error}`);
            process.exit(1);
          }
        }
        break;

      case 'restart':
        if (target === 'all' || !target) {
          console.log('Restarting all services...');
          await manager.stopAll();
          const results = await manager.startAll();
          
          const failed = results.filter(r => !r.success);
          if (failed.length > 0) {
            console.error('\nFailed to restart some services:');
            failed.forEach(f => console.error(`- ${f.service}: ${f.error}`));
            process.exit(1);
          } else {
            console.log('\nAll services restarted successfully!');
            displayStatus(manager.getStatus());
          }
        } else {
          const result = await manager.restartService(target);
          if (!result.success) {
            console.error(`Failed to restart ${target}: ${result.error}`);
            process.exit(1);
          }
        }
        break;

      case 'status':
        displayStatus(manager.getStatus());
        break;

      case 'logs':
        if (!target) {
          console.error('Please specify a service name');
          process.exit(1);
        }
        
        const service = config.getService(target);
        if (!service) {
          console.error(`Unknown service: ${target}`);
          process.exit(1);
        }
        
        console.log(`Logs are available at: ${service.logFile}`);
        console.log(`You can tail them with: tail -f ${service.logFile}`);
        break;

      case 'cleanup':
        console.log('Cleaning up stale processes and PID files...');
        const pidManager = new (require('./utils/pid'))();
        pidManager.cleanup();
        console.log('Cleanup complete.');
        break;

      case 'help':
      default:
        console.log(`
Process Manager for TurboRepo

Usage: pnpm pm <command> [service]

Commands:
  start [service|all]    Start service(s) (default: all)
  stop [service|all]     Stop service(s) (default: all)
  restart [service|all]  Restart service(s) (default: all)
  status                 Show status of all services
  logs <service>         Show log file location for a service
  cleanup                Clean up stale PID files
  help                   Show this help message

Services:
  web        Next.js application (port 3000)
  studio     Sanity Studio (port 3333)
  storybook  Storybook (port 6006)

Environment Variables:
  CLAUDE_MODE=true       Enable Claude Code optimizations
  PM_LOG_LEVEL=debug     Set logging level (debug|info|warn|error)
  PM_AUTO_RESTART=true   Enable automatic restart on crash

Examples:
  pnpm pm start          Start all services
  pnpm pm start web      Start only the web service
  pnpm pm status         Check service status
  pnpm pm stop all       Stop all services
`);
        break;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  manager.stopAll().then(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  manager.stopAll().then(() => process.exit(1));
});

// Run the CLI
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});