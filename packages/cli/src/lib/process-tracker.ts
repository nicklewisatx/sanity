import fs from 'fs/promises';
import path from 'path';

interface TrackedProcess {
  pid: number;
  command: string;
  ports: number[];
  startTime: Date;
  running?: boolean;
}

export class ProcessTracker {
  private trackingFile: string;

  constructor() {
    this.trackingFile = path.join(process.cwd(), '.turbo-processes.json');
  }

  async track(process: TrackedProcess): Promise<void> {
    const existing = await this.getAll();
    const updated = [...existing.filter(p => p.pid !== process.pid), process];
    
    await fs.writeFile(
      this.trackingFile, 
      JSON.stringify({ processes: updated, lastUpdated: new Date() }, null, 2)
    );
  }

  async getAll(): Promise<TrackedProcess[]> {
    try {
      const content = await fs.readFile(this.trackingFile, 'utf-8');
      const data = JSON.parse(content);
      
      // Check if processes are still running
      const processes = await Promise.all(
        data.processes.map(async (proc: TrackedProcess) => {
          const running = await this.isProcessRunning(proc.pid);
          return { ...proc, running };
        })
      );
      
      return processes;
    } catch {
      return [];
    }
  }

  async remove(pid: number): Promise<void> {
    const existing = await this.getAll();
    const updated = existing.filter(p => p.pid !== pid);
    
    await fs.writeFile(
      this.trackingFile, 
      JSON.stringify({ processes: updated, lastUpdated: new Date() }, null, 2)
    );
  }

  async cleanup(): Promise<void> {
    try {
      await fs.unlink(this.trackingFile);
    } catch {
      // File might not exist
    }
  }

  private async isProcessRunning(pid: number): Promise<boolean> {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }
}