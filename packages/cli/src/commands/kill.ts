import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { killPorts } from '../lib/port-utils.js';
import { ProcessTracker } from '../lib/process-tracker.js';

export const killCommand = new Command('kill')
  .description('Kill all development processes')
  .alias('stop')
  .option('-p, --port <port>', 'Kill specific port', (val) => parseInt(val, 10))
  .option('-f, --force', 'Force kill without graceful shutdown', false)
  .action(async (options) => {
    const spinner = ora('Stopping processes...').start();
    
    try {
      const tracker = new ProcessTracker();
      
      // Get ports to kill
      const ports = options.port ? [options.port] : [3000, 3001, 3002, 3003, 3004, 3333];
      
      // Kill processes on ports
      const results = await killPorts(ports, { force: options.force });
      
      // Clean up tracker
      await tracker.cleanup();
      
      if (results.killed.length === 0) {
        spinner.info('No processes were running');
      } else {
        spinner.succeed(`Stopped processes on ports: ${results.killed.join(', ')}`);
      }
      
      if (results.failed.length > 0) {
        console.warn(chalk.yellow(`\nFailed to stop processes on ports: ${results.failed.join(', ')}`));
        console.log(chalk.gray('You may need to manually kill these processes'));
      }
      
    } catch (error) {
      spinner.fail('Failed to stop processes');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });