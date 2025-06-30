#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { devCommand } from './commands/dev.js';
import { killCommand } from './commands/kill.js';
import { statusCommand } from './commands/status.js';
import { envCommand } from './commands/env.js';
import { restartCommand } from './commands/restart.js';

const program = new Command();

program
  .name('sanity-cli')
  .description('CLI for managing the Sanity + Next.js monorepo')
  .version('1.0.0');

// Register commands
program.addCommand(devCommand);
program.addCommand(killCommand);
program.addCommand(statusCommand);
program.addCommand(envCommand);
program.addCommand(restartCommand);

// Parse arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}