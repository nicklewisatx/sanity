#!/usr/bin/env node

/**
 * Simple development server starter
 * Handles cleanup and starts all services
 */

const { spawn } = require('child_process');
const path = require('path');

async function main() {
  console.log('🚀 Starting development servers...\n');
  
  // Use the new process manager
  const pmPath = path.join(__dirname, 'process-manager/v2/cli.js');
  
  // First, clean up any existing processes
  console.log('🧹 Cleaning up existing processes...');
  spawn('node', [pmPath, 'stop', 'all'], { stdio: 'inherit' }).on('close', () => {
    
    // Small delay to ensure cleanup
    setTimeout(() => {
      console.log('\n🚀 Starting fresh instances...');
      
      // Start all services
      const proc = spawn('node', [pmPath, 'start', 'all'], { 
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '1' }
      });
      
      // Handle Ctrl+C gracefully
      process.on('SIGINT', () => {
        console.log('\n\n👋 Shutting down development servers...');
        proc.kill('SIGINT');
      });
      
    }, 1000);
  });
}

main();