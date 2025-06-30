import { Command } from 'commander';
import chalk from 'chalk';
import { validateEnvironment, getEnvConfigSafe } from '@workspace/env-config';
import fs from 'fs/promises';
import path from 'path';

export const envCommand = new Command('env')
  .description('Manage environment variables')
  .addCommand(
    new Command('validate')
      .description('Validate environment configuration')
      .action(async () => {
        console.log(chalk.bold.cyan('\n🔍 Validating Environment Variables\n'));
        
        const result = validateEnvironment();
        const env = getEnvConfigSafe();
        
        if (result.valid) {
          console.log(chalk.green('✓ Environment configuration is valid\n'));
        } else {
          console.log(chalk.red('✗ Environment configuration has errors\n'));
        }
        
        // Show errors
        if (result.errors.length > 0) {
          console.log(chalk.bold.red('Errors:'));
          result.errors.forEach(error => {
            console.log(chalk.red(`  • ${error.field}: ${error.message}`));
          });
          console.log('');
        }
        
        // Show warnings
        if (result.warnings.length > 0) {
          console.log(chalk.bold.yellow('Warnings:'));
          result.warnings.forEach(warning => {
            console.log(chalk.yellow(`  • ${warning.field}: ${warning.message}`));
          });
          console.log('');
        }
        
        // Show current values (masked)
        console.log(chalk.bold('Current Configuration:'));
        console.log(chalk.gray('  Sanity:'));
        console.log(chalk.gray(`    Project ID: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not set'}`));
        console.log(chalk.gray(`    Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET || 'not set'}`));
        console.log(chalk.gray(`    API Token: ${env.SANITY_API_READ_TOKEN ? '***' + env.SANITY_API_READ_TOKEN.slice(-4) : 'not set'}`));
        
        console.log(chalk.gray('  Vercel:'));
        console.log(chalk.gray(`    Environment: ${env.VERCEL_ENV || 'local'}`));
        
        console.log(chalk.gray('  Logging:'));
        console.log(chalk.gray(`    Logtail: ${env.LOGTAIL_TOKEN ? 'configured' : 'not configured'}`));
        
        if (!result.valid) {
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('setup')
      .description('Setup environment variables interactively')
      .action(async () => {
        console.log(chalk.bold.cyan('\n🛠  Environment Setup\n'));
        console.log(chalk.gray('This will help you create the necessary .env files\n'));
        
        // Check for existing .env files
        const rootDir = process.cwd();
        const envFiles = [
          { path: path.join(rootDir, '.env.local'), name: 'Root .env.local' },
          { path: path.join(rootDir, 'apps/web/.env.local'), name: 'Web app .env.local' },
          { path: path.join(rootDir, 'apps/studio/.env.local'), name: 'Studio .env.local' }
        ];
        
        for (const file of envFiles) {
          try {
            await fs.access(file.path);
            console.log(chalk.green(`✓ ${file.name} exists`));
          } catch {
            console.log(chalk.yellow(`⚠ ${file.name} not found`));
            
            // Create from example if available
            const examplePath = file.path.replace('.local', '.example');
            try {
              const exampleContent = await fs.readFile(examplePath, 'utf-8');
              await fs.writeFile(file.path, exampleContent);
              console.log(chalk.gray(`  Created from .env.example`));
            } catch {
              console.log(chalk.gray(`  No example file found`));
            }
          }
        }
        
        console.log(chalk.bold('\n\nNext steps:'));
        console.log(chalk.gray('1. Edit the .env.local files with your actual values'));
        console.log(chalk.gray('2. Get your Sanity project ID from: https://sanity.io/manage'));
        console.log(chalk.gray('3. Run "pnpm env validate" to check your configuration'));
      })
  );