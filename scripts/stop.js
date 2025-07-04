#!/usr/bin/env node

/**
 * Simple stop script to kill processes on development ports
 */

const { execSync } = require('child_process');

const ports = [3000, 3333, 6006];

console.log('🛑 Stopping all development servers...\n');

ports.forEach(port => {
  try {
    execSync(`pnpm exec kill-port ${port}`, { stdio: 'pipe' });
    console.log(`✓ Stopped process on port ${port}`);
  } catch (error) {
    console.log(`✓ No process running on port ${port}`);
  }
});

console.log('\n✨ All services stopped');