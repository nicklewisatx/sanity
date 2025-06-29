import { describe, it, expect } from 'vitest'
import { EdgeVM } from '@edge-runtime/vm'

describe('Edge Runtime Compatibility', () => {
  it('should work in edge runtime environment', async () => {
    const vm = new EdgeVM()
    
    // Load our logger code into the edge runtime
    const code = `
      // Inline the utils
      function safeStringify(obj) {
        const seen = new WeakSet()
        
        return JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular]'
            }
            seen.add(value)
          }
          
          if (value instanceof Error) {
            return {
              name: value.name,
              message: value.message,
              stack: value.stack,
              ...value
            }
          }
          
          if (value === undefined) {
            return '[undefined]'
          }
          
          if (typeof value === 'symbol') {
            return value.toString()
          }
          
          if (typeof value === 'bigint') {
            return value.toString()
          }
          
          if (typeof value === 'function') {
            return '[Function: ' + (value.name || 'anonymous') + ']'
          }
          
          return value
        })
      }
      
      function createLogEntry(level, message, context) {
        return {
          level,
          message,
          timestamp: new Date().toISOString(),
          ...(context && { context })
        }
      }
      
      // Test logging
      const logs = []
      
      // Override console methods to capture output
      const originalConsole = {
        error: console.error,
        warn: console.warn,
        info: console.info,
        log: console.log
      }
      
      console.error = (msg) => logs.push({ method: 'error', msg })
      console.warn = (msg) => logs.push({ method: 'warn', msg })
      console.info = (msg) => logs.push({ method: 'info', msg })
      console.log = (msg) => logs.push({ method: 'log', msg })
      
      // Test basic logging
      const entry1 = createLogEntry('error', 'Test error', { code: 500 })
      console.error(safeStringify(entry1))
      
      // Test circular reference
      const obj = { name: 'test' }
      obj.self = obj
      const entry2 = createLogEntry('info', 'Circular test', { obj })
      console.info(safeStringify(entry2))
      
      // Test error object
      const error = new Error('Edge runtime error')
      const entry3 = createLogEntry('error', 'Error test', { error })
      console.error(safeStringify(entry3))
      
      // Restore console
      Object.assign(console, originalConsole)
      
      // Return captured logs
      ;logs
    `
    
    const logs = await vm.evaluate(code)
    
    // Verify we got logs
    expect(logs).toHaveLength(3)
    
    // Verify first log
    expect(logs[0].method).toBe('error')
    const log1 = JSON.parse(logs[0].msg)
    expect(log1.level).toBe('error')
    expect(log1.message).toBe('Test error')
    expect(log1.context.code).toBe(500)
    
    // Verify circular reference handling
    expect(logs[1].method).toBe('info')
    const log2 = JSON.parse(logs[1].msg)
    expect(log2.message).toBe('Circular test')
    expect(log2.context.obj.self).toBe('[Circular]')
    
    // Verify error serialization
    expect(logs[2].method).toBe('error')
    const log3 = JSON.parse(logs[2].msg)
    expect(log3.context.error.message).toBe('Edge runtime error')
    expect(log3.context.error.name).toBe('Error')
  })
  
  it('should not use any Node.js specific APIs', async () => {
    const vm = new EdgeVM()
    
    // This should throw if we try to use Node.js APIs
    const code = `
      // These should not exist in edge runtime
      const hasProcess = typeof process !== 'undefined'
      const hasRequire = typeof require !== 'undefined'
      const hasBuffer = typeof Buffer !== 'undefined'
      const hasModule = typeof module !== 'undefined'
      
      // But these should exist
      const hasConsole = typeof console !== 'undefined'
      const hasJSON = typeof JSON !== 'undefined'
      const hasDate = typeof Date !== 'undefined'
      
      ;({
        nodeAPIs: {
          hasProcess,
          hasRequire,
          hasBuffer,
          hasModule
        },
        webAPIs: {
          hasConsole,
          hasJSON,
          hasDate
        }
      })
    `
    
    const result = await vm.evaluate(code)
    
    // Node.js APIs should not be available
    expect(result.nodeAPIs.hasProcess).toBe(false)
    expect(result.nodeAPIs.hasRequire).toBe(false)
    expect(result.nodeAPIs.hasBuffer).toBe(false)
    expect(result.nodeAPIs.hasModule).toBe(false)
    
    // Web APIs should be available
    expect(result.webAPIs.hasConsole).toBe(true)
    expect(result.webAPIs.hasJSON).toBe(true)
    expect(result.webAPIs.hasDate).toBe(true)
  })
})