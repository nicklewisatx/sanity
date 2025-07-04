#!/usr/bin/env node

/**
 * Claude Code optimized development server
 * - Rate-limited output to prevent terminal overload
 * - Extended timeouts for slower operations
 * - Clean error handling
 */

const { spawn } = require('child_process');
const readline = require('readline');

// Output buffer to prevent Claude Code from being overwhelmed
class OutputBuffer {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.buffer = [];
    this.timer = null;
    this.maxLines = 20; // Max lines to output at once
    this.interval = 500; // Milliseconds between flushes
  }

  add(line) {
    this.buffer.push(line);
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.interval);
    }
  }

  flush() {
    if (this.buffer.length === 0) return;
    
    const lines = this.buffer.splice(0, this.maxLines);
    const prefix = `[${this.name}]`;
    
    lines.forEach(line => {
      console.log(`${prefix} ${line}`);
    });

    this.timer = null;
    if (this.buffer.length > 0) {
      this.timer = setTimeout(() => this.flush(), this.interval);
    }
  }

  forceFlush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.flush();
  }
}

// Service configuration
const services = {
  web: {
    name: 'WEB',
    command: 'pnpm --filter=web dev',
    buffer: new OutputBuffer('WEB', 'blue'),
  },
  studio: {
    name: 'STUDIO',
    command: 'pnpm --filter=studio dev',
    buffer: new OutputBuffer('STUDIO', 'magenta'),
  },
  storybook: {
    name: 'STORYBOOK',
    command: 'pnpm --filter=@workspace/ui storybook',
    buffer: new OutputBuffer('STORYBOOK', 'yellow'),
  },
};

// Get services to run
const requestedServices = process.argv.slice(2);
const servicesToRun = requestedServices.length > 0 
  ? requestedServices.filter(s => services[s])
  : Object.keys(services);

console.log('🤖 Claude Code optimized development server\n');
console.log(`Starting: ${servicesToRun.join(', ')}`);
console.log('Output is rate-limited to prevent terminal overload\n');

// Start services with output buffering
const processes = servicesToRun.map(name => {
  const service = services[name];
  const proc = spawn(service.command, {
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  // Buffer stdout
  const stdoutReader = readline.createInterface({
    input: proc.stdout,
    crlfDelay: Infinity,
  });

  stdoutReader.on('line', (line) => {
    service.buffer.add(line);
  });

  // Buffer stderr
  const stderrReader = readline.createInterface({
    input: proc.stderr,
    crlfDelay: Infinity,
  });

  stderrReader.on('line', (line) => {
    service.buffer.add(line);
  });

  proc.on('exit', (code) => {
    service.buffer.forceFlush();
    if (code !== 0) {
      console.error(`\n❌ ${service.name} exited with code ${code}`);
    }
  });

  return { name: service.name, proc, buffer: service.buffer };
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  
  // Flush all buffers
  processes.forEach(({ buffer }) => buffer.forceFlush());
  
  // Kill all processes
  processes.forEach(({ proc }) => {
    if (!proc.killed) {
      proc.kill('SIGTERM');
    }
  });

  // Force exit after timeout
  setTimeout(() => {
    console.log('⚠️  Forcing exit...');
    process.exit(0);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Keep the process alive
setInterval(() => {}, 1000);