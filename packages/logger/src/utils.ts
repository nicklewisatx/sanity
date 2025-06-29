/**
 * Safe JSON stringify that handles circular references and special types
 */
export function safeStringify(obj: unknown): string {
  const seen = new WeakSet()
  
  return JSON.stringify(obj, (key, value) => {
    // Handle circular references
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
    }
    
    // Handle special types
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack
      }
    }
    
    // Handle undefined (which JSON.stringify normally omits)
    if (value === undefined) {
      return '[undefined]'
    }
    
    // Handle Symbol
    if (typeof value === 'symbol') {
      return value.toString()
    }
    
    // Handle BigInt
    if (typeof value === 'bigint') {
      return value.toString()
    }
    
    // Handle functions
    if (typeof value === 'function') {
      // For arrow functions, the name might be the key
      const funcName = value.name || key || 'anonymous'
      return '[Function: ' + funcName + ']'
    }
    
    return value
  })
}

/**
 * Get the current log level from environment
 */
export function getLogLevel(): string {
  // In Edge runtime, we need to access env differently
  let level = 'info'
  
  // Check for process.env in Node.js environments
  if (typeof globalThis !== 'undefined' && 'process' in globalThis) {
    const proc = (globalThis as any).process
    if (proc?.env?.LOG_LEVEL) {
      level = proc.env.LOG_LEVEL
    }
  }
  
  // Check for globalThis.LOG_LEVEL in edge environments
  if (typeof globalThis !== 'undefined' && 'LOG_LEVEL' in globalThis) {
    level = (globalThis as any).LOG_LEVEL
  }
  
  return level.toLowerCase()
}

/**
 * Check if a log level should be output based on current config
 */
export function shouldLog(level: string): boolean {
  const currentLevel = getLogLevel()
  const levels = ['error', 'warn', 'info', 'debug']
  const currentIndex = levels.indexOf(currentLevel)
  const levelIndex = levels.indexOf(level)
  
  // If current level is not found, default to info
  if (currentIndex === -1) {
    return levelIndex <= 2 // error, warn, info
  }
  
  return levelIndex <= currentIndex
}