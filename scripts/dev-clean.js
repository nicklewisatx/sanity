#!/usr/bin/env node

/**
 * Development server with automatic port cleanup
 * Kills any processes on required ports before starting
 */

const { spawn, execSync } = require('child_process');

// Get services to run
const requestedServices = process.argv.slice(2);

// Execute the simple dev script (which now handles cleanup)
const dev = spawn('node', ['scripts/dev-simple.js', ...requestedServices], {
  stdio: 'inherit',
});

dev.on('exit', (code) => {
  process.exit(code || 0);
});