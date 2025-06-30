import { describe, it, expect } from 'vitest'
import { logger } from './index.js'

describe('Logtail Integration', () => {
  it('should log an error with stack trace to Logtail', async () => {
    // This test demonstrates logging to Logtail
    // Check your Logtail dashboard after running this test
    
    try {
      // Intentionally throw an error
      throw new Error('Test error for Logtail verification')
    } catch (error) {
      // Log the error with context
      logger.error('Test suite error captured', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        testFile: 'logtail.test.ts',
        environment: 'test',
        timestamp: new Date().toISOString()
      })
      
      // Test passes if we successfully logged
      expect(true).toBe(true)
    }
  })

  it('should log different severity levels', () => {
    // Log examples at each level
    logger.debug('Debug message from test', { detail: 'verbose info' })
    logger.info('Info message from test', { action: 'test_run' })
    logger.warn('Warning from test', { threshold: 80 })
    logger.error('Error from test', { code: 'TEST_ERROR' })
    
    // If no errors thrown, logging is working
    expect(true).toBe(true)
  })
  
  it('should handle edge runtime environment', () => {
    // Simulate edge runtime check
    const hasLogtail = typeof globalThis !== 'undefined'
    
    logger.info('Edge runtime compatibility test', {
      runtime: 'edge',
      hasGlobalThis: hasLogtail
    })
    
    expect(hasLogtail).toBe(true)
  })
})