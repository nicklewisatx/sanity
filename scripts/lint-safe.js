#!/usr/bin/env node

/**
 * Safe lint runner that doesn't interfere with running services
 * Runs linting in parallel across all packages
 */

const { spawn } = require('child_process');

async function main() {
  console.log('🔍 Running linters...\n');
  
  // Run lint command with proper concurrency
  const lintProc = spawn('pnpm', ['turbo', 'run', 'lint', '--concurrency=4'], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      FORCE_COLOR: '1',
      // Ensure ESLint doesn't interfere with running services
      ESLINT_USE_FLAT_CONFIG: 'true'
    }
  });
  
  lintProc.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ All linting checks passed!');
    } else {
      console.log('\n❌ Linting issues found');
    }
    process.exit(code);
  });
}

main();