import { NextRequest, NextResponse } from 'next/server';
import logger from '@workspace/logger';

export const runtime = 'nodejs'; // This endpoint runs in Node.js runtime

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  service?: string;
  meta?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const logs: LogEntry | LogEntry[] = body;
    const entries = Array.isArray(logs) ? logs : [logs];

    // Forward logs to the Node.js logger which can write to files
    entries.forEach((entry) => {
      // Map log levels to logger methods
      switch (entry.level) {
        case 'error':
          logger.error(`[Edge] ${entry.message}`, {
            ...entry.meta,
            service: entry.service || 'edge',
            edgeTimestamp: entry.timestamp,
          });
          break;
        case 'warn':
          logger.warn(`[Edge] ${entry.message}`, {
            ...entry.meta,
            service: entry.service || 'edge',
            edgeTimestamp: entry.timestamp,
          });
          break;
        case 'info':
          logger.info(`[Edge] ${entry.message}`, {
            ...entry.meta,
            service: entry.service || 'edge',
            edgeTimestamp: entry.timestamp,
          });
          break;
        case 'http':
          logger.http(`[Edge] ${entry.message}`, {
            ...entry.meta,
            service: entry.service || 'edge',
            edgeTimestamp: entry.timestamp,
          });
          break;
        case 'debug':
          logger.debug(`[Edge] ${entry.message}`, {
            ...entry.meta,
            service: entry.service || 'edge',
            edgeTimestamp: entry.timestamp,
          });
          break;
        default:
          console.warn(`Invalid log level: ${entry.level}`);
      }
    });

    return NextResponse.json({ success: true, processed: entries.length });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error('Failed to process edge logs', { 
      error: errorMessage,
      stack: errorStack,
      rawError: error
    });
    
    return NextResponse.json(
      { error: 'Failed to process logs', details: errorMessage },
      { status: 500 }
    );
  }
}