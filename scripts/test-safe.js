#!/usr/bin/env node

/**
 * Safe test runner that ensures services are stopped first
 * Prevents port conflicts during test runs
 */

const { spawn } = require('child_process');
const path = require('path');

async function main() {
  console.log('🧪 Running tests safely...\n');
  
  // First stop any running services to free up ports
  console.log('🛑 Stopping any running services...');
  const pmPath = path.join(__dirname, 'process-manager/v2/cli.js');
  
  const stopProc = spawn('node', [pmPath, 'stop', 'all'], { stdio: 'inherit' });
  
  stopProc.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.log('⚠️  Failed to stop services, but continuing with tests...');
    }
    
    // Small delay to ensure ports are freed
    setTimeout(() => {
      console.log('\n🧪 Running test suite...');
      
      // Run tests
      const testProc = spawn('pnpm', ['turbo', 'run', 'test'], {
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '1' }
      });
      
      testProc.on('close', (code) => {
        process.exit(code);
      });
      
    }, 1000);
  });
}

main();