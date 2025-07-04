#!/usr/bin/env node

/**
 * Simple development server orchestration using industry-standard tools
 * Replaces complex custom process manager with concurrently
 */

const { spawn, execSync } = require('child_process');

// Service configuration
const services = {
  web: {
    name: 'WEB',
    port: 3000,
    command: 'pnpm',
    args: ['--filter=web', 'dev'],
    color: 'blue',
  },
  studio: {
    name: 'STUDIO',
    port: 3333,
    command: 'pnpm',
    args: ['--filter=studio', 'dev'],
    color: 'magenta',
  },
  storybook: {
    name: 'STORYBOOK',
    port: 6006,
    command: 'pnpm',
    args: ['--filter=@workspace/ui', 'storybook'],
    color: 'yellow',
  },
};

// Get services to run from command line args
const requestedServices = process.argv.slice(2);
const servicesToRun = requestedServices.length > 0 
  ? requestedServices.filter(s => services[s])
  : Object.keys(services);

if (servicesToRun.length === 0) {
  console.error('No valid services specified. Available: web, studio, storybook');
  process.exit(1);
}

// Run stop command to ensure clean state
console.log('🛑 Stopping all existing services...');
try {
  execSync('node scripts/stop.js', { stdio: 'inherit' });
} catch (error) {
  // If stop fails, continue anyway
  console.log('⚠️  Stop command failed, continuing...');
}
console.log('');

// Build concurrently command
const commands = servicesToRun.map(name => {
  const service = services[name];
  return `"${service.command} ${service.args.join(' ')}"`;
});

const names = servicesToRun.map(name => services[name].name).join(',');
const colors = servicesToRun.map(name => services[name].color).join(',');

// Execute concurrently
const concurrentlyArgs = [
  '--kill-others',
  '--kill-others-on-fail',
  '--restart-tries=0',
  '--names', names,
  '--prefix-colors', colors,
  ...commands
];

console.log('🚀 Starting development servers...\n');
console.log(`Services: ${servicesToRun.join(', ')}`);
console.log('Press Ctrl+C to stop all services\n');

const concurrently = spawn('pnpm', ['exec', 'concurrently', ...concurrentlyArgs], {
  stdio: 'inherit',
  shell: true,
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all services...');
  concurrently.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  concurrently.kill('SIGTERM');
  process.exit(0);
});

concurrently.on('exit', (code) => {
  process.exit(code || 0);
});