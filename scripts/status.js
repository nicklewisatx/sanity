#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const PROCESS_FILE = path.join(__dirname, '..', '.turbo-processes.json');

async function isProcessRunning(pid) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}"`);
      return stdout.includes(pid.toString());
    } else {
      // On Unix, kill -0 checks if process exists without killing it
      process.kill(pid, 0);
      return true;
    }
  } catch {
    return false;
  }
}

async function getProcessInfo() {
  try {
    const data = await fs.readFile(PROCESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { processes: [] };
  }
}

async function checkPortStatus(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      return stdout.trim() !== '';
    } else {
      const { stdout } = await execAsync(`lsof -ti:${port}`);
      return stdout.trim() !== '';
    }
  } catch {
    return false;
  }
}

function formatUptime(startTime) {
  const start = new Date(startTime);
  const now = new Date();
  const diff = now - start;
  
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

async function main() {
  console.log('\nTurboRepo Process Status');
  console.log('========================\n');

  const { processes } = await getProcessInfo();

  if (processes.length === 0) {
    console.log('No tracked processes found.');
    console.log('\nChecking ports directly...');
    
    const port3000 = await checkPortStatus(3000);
    const port3333 = await checkPortStatus(3333);
    
    if (port3000) console.log('✓ Port 3000 is in use (Next.js)');
    else console.log('✗ Port 3000 is free');
    
    if (port3333) console.log('✓ Port 3333 is in use (Sanity Studio)');
    else console.log('✗ Port 3333 is free');
    
    return;
  }

  console.log('Tracked Processes:');
  console.log('-----------------');
  
  for (const proc of processes) {
    const running = await isProcessRunning(proc.pid);
    const status = running ? '✓ Running' : '✗ Stopped';
    const uptime = running ? formatUptime(proc.startTime) : 'N/A';
    
    console.log(`\nPID: ${proc.pid} - ${status}`);
    console.log(`Command: ${proc.command}`);
    console.log(`Port: ${proc.port}`);
    console.log(`Uptime: ${uptime}`);
  }
  
  console.log('\nPort Status:');
  console.log('------------');
  
  const port3000 = await checkPortStatus(3000);
  const port3333 = await checkPortStatus(3333);
  
  console.log(`Port 3000 (Next.js): ${port3000 ? '✓ In use' : '✗ Free'}`);
  console.log(`Port 3333 (Sanity): ${port3333 ? '✓ In use' : '✗ Free'}`);
}

main().catch(console.error);