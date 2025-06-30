import { Logtail } from '@logtail/node'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export interface LogContext {
  [key: string]: any
}

export interface Logger {
  error: (message: string, context?: LogContext) => void
  warn: (message: string, context?: LogContext) => void
  info: (message: string, context?: LogContext) => void
  debug: (message: string, context?: LogContext) => void
}

// Get Logtail token from environment
const getLogtailToken = (): string | undefined => {
  // Edge runtime compatible env access
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env.LOGTAIL_TOKEN
  }
  // Cloudflare Workers
  if (typeof globalThis !== 'undefined' && (globalThis as any).LOGTAIL_TOKEN) {
    return (globalThis as any).LOGTAIL_TOKEN
  }
  return undefined
}

// Get ingestion host from environment (for EU region)
const getIngestionHost = (): string | undefined => {
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env.LOGTAIL_INGESTION_HOST
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).LOGTAIL_INGESTION_HOST) {
    return (globalThis as any).LOGTAIL_INGESTION_HOST
  }
  return undefined
}

// Create Logtail instance if token exists
const token = getLogtailToken()
const ingestionHost = getIngestionHost()
const logtail = token ? new Logtail(token, {
  endpoint: ingestionHost ? `https://${ingestionHost}` : undefined
}) : null

// Fallback console logger
const consoleLog = (level: LogLevel, message: string, context?: LogContext) => {
  const logData = { level, message, timestamp: new Date().toISOString(), ...context }
  
  switch (level) {
    case 'error':
      console.error(JSON.stringify(logData))
      break
    case 'warn':
      console.warn(JSON.stringify(logData))
      break
    case 'info':
      console.info(JSON.stringify(logData))
      break
    case 'debug':
      console.log(JSON.stringify(logData))
      break
  }
}

// Main logging function
const log = (level: LogLevel, message: string, context?: LogContext) => {
  if (logtail) {
    // Use Logtail's native methods
    switch (level) {
      case 'error':
        logtail.error(message, context)
        break
      case 'warn':
        logtail.warn(message, context)
        break
      case 'info':
        logtail.info(message, context)
        break
      case 'debug':
        logtail.debug(message, context)
        break
    }
  } else {
    // Fallback to console
    consoleLog(level, message, context)
  }
}

// Export logger instance
export const logger: Logger = {
  error: (message: string, context?: LogContext) => log('error', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
}

// Flush logs on process exit (Node.js only)
if (typeof globalThis !== 'undefined' && (globalThis as any).process?.on) {
  (globalThis as any).process.on('exit', () => {
    if (logtail) {
      logtail.flush()
    }
  })
}