#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const rootDir = path.resolve(__dirname, '../..');
const pidDir = path.join(rootDir, '.turbo-pids');
const logDir = path.join(rootDir, '.turbo-logs');

const services = [
  { name: 'web', port: 3000, description: 'Next.js Frontend' },
  { name: 'studio', port: 3333, description: 'Sanity Studio' },
  { name: 'storybook', port: 6006, description: 'Storybook UI' }
];

async function checkProcessStatus(pidFile) {
  const pidPath = path.join(pidDir, pidFile);
  
  if (!fs.existsSync(pidPath)) {
    return { running: false };
  }
  
  try {
    const pid = fs.readFileSync(pidPath, 'utf8').trim();
    process.kill(pid, 0);
    return { running: true, pid };
  } catch (e) {
    // Process not running, clean up stale PID file
    fs.unlinkSync(pidPath);
    return { running: false };
  }
}

async function checkPort(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    return stdout.trim() !== '';
  } catch (e) {
    return false;
  }
}

async function getLogInfo(service) {
  const logPath = path.join(logDir, `${service}.log`);
  
  if (!fs.existsSync(logPath)) {
    return null;
  }
  
  const stats = fs.statSync(logPath);
  const lastModified = new Date(stats.mtime);
  const now = new Date();
  const minutesAgo = Math.floor((now - lastModified) / 1000 / 60);
  
  return {
    size: (stats.size / 1024).toFixed(1) + ' KB',
    lastModified: minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`
  };
}

async function main() {
  console.log('📊 Process Manager Status\n');
  console.log('Services:');
  console.log('─'.repeat(80));
  
  for (const service of services) {
    const status = await checkProcessStatus(`${service.name}.pid`);
    const portInUse = await checkPort(service.port);
    const logInfo = await getLogInfo(service.name);
    
    let statusEmoji, statusText;
    
    if (status.running) {
      statusEmoji = '✅';
      statusText = `Running (PID: ${status.pid})`;
    } else if (portInUse) {
      statusEmoji = '⚠️';
      statusText = `Port ${service.port} in use (not managed)`;
    } else {
      statusEmoji = '❌';
      statusText = 'Stopped';
    }
    
    console.log(`${statusEmoji} ${service.name.padEnd(12)} | ${service.description.padEnd(20)} | ${statusText}`);
    
    if (logInfo) {
      console.log(`   └─ Log: ${logInfo.size}, updated ${logInfo.lastModified}`);
    }
  }
  
  console.log('─'.repeat(80));
  
  // Show available commands
  console.log('\nAvailable commands:');
  console.log('  pnpm start           - Start all services');
  console.log('  pnpm start:background - Start in background');
  console.log('  pnpm restart         - Restart all services');
  console.log('  pnpm stop            - Stop all services');
  console.log('  pnpm logs            - View logs');
  
  // Check for stale processes
  if (fs.existsSync(pidDir)) {
    const pidFiles = fs.readdirSync(pidDir);
    const knownServices = services.map(s => `${s.name}.pid`);
    const unknownPids = pidFiles.filter(f => !knownServices.includes(f) && f.endsWith('.pid'));
    
    if (unknownPids.length > 0) {
      console.log('\n⚠️  Found unknown PID files:', unknownPids.join(', '));
      console.log('   Run "pnpm stop" to clean up');
    }
  }
}

main().catch(console.error);