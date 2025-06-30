#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const PORTS = [3000, 3001, 3002, 3003, 3004, 3333];
const PROCESS_FILE = path.join(__dirname, '..', '.turbo-processes.json');

async function killPortsOnUnix() {
  const portsStr = PORTS.join(',');
  
  return new Promise((resolve) => {
    exec(`lsof -ti:${portsStr}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log('No processes found on ports', PORTS.join(', '));
        resolve([]);
        return;
      }

      const pids = stdout.trim().split('\n').filter(Boolean);
      console.log(`Found processes: ${pids.join(', ')}`);
      
      // First try graceful shutdown with SIGTERM
      pids.forEach(pid => {
        try {
          process.kill(pid, 'SIGTERM');
          console.log(`Sent SIGTERM to process ${pid}`);
        } catch (err) {
          console.error(`Failed to send SIGTERM to process ${pid}:`, err.message);
        }
      });
      
      // Wait a bit for graceful shutdown
      setTimeout(() => {
        pids.forEach(pid => {
          try {
            // Check if process still exists
            process.kill(pid, 0);
            // If we get here, process still exists, force kill
            process.kill(pid, 'SIGKILL');
            console.log(`Force killed process ${pid}`);
          } catch (err) {
            // Process doesn't exist anymore, that's good
            if (err.code !== 'ESRCH') {
              console.error(`Failed to force kill process ${pid}:`, err.message);
            }
          }
        });
        resolve(pids);
      }, 2000);
    });
  });
}

async function killPortsOnWindows() {
  const results = [];
  
  for (const port of PORTS) {
    await new Promise((resolve) => {
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error || !stdout.trim()) {
          console.log(`No process found on port ${port}`);
          resolve();
          return;
        }

        const lines = stdout.trim().split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            pids.add(pid);
          }
        });

        pids.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, (err) => {
            if (err) {
              console.error(`Failed to kill process ${pid}:`, err.message);
            } else {
              console.log(`Killed process ${pid} on port ${port}`);
              results.push(pid);
            }
          });
        });
        
        resolve();
      });
    });
  }
  
  return results;
}

async function cleanupProcessFile() {
  try {
    await fs.unlink(PROCESS_FILE);
    console.log('Cleaned up process tracking file');
  } catch (err) {
    // File might not exist, that's okay
  }
}

async function main() {
  console.log('Killing processes on ports:', PORTS.join(', '));
  
  const isWindows = process.platform === 'win32';
  
  try {
    if (isWindows) {
      await killPortsOnWindows();
    } else {
      await killPortsOnUnix();
    }
    
    await cleanupProcessFile();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();