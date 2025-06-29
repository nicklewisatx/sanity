import type { LogLevel, LogContext, LogEntry, Logger } from './types.js'
import { safeStringify, shouldLog } from './utils.js'

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