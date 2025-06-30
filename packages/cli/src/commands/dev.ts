import { Command } from 'commander';
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { validateEnvironment } from '@workspace/env-config';
import { ProcessTracker } from '../lib/process-tracker.js';
import { checkPorts } from '../lib/port-utils.js';

export const devCommand = new Command('dev')
  .description('Start development servers')
  .option('-b, --background', 'Run in background mode', false)
  .option('-w, --watch', 'Run with live output', false)
  .option('--skip-env-check', 'Skip environment validation', false)
  .option('--filter <app>', 'Start only specific app (web, studio)')
  .action(async (options) => {
    const spinner = ora('Starting development environment...').start();
    
    try {
      // Validate environment unless skipped
      if (!options.skipEnvCheck) {
        spinner.text = 'Validating environment...';
        const envResult = validateEnvironment();
        
        if (!envResult.valid) {
          spinner.fail('Environment validation failed');
          console.error(chalk.red('\nEnvironment errors:'));
          envResult.errors.forEach(error => {
            console.error(chalk.red(`  • ${error.field}: ${error.message}`));
          });
          process.exit(1);
        }
        
        if (envResult.warnings.length > 0) {
          spinner.warn('Environment validated with warnings');
          console.warn(chalk.yellow('\nEnvironment warnings:'));
          envResult.warnings.forEach(warning => {
            console.warn(chalk.yellow(`  • ${warning.field}: ${warning.message}`));
          });
        } else {
          spinner.succeed('Environment validated');
        }
      }
      
      // Check if ports are available
      spinner.start('Checking port availability...');
      const portsToCheck = options.filter === 'studio' ? [3333] : 
                          options.filter === 'web' ? [3000] : 
                          [3000, 3333];
      
      const portResults = await checkPorts(portsToCheck);
      const unavailable = portResults.filter(p => !p.available);
      
      if (unavailable.length > 0) {
        spinner.fail('Ports in use');
        console.error(chalk.red('\nThe following ports are already in use:'));
        unavailable.forEach(port => {
          console.error(chalk.red(`  • Port ${port.port}: ${port.process || 'unknown process'}`));
        });
        console.log(chalk.yellow('\nTry running "pnpm kill" to stop existing processes'));
        process.exit(1);
      }
      
      spinner.succeed('Ports available');
      
      // Start development servers
      spinner.start('Starting TurboRepo...');
      
      const tracker = new ProcessTracker();
      const args = ['turbo', 'dev'];
      
      if (options.filter) {
        args.push(`--filter=${options.filter}`);
      }
      
      if (options.background && !options.watch) {
        // Background mode
        const subprocess = execa('pnpm', args, {
          detached: true,
          stdio: 'ignore',
          cleanup: false
        });
        
        subprocess.unref();
        
        await tracker.track({
          pid: subprocess.pid!,
          command: `pnpm ${args.join(' ')}`,
          ports: portsToCheck,
          startTime: new Date()
        });
        
        spinner.succeed('Started development servers in background');
        
        console.log(chalk.green('\n✓ Development servers started'));
        console.log(chalk.gray('\nAccess your apps at:'));
        if (!options.filter || options.filter === 'web') {
          console.log(chalk.cyan('  • Next.js: http://localhost:3000'));
        }
        if (!options.filter || options.filter === 'studio') {
          console.log(chalk.cyan('  • Sanity Studio: http://localhost:3333'));
        }
        console.log(chalk.gray('\nRun "pnpm status" to check process status'));
        console.log(chalk.gray('Run "pnpm kill" to stop all processes'));
        
      } else {
        // Watch mode (live output)
        spinner.succeed('Starting development servers with live output');
        
        await execa('pnpm', args, {
          stdio: 'inherit'
        });
      }
      
    } catch (error) {
      spinner.fail('Failed to start development environment');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });