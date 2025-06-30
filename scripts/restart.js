#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');

const KILL_SCRIPT = path.join(__dirname, 'kill-ports.js');

async function killExistingProcesses() {
  console.log('Stopping existing processes...');
  
  return new Promise((resolve, reject) => {
    const kill = spawn('node', [KILL_SCRIPT], {
      stdio: 'inherit'
    });
    
    kill.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Kill script exited with code ${code}`));
      }
    });
    
    kill.on('error', reject);
  });
}

async function startDev() {
  console.log('\nStarting development servers...\n');
  
  const dev = spawn('pnpm', ['dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  dev.on('error', (err) => {
    console.error('Failed to start dev:', err);
    process.exit(1);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    dev.kill('SIGTERM');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    dev.kill('SIGTERM');
    process.exit(0);
  });
}

async function main() {
  console.log('Restarting development environment...\n');
  
  try {
    await killExistingProcesses();
    
    // Give a moment for ports to be released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await startDev();
  } catch (error) {
    console.error('Restart failed:', error.message);
    process.exit(1);
  }
}

main();