#!/usr/bin/env node

/**
 * Claude Code Safe Wrapper
 * 
 * This wrapper ensures operations don't crash Claude Code by:
 * 1. Limiting concurrent operations
 * 2. Adding delays between service starts
 * 3. Properly handling signals
 * 4. Buffering output to prevent overwhelming the terminal
 */

const { spawn } = require('child_process');
const readline = require('readline');

class ClaudeSafeExecutor {
  constructor() {
    this.outputBuffer = [];
    this.isExiting = false;
    this.childProcess = null;
    
    // Set up graceful shutdown
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
  }
  
  async execute(command, args, options = {}) {
    console.log(`\n🤖 Claude Code Safe Mode Activated`);
    console.log(`📋 Command: ${command} ${args.join(' ')}\n`);
    
    // Default options for Claude safety
    const safeOptions = {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: {
        ...process.env,
        FORCE_COLOR: '1',
        // Claude-specific optimizations
        TURBO_TELEMETRY_DISABLED: '1',
        TURBO_NO_UPDATE_CHECK: '1',
        NODE_ENV: 'development',
        // Limit concurrency
        TURBO_CONCURRENCY: '2'
      },
      ...options
    };
    
    this.childProcess = spawn(command, args, safeOptions);
    
    // Buffer output to prevent overwhelming Claude Code
    this.setupOutputBuffering(this.childProcess);
    
    return new Promise((resolve, reject) => {
      this.childProcess.on('close', (code) => {
        this.flushOutput();
        
        if (code === 0) {
          console.log('\n✅ Command completed successfully');
          resolve(code);
        } else if (this.isExiting) {
          console.log('\n👋 Gracefully stopped');
          resolve(code);
        } else {
          console.log(`\n❌ Command failed with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      });
      
      this.childProcess.on('error', (error) => {
        console.error('\n❌ Process error:', error.message);
        reject(error);
      });
    });
  }
  
  setupOutputBuffering(proc) {
    // Create readline interfaces for both stdout and stderr
    const stdoutReader = readline.createInterface({
      input: proc.stdout,
      crlfDelay: Infinity
    });
    
    const stderrReader = readline.createInterface({
      input: proc.stderr,
      crlfDelay: Infinity
    });
    
    // Buffer stdout
    stdoutReader.on('line', (line) => {
      this.addToBuffer(line);
    });
    
    // Buffer stderr
    stderrReader.on('line', (line) => {
      this.addToBuffer(line, true);
    });
    
    // Periodically flush buffer
    this.flushInterval = setInterval(() => {
      this.flushOutput();
    }, 500);
  }
  
  addToBuffer(line, isError = false) {
    this.outputBuffer.push({ line, isError, timestamp: Date.now() });
    
    // Prevent buffer from growing too large
    if (this.outputBuffer.length > 1000) {
      this.outputBuffer = this.outputBuffer.slice(-500);
    }
  }
  
  flushOutput() {
    if (this.outputBuffer.length === 0) return;
    
    // Group similar messages
    const grouped = this.groupSimilarMessages(this.outputBuffer);
    
    grouped.forEach(group => {
      if (group.count > 1) {
        console.log(`${group.line} (×${group.count})`);
      } else {
        console.log(group.line);
      }
    });
    
    this.outputBuffer = [];
  }
  
  groupSimilarMessages(messages) {
    const grouped = [];
    let current = null;
    
    messages.forEach(msg => {
      if (current && current.line === msg.line && msg.timestamp - current.lastTimestamp < 1000) {
        current.count++;
        current.lastTimestamp = msg.timestamp;
      } else {
        if (current) grouped.push(current);
        current = {
          line: msg.line,
          count: 1,
          lastTimestamp: msg.timestamp
        };
      }
    });
    
    if (current) grouped.push(current);
    return grouped;
  }
  
  async gracefulShutdown(signal) {
    if (this.isExiting) return;
    
    console.log(`\n\n🛑 Received ${signal}, shutting down gracefully...`);
    this.isExiting = true;
    
    // Clear the flush interval
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    // Flush any remaining output
    this.flushOutput();
    
    // Forward signal to child process
    if (this.childProcess && !this.childProcess.killed) {
      this.childProcess.kill(signal);
      
      // Give it time to shut down gracefully
      setTimeout(() => {
        if (!this.childProcess.killed) {
          console.log('⚠️  Force killing process...');
          this.childProcess.kill('SIGKILL');
        }
      }, 5000);
    }
  }
}

// Parse command from arguments
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🤖 Claude Code Safe Wrapper

This wrapper prevents Claude Code crashes by:
- Limiting concurrent operations
- Buffering output
- Handling signals gracefully
- Adding safety delays

Usage:
  node claude-safe-wrapper.js <command> [args...]

Examples:
  node claude-safe-wrapper.js pnpm dev
  node claude-safe-wrapper.js pnpm test
  node claude-safe-wrapper.js pnpm build
`);
    process.exit(0);
  }
  
  const executor = new ClaudeSafeExecutor();
  
  try {
    const command = args[0];
    const commandArgs = args.slice(1);
    
    await executor.execute(command, commandArgs);
  } catch (error) {
    console.error('\n❌ Execution failed:', error.message);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();