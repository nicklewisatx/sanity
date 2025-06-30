import { describe, it, expect, vi } from 'vitest'
import { logger } from './index.js'

describe('Logger', () => {
  it('should export logger with all log methods', () => {
    expect(logger).toBeDefined()
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })

  it('should log with context', () => {
    // Mock console methods to verify they're called
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    
    logger.info('Test message', { userId: '123', action: 'test' })
    
    // In fallback mode (no Logtail token in test), should call console
    if (!process.env.LOGTAIL_TOKEN) {
      expect(consoleSpy).toHaveBeenCalled()
    }
    
    consoleSpy.mockRestore()
  })
})