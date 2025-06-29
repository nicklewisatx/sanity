import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We need to capture console output differently since vitest doesn't intercept them properly
describe('logger', () => {
  let consoleOutput: { error: string[], warn: string[], info: string[], log: string[] }
  let originalConsole: { error: any, warn: any, info: any, log: any }

  beforeEach(() => {
    // Reset output
    consoleOutput = { error: [], warn: [], info: [], log: [] }
    
    // Store original console methods
    originalConsole = {
      error: console.error,
      warn: console.warn,
      info: console.info,
      log: console.log,
    }

    // Replace console methods to capture output
    console.error = (msg: string) => { consoleOutput.error.push(msg); originalConsole.error(msg) }
    console.warn = (msg: string) => { consoleOutput.warn.push(msg); originalConsole.warn(msg) }
    console.info = (msg: string) => { consoleOutput.info.push(msg); originalConsole.info(msg) }
    console.log = (msg: string) => { consoleOutput.log.push(msg); originalConsole.log(msg) }
    
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    // Restore console
    Object.assign(console, originalConsole)
    vi.clearAllMocks()
  })

  // Import logger after console is mocked
  const getLogger = () => {
    // Clear module cache to get fresh import
    vi.resetModules()
    return import('./index').then(m => m.logger)
  }

  describe('log output', () => {
    it('should log error messages to console.error', async () => {
      const logger = await getLogger()
      logger.error('Test error')
      
      expect(consoleOutput.error).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.error[0])
      expect(parsed.level).toBe('error')
      expect(parsed.message).toBe('Test error')
      expect(parsed.timestamp).toBeDefined()
    })

    it('should log warn messages to console.warn', async () => {
      const logger = await getLogger()
      logger.warn('Test warning')
      
      expect(consoleOutput.warn).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.warn[0])
      expect(parsed.level).toBe('warn')
      expect(parsed.message).toBe('Test warning')
    })

    it('should log info messages to console.info', async () => {
      const logger = await getLogger()
      logger.info('Test info')
      
      expect(consoleOutput.info).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.info[0])
      expect(parsed.level).toBe('info')
      expect(parsed.message).toBe('Test info')
    })

    it('should log debug messages to console.log', async () => {
      vi.stubEnv('LOG_LEVEL', 'debug')
      const logger = await getLogger()
      logger.debug('Test debug')
      
      expect(consoleOutput.log).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.log[0])
      expect(parsed.level).toBe('debug')
      expect(parsed.message).toBe('Test debug')
    })
  })

  describe('context support', () => {
    it('should include context in log output', async () => {
      const logger = await getLogger()
      const context = { userId: '123', action: 'login' }
      logger.info('User action', context)
      
      expect(consoleOutput.info).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.info[0])
      expect(parsed.context).toEqual(context)
    })

    it('should handle complex context objects', async () => {
      const logger = await getLogger()
      const context = {
        user: { id: '123', name: 'Test User' },
        metadata: { timestamp: Date.now(), version: '1.0.0' },
        error: new Error('Test error')
      }
      logger.error('Complex error', context)
      
      expect(consoleOutput.error).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.error[0])
      expect(parsed.context.user).toEqual(context.user)
      expect(parsed.context.metadata).toEqual(context.metadata)
      expect(parsed.context.error.message).toBe('Test error')
      expect(parsed.context.error.name).toBe('Error')
    })
  })

  describe('log level filtering', () => {
    it('should respect log level settings', async () => {
      vi.stubEnv('LOG_LEVEL', 'warn')
      const logger = await getLogger()
      
      logger.error('Error - should log')
      logger.warn('Warn - should log')
      logger.info('Info - should not log')
      logger.debug('Debug - should not log')
      
      expect(consoleOutput.error).toHaveLength(1)
      expect(consoleOutput.warn).toHaveLength(1)
      expect(consoleOutput.info).toHaveLength(0)
      expect(consoleOutput.log).toHaveLength(0)
    })

    it('should log everything at debug level', async () => {
      vi.stubEnv('LOG_LEVEL', 'debug')
      const logger = await getLogger()
      
      logger.error('Error')
      logger.warn('Warn')
      logger.info('Info')
      logger.debug('Debug')
      
      expect(consoleOutput.error).toHaveLength(1)
      expect(consoleOutput.warn).toHaveLength(1)
      expect(consoleOutput.info).toHaveLength(1)
      expect(consoleOutput.log).toHaveLength(1)
    })
  })

  describe('timestamp format', () => {
    it('should include ISO timestamp', async () => {
      const logger = await getLogger()
      const before = new Date().toISOString()
      logger.info('Test')
      const after = new Date().toISOString()
      
      expect(consoleOutput.info).toHaveLength(1)
      const parsed = JSON.parse(consoleOutput.info[0])
      
      expect(parsed.timestamp).toBeDefined()
      expect(new Date(parsed.timestamp).toISOString()).toBe(parsed.timestamp)
      
      // Timestamp should be between before and after
      expect(parsed.timestamp >= before).toBe(true)
      expect(parsed.timestamp <= after).toBe(true)
    })
  })
})