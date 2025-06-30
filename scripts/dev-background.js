#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const PROCESS_FILE = path.join(__dirname, '..', '.turbo-processes.json');

async function saveProcessInfo(processes) {
  await fs.writeFile(PROCESS_FILE, JSON.stringify({ processes }, null, 2));
}

async function startInBackground() {
  console.log('Starting development servers in background...\n');
  
  const turbo = spawn('pnpm', ['turbo', 'dev'], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  
  // Unref allows parent to exit while child continues
  turbo.unref();
  
  const processInfo = {
    pid: turbo.pid,
    command: 'pnpm turbo dev',
    port: '3000, 3333',
    startTime: new Date().toISOString()
  };
  
  // Save process info
  await saveProcessInfo([processInfo]);
  
  console.log(`Started TurboRepo dev (PID: ${turbo.pid})`);
  console.log('\nServers starting on:');
  console.log('  - Next.js: http://localhost:3000');
  console.log('  - Sanity Studio: http://localhost:3333');
  console.log('\nUse "pnpm status" to check process status');
  console.log('Use "pnpm kill" to stop all processes');
  
  // Capture initial output for a few seconds
  let outputBuffer = '';
  
  turbo.stdout.on('data', (data) => {
    outputBuffer += data.toString();
  });
  
  turbo.stderr.on('data', (data) => {
    outputBuffer += data.toString();
  });
  
  // Show output for 3 seconds then exit parent
  setTimeout(() => {
    if (outputBuffer) {
      console.log('\nInitial output:');
      console.log('---------------');
      console.log(outputBuffer);
    }
    process.exit(0);
  }, 3000);
}

async function main() {
  try {
    await startInBackground();
  } catch (error) {
    console.error('Failed to start background dev:', error.message);
    process.exit(1);
  }
}

main();