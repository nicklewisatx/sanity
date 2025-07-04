#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '../..');
const pidDir = path.join(rootDir, '.turbo-pids');

console.log('🔄 Restarting all processes...\n');

// Kill all running processes
try {
  console.log('📍 Stopping all running processes...');
  
  if (fs.existsSync(pidDir)) {
    const pidFiles = fs.readdirSync(pidDir);
    
    for (const pidFile of pidFiles) {
      if (pidFile.endsWith('.pid')) {
        const pidPath = path.join(pidDir, pidFile);
        try {
          const pid = fs.readFileSync(pidPath, 'utf8').trim();
          const appName = pidFile.replace('.pid', '');
          
          // Check if process is still running
          try {
            process.kill(pid, 0);
            // If we get here, process is running
            console.log(`  ✓ Killing ${appName} (PID: ${pid})`);
            process.kill(pid, 'SIGTERM');
          } catch (e) {
            // Process not running, just clean up the file
            console.log(`  - ${appName} already stopped`);
          }
          
          // Remove PID file
          fs.unlinkSync(pidPath);
        } catch (error) {
          console.error(`  ⚠️  Error handling ${pidFile}: ${error.message}`);
        }
      }
    }
  }
  
  // Give processes time to shut down gracefully
  console.log('\n⏳ Waiting for processes to shut down...');
  execSync('sleep 2');
  
} catch (error) {
  console.error('⚠️  Error stopping processes:', error.message);
}

// Start processes in background
console.log('\n🚀 Starting processes in background...\n');

try {
  execSync('pnpm start:background', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  
  console.log('\n✅ All processes restarted successfully!');
  console.log('📊 Run "pnpm status" to check process status');
  
} catch (error) {
  console.error('\n❌ Error starting processes:', error.message);
  process.exit(1);
}