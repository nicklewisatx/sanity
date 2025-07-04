#!/usr/bin/env node

/**
 * Emergency stop script
 * Stops all services and cleans up any orphaned processes
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('🛑 Emergency stop - cleaning up all processes...\n');
  
  const pmPath = path.join(__dirname, 'process-manager/v2/cli.js');
  
  // First try graceful stop
  try {
    console.log('📍 Stopping managed services...');
    execSync(`node ${pmPath} stop all`, { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Some services may have already been stopped');
  }
  
  // Clean up any orphaned processes on known ports
  const ports = [3000, 3333, 6006];
  
  for (const port of ports) {
    try {
      if (process.platform !== 'win32') {
        console.log(`🔍 Checking port ${port}...`);
        const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
        
        if (pids.length > 0) {
          console.log(`   Found process on port ${port}, terminating...`);
          pids.forEach(pid => {
            try {
              process.kill(parseInt(pid), 'SIGTERM');
            } catch (e) {
              // Process might already be gone
            }
          });
        }
      }
    } catch (error) {
      // No process on this port
    }
  }
  
  // Clean up PID files
  const pidDir = path.join(__dirname, '..', '.turbo-pids');
  if (fs.existsSync(pidDir)) {
    console.log('\n🧹 Cleaning up PID files...');
    const files = fs.readdirSync(pidDir);
    files.forEach(file => {
      if (file.endsWith('.pid')) {
        fs.unlinkSync(path.join(pidDir, file));
        console.log(`   Removed ${file}`);
      }
    });
  }
  
  // Clean up state file
  const stateFile = path.join(__dirname, '..', '.turbo-state.json');
  if (fs.existsSync(stateFile)) {
    fs.unlinkSync(stateFile);
    console.log('\n✅ Cleaned up state file');
  }
  
  console.log('\n✨ All processes stopped and cleaned up');
}

main();