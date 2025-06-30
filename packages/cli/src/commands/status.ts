import { Command } from 'commander';
import chalk from 'chalk';
import { ProcessTracker } from '../lib/process-tracker.js';
import { checkPorts } from '../lib/port-utils.js';
import { getEnvConfigSafe } from '@workspace/env-config';

export const statusCommand = new Command('status')
  .description('Show status of development processes')
  .option('--json', 'Output as JSON', false)
  .action(async (options) => {
    try {
      const tracker = new ProcessTracker();
      const trackedProcesses = await tracker.getAll();
      const env = getEnvConfigSafe();
      
      // Check main ports
      const portStatus = await checkPorts([3000, 3333]);
      
      const status = {
        environment: {
          node: process.version,
          platform: process.platform,
          sanityProject: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not set',
          sanityDataset: env.NEXT_PUBLIC_SANITY_DATASET || 'not set',
          nodeEnv: env.NODE_ENV || 'development'
        },
        processes: trackedProcesses.map(p => ({
          ...p,
          running: p.running,
          uptime: p.running ? formatUptime(p.startTime) : 'stopped'
        })),
        ports: portStatus
      };
      
      if (options.json) {
        console.log(JSON.stringify(status, null, 2));
        return;
      }
      
      // Pretty print status
      console.log(chalk.bold.cyan('\n🚀 Development Environment Status\n'));
      
      // Environment info
      console.log(chalk.bold('Environment:'));
      console.log(chalk.gray(`  Node: ${status.environment.node}`));
      console.log(chalk.gray(`  Platform: ${status.environment.platform}`));
      console.log(chalk.gray(`  Sanity Project: ${status.environment.sanityProject}`));
      console.log(chalk.gray(`  Sanity Dataset: ${status.environment.sanityDataset}`));
      console.log(chalk.gray(`  Node Env: ${status.environment.nodeEnv}`));
      
      // Process info
      console.log(chalk.bold('\nProcesses:'));
      if (status.processes.length === 0) {
        console.log(chalk.gray('  No tracked processes'));
      } else {
        status.processes.forEach(proc => {
          const statusIcon = proc.running ? chalk.green('✓') : chalk.red('✗');
          console.log(`  ${statusIcon} PID ${proc.pid}: ${proc.command}`);
          if (proc.running) {
            console.log(chalk.gray(`    Uptime: ${proc.uptime}`));
          }
        });
      }
      
      // Port info
      console.log(chalk.bold('\nPorts:'));
      status.ports.forEach(port => {
        const statusIcon = port.available ? chalk.gray('○') : chalk.green('●');
        const portName = port.port === 3000 ? 'Next.js' : 
                        port.port === 3333 ? 'Sanity Studio' : 
                        `Port ${port.port}`;
        console.log(`  ${statusIcon} ${portName} (${port.port}): ${port.available ? 'free' : 'in use'}`);
      });
      
      console.log('');
      
    } catch (error) {
      console.error(chalk.red('Error checking status:'), error);
      process.exit(1);
    }
  });

function formatUptime(startTime: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(startTime).getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}