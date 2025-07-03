#!/usr/bin/env node

/**
 * Stop Storybook Background Process
 */

import { exec } from 'child_process';
import { readFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 6006;
const PID_FILE = join(__dirname, '..', 'storybook.pid');

async function stopStorybook() {
  let stopped = false;

  // Try to read PID file
  if (existsSync(PID_FILE)) {
    try {
      const pid = readFileSync(PID_FILE, 'utf8').trim();
      console.log(`Stopping Storybook process (PID: ${pid})...`);
      
      try {
        process.kill(parseInt(pid), 'SIGTERM');
        stopped = true;
        console.log(`✅ Stopped Storybook process ${pid}`);
      } catch (error) {
        if (error.code === 'ESRCH') {
          console.log(`Process ${pid} was not running`);
        } else {
          console.error(`Error stopping process: ${error.message}`);
        }
      }
      
      unlinkSync(PID_FILE);
    } catch (_error) {
      console.log('Could not read PID file');
    }
  }

  // Also kill any process on the port
  try {
    const { stdout } = await execAsync(`lsof -ti:${PORT}`);
    if (stdout && stdout.trim()) {
      const pids = stdout.trim().split('\n');
      console.log(`Killing processes on port ${PORT}: ${pids.join(', ')}`);
      
      try {
        await execAsync(`kill -9 ${pids.join(' ')}`);
        stopped = true;
        console.log(`✅ Port ${PORT} cleared`);
      } catch (error) {
        console.error(`Error killing processes: ${error.message}`);
      }
    } else if (!stopped) {
      console.log(`✅ Port ${PORT} is already free`);
    }
  } catch (_error) {
    if (!stopped) {
      console.log(`✅ No Storybook process found`);
    }
  }
}

// Run
stopStorybook();