#!/usr/bin/env node

/**
 * Start services in background mode
 * Perfect for Claude Code and other tools that need non-blocking startup
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const pmPath = path.join(__dirname, 'process-manager/v2/cli.js');
  const logFile = path.join(__dirname, '..', 'dev.log');
  
  console.log('🚀 Starting services in background mode...');
  console.log(`📄 Logs will be written to: ${logFile}`);
  
  // Create log stream
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  
  // Write startup header
  logStream.write(`\n${'='.repeat(60)}\n`);
  logStream.write(`Background startup at ${new Date().toISOString()}\n`);
  logStream.write(`${'='.repeat(60)}\n\n`);
  
  // Start process manager
  const proc = spawn('node', [pmPath, 'start', 'all'], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
    env: { ...process.env, FORCE_COLOR: '1' }
  });
  
  // Allow the parent process to exit
  proc.unref();
  
  console.log('✅ Services starting in background');
  console.log('   Check status with: pnpm pm2 status');
  console.log('   View logs with: tail -f dev.log');
  console.log('   Stop with: pnpm pm2 stop all');
  
  // Give it a moment to start
  setTimeout(() => {
    spawn('node', [pmPath, 'status'], { stdio: 'inherit' });
  }, 3000);
}

main();