import type { LogLevel, LogContext, LogEntry, Logger } from './types.js'
import { safeStringify, shouldLog } from './utils.js'

// Configuration - edge-compatible way to access env vars
const getEnv = (key: string, defaultValue = ''): string => {
  // In edge runtime, env vars are available on globalThis
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env[key] || defaultValue
  }
  return defaultValue
}

const LOG_BUFFER_SIZE = parseInt(getEnv('LOG_BUFFER_SIZE', '100'))
const LOG_FLUSH_INTERVAL = parseInt(getEnv('LOG_FLUSH_INTERVAL', '5000')) // 5 seconds
const EDGE_LOG_HTTP = getEnv('EDGE_LOG_HTTP') === 'true'
const EDGE_LOG_ENDPOINT = getEnv('EDGE_LOG_ENDPOINT', '/api/logs')
const LOG_API_KEY = getEnv('LOG_API_KEY')

// Log buffer for batching
let logBuffer: LogEntry[] = []
let flushTimer: number | null = null

/**
 * Create a log entry with consistent structure
 */
function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context && { context })
  }
}

/**
 * Send logs to HTTP endpoint
 */
async function sendLogs(logs: LogEntry[]): Promise<void> {
  if (!EDGE_LOG_HTTP || logs.length === 0) return

  try {
    const response = await fetch(EDGE_LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(LOG_API_KEY && { 'Authorization': `Bearer ${LOG_API_KEY}` })
      },
      body: JSON.stringify({ logs }),
      // Short timeout for edge environments
      signal: AbortSignal.timeout(3000)
    })

    if (!response.ok) {
      console.error(`Failed to send logs: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    // Silently fail to avoid infinite loops
    console.error('Log drain error:', error)
  }
}

/**
 * Flush log buffer
 */
async function flushLogs(): Promise<void> {
  if (logBuffer.length === 0) return

  const logsToSend = [...logBuffer]
  logBuffer = []

  await sendLogs(logsToSend)
}

/**
 * Schedule log flush
 */
function scheduleFlush(): void {
  if (flushTimer) return

  flushTimer = setTimeout(async () => {
    flushTimer = null
    await flushLogs()
    // Reschedule if there are more logs
    if (logBuffer.length > 0) {
      scheduleFlush()
    }
  }, LOG_FLUSH_INTERVAL) as unknown as number
}

/**
 * Output log to console
 */
function outputLog(level: LogLevel, entry: LogEntry): void {
  const logString = safeStringify(entry)
  
  // Access console methods dynamically to support mocking
  const consoleMethods = {
    error: (...args: any[]) => console.error(...args),
    warn: (...args: any[]) => console.warn(...args),
    info: (...args: any[]) => console.info(...args),
    debug: (...args: any[]) => console.log(...args), // Use log for debug since console.debug might be filtered
  }
  
  const logMethod = consoleMethods[level]
  if (logMethod) {
    logMethod(logString)
  }

  // Add to buffer for HTTP draining
  if (EDGE_LOG_HTTP) {
    logBuffer.push(entry)
    
    // Flush immediately if buffer is full
    if (logBuffer.length >= LOG_BUFFER_SIZE) {
      flushLogs().catch(() => {})
    } else {
      scheduleFlush()
    }
  }
}

/**
 * Log with specific level
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) {
    return
  }
  
  const entry = createLogEntry(level, message, context)
  outputLog(level, entry)
}

/**
 * Main logger instance
 */
export const logger: Logger = {
  error: (message: string, context?: LogContext) => log('error', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
}

// Re-export types for convenience
export type { LogLevel, LogContext, LogEntry, Logger } from './types.js'