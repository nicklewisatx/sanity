import { Command } from 'commander';
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

export const restartCommand = new Command('restart')
  .description('Restart development servers')
  .option('--skip-kill', 'Skip killing existing processes', false)
  .action(async (options) => {
    const spinner = ora('Restarting development environment...').start();
    
    try {
      // Kill existing processes
      if (!options.skipKill) {
        spinner.text = 'Stopping existing processes...';
        await execa('pnpm', ['kill'], { stdio: 'pipe' });
        
        // Wait a moment for ports to be released
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Start dev servers
      spinner.text = 'Starting development servers...';
      await execa('pnpm', ['dev'], { stdio: 'pipe' });
      
      spinner.succeed('Development environment restarted');
      
    } catch (error) {
      spinner.fail('Failed to restart development environment');
      console.error(chalk.red('\nError:'), error);
      process.exit(1);
    }
  });