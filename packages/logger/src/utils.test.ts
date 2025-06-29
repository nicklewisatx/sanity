import { describe, it, expect, vi, beforeEach } from 'vitest'
import { safeStringify, getLogLevel, shouldLog } from './utils'

describe('safeStringify', () => {
  it('should handle simple objects', () => {
    const obj = { name: 'test', value: 123 }
    const result = safeStringify(obj)
    expect(JSON.parse(result)).toEqual(obj)
  })

  it('should handle circular references', () => {
    const obj: any = { name: 'test' }
    obj.self = obj
    const result = safeStringify(obj)
    expect(result).toContain('[Circular]')
  })

  it('should handle Error objects', () => {
    const error = new Error('Test error')
    const result = safeStringify(error)
    const parsed = JSON.parse(result)
    expect(parsed.message).toBe('Test error')
    expect(parsed.name).toBe('Error')
    expect(parsed.stack).toBeDefined()
  })

  it('should handle undefined values', () => {
    const obj = { value: undefined }
    const result = safeStringify(obj)
    expect(result).toContain('[undefined]')
  })

  it('should handle Symbol values', () => {
    const obj = { value: Symbol('test') }
    const result = safeStringify(obj)
    expect(result).toContain('Symbol(test)')
  })

  it('should handle BigInt values', () => {
    const obj = { value: BigInt(123) }
    const result = safeStringify(obj)
    expect(result).toContain('123')
  })

  it('should handle function values', () => {
    const obj = { value: function testFunc() {} }
    const result = safeStringify(obj)
    expect(result).toContain('[Function: testFunc]')
  })

  it('should handle anonymous functions', () => {
    const obj = { value: () => {} }
    const result = safeStringify(obj)
    // Anonymous arrow functions will use the key name if no function name exists
    expect(result).toContain('[Function: value]')
  })
})

describe('getLogLevel', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('should return info by default', () => {
    expect(getLogLevel()).toBe('info')
  })

  it('should read from process.env', () => {
    vi.stubEnv('LOG_LEVEL', 'DEBUG')
    expect(getLogLevel()).toBe('debug')
  })

  it('should lowercase the level', () => {
    vi.stubEnv('LOG_LEVEL', 'ERROR')
    expect(getLogLevel()).toBe('error')
  })
})

describe('shouldLog', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('should log error messages at all levels', () => {
    const levels = ['error', 'warn', 'info', 'debug']
    levels.forEach(level => {
      vi.stubEnv('LOG_LEVEL', level)
      expect(shouldLog('error')).toBe(true)
    })
  })

  it('should not log debug messages at info level', () => {
    vi.stubEnv('LOG_LEVEL', 'info')
    expect(shouldLog('debug')).toBe(false)
  })

  it('should log all messages at debug level', () => {
    vi.stubEnv('LOG_LEVEL', 'debug')
    const levels = ['error', 'warn', 'info', 'debug']
    levels.forEach(level => {
      expect(shouldLog(level)).toBe(true)
    })
  })

  it('should handle invalid log levels gracefully', () => {
    vi.stubEnv('LOG_LEVEL', 'invalid')
    expect(shouldLog('error')).toBe(true)
    expect(shouldLog('warn')).toBe(true)
    expect(shouldLog('info')).toBe(true)
    expect(shouldLog('debug')).toBe(false)
  })
})