#!/usr/bin/env node

/**
 * Storybook Background Runner with Port Cleanup and Timeout
 * Ensures Storybook runs cleanly without blocking the terminal
 */

import { spawn, exec } from 'child_process';
import { writeFileSync, appendFileSync, existsSync, unlinkSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 6006;
const LOG_FILE = join(__dirname, '..', 'storybook.log');
const PID_FILE = join(__dirname, '..', 'storybook.pid');
const STARTUP_TIMEOUT = 30000; // 30 seconds

// Kill any process using the port
async function killPort(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      console.log(`Killing processes on port ${port}: ${pids.join(', ')}`);
      await execAsync(`kill -9 ${pids.join(' ')}`);
      console.log(`✓ Port ${port} cleared`);
      // Wait a bit for the port to be fully released
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`✓ Port ${port} is free`);
    }
  } catch (_error) {
    console.log(`✓ Port ${port} is free`);
  }
}

// Clean up existing PID file
function cleanupPidFile() {
  if (existsSync(PID_FILE)) {
    try {
      const pid = parseInt(readFileSync(PID_FILE, 'utf8'));
      process.kill(pid, 'SIGTERM');
    } catch (_e) {
      // Process might already be dead
    }
    unlinkSync(PID_FILE);
  }
}

// Start Storybook in background
async function startStorybook() {
  await killPort(PORT);
  cleanupPidFile();

  console.log(`Starting Storybook on port ${PORT}...`);
  console.log(`Logs will be written to: ${LOG_FILE}`);

  // Create or truncate log file
  writeFileSync(LOG_FILE, `Storybook started at ${new Date().toISOString()}\n\n`);

  const storybook = spawn('pnpm', ['run', 'storybook:dev'], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'development' },
    cwd: join(__dirname, '..')
  });

  // Save PID for potential cleanup
  writeFileSync(PID_FILE, storybook.pid.toString());

  // Set up timeout
  const timeoutId = setTimeout(() => {
    console.error('❌ Storybook failed to start within 30 seconds');
    console.error('Check logs at:', LOG_FILE);
    try {
      process.kill(storybook.pid, 'SIGTERM');
    } catch (e) {
      // Process might have already exited
    }
    if (existsSync(PID_FILE)) {
      unlinkSync(PID_FILE);
    }
    process.exit(1);
  }, STARTUP_TIMEOUT);

  let started = false;

  // Monitor stdout for successful startup
  storybook.stdout.on('data', (data) => {
    const output = data.toString();
    appendFileSync(LOG_FILE, output);
    
    if (!started && (output.includes('Local:') || output.includes(`localhost:${PORT}`))) {
      started = true;
      clearTimeout(timeoutId);
      console.log(`✅ Storybook started successfully with PID: ${storybook.pid}`);
      console.log(`✅ Access Storybook at: http://localhost:${PORT}`);
      console.log(`\nCommands:`);
      console.log(`  View logs: pnpm storybook:logs`);
      console.log(`  Stop: pnpm storybook:stop`);
      
      // Detach the process
      storybook.unref();
      process.exit(0);
    }
  });

  // Monitor stderr for errors
  storybook.stderr.on('data', (data) => {
    const error = data.toString();
    appendFileSync(LOG_FILE, error);
    
    if (error.includes('EADDRINUSE')) {
      clearTimeout(timeoutId);
      console.error('❌ Port 6006 is already in use');
      process.exit(1);
    }
  });

  // Handle process errors
  storybook.on('error', (error) => {
    clearTimeout(timeoutId);
    console.error('❌ Failed to start Storybook:', error);
    unlinkSync(PID_FILE);
    process.exit(1);
  });
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

// Run
startStorybook();