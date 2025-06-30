import detectPort from 'detect-port';
import { execa } from 'execa';

interface PortStatus {
  port: number;
  available: boolean;
  process?: string;
}

export async function checkPorts(ports: number[]): Promise<PortStatus[]> {
  const results = await Promise.all(
    ports.map(async (port) => {
      const availablePort = await detectPort(port);
      const available = availablePort === port;
      
      let process: string | undefined;
      if (!available) {
        try {
          // Try to get process info
          if (process.platform === 'darwin' || process.platform === 'linux') {
            const { stdout } = await execa('lsof', ['-i', `:${port}`, '-t']);
            const pid = stdout.trim();
            if (pid) {
              const { stdout: psOutput } = await execa('ps', ['-p', pid, '-o', 'comm=']);
              process = psOutput.trim();
            }
          }
        } catch {
          // Couldn't get process info
        }
      }
      
      return { port, available, process };
    })
  );
  
  return results;
}

interface KillOptions {
  force?: boolean;
  timeout?: number;
}

interface KillResult {
  killed: number[];
  failed: number[];
}

export async function killPorts(ports: number[], options: KillOptions = {}): Promise<KillResult> {
  const { force = false, timeout = 5000 } = options;
  const killed: number[] = [];
  const failed: number[] = [];
  
  for (const port of ports) {
    try {
      // Check if port is in use
      const availablePort = await detectPort(port);
      if (availablePort === port) {
        // Port is already free
        continue;
      }
      
      // Get PIDs using the port
      const pids = await getPortPids(port);
      
      for (const pid of pids) {
        try {
          if (force) {
            // Force kill
            process.kill(pid, 'SIGKILL');
          } else {
            // Graceful shutdown
            process.kill(pid, 'SIGTERM');
            
            // Wait for process to exit
            await waitForProcessExit(pid, timeout);
          }
          
          killed.push(port);
        } catch {
          // Try force kill if graceful failed
          if (!force) {
            try {
              process.kill(pid, 'SIGKILL');
              killed.push(port);
            } catch {
              failed.push(port);
            }
          } else {
            failed.push(port);
          }
        }
      }
    } catch {
      failed.push(port);
    }
  }
  
  return { killed: [...new Set(killed)], failed: [...new Set(failed)] };
}

async function getPortPids(port: number): Promise<number[]> {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execa('netstat', ['-ano']);
      const lines = stdout.split('\n');
      const pids: number[] = [];
      
      for (const line of lines) {
        if (line.includes(`:${port}`)) {
          const parts = line.trim().split(/\\s+/);
          const pid = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(pid)) {
            pids.push(pid);
          }
        }
      }
      
      return [...new Set(pids)];
    } else {
      const { stdout } = await execa('lsof', ['-ti', `:${port}`]);
      return stdout.trim().split('\n').map(pid => parseInt(pid, 10)).filter(pid => !isNaN(pid));
    }
  } catch {
    return [];
  }
}

async function waitForProcessExit(pid: number, timeout: number): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      process.kill(pid, 0);
      // Process still exists, wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch {
      // Process no longer exists
      return;
    }
  }
  
  throw new Error(`Process ${pid} did not exit within ${timeout}ms`);
}