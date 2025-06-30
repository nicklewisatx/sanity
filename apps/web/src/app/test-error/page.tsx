'use client'

import { useState } from 'react'
import { logger } from '@workspace/logger'

export default function TestErrorPage() {
  const [errorType, setErrorType] = useState('')

  const triggerError = (type: string) => {
    setErrorType(type)
    
    switch (type) {
      case 'throw':
        // This will be caught by error.tsx
        throw new Error('Test error: Intentional throw for testing')
        
      case 'async':
        // This will be caught by window error handler
        setTimeout(() => {
          throw new Error('Test error: Async error after timeout')
        }, 100)
        break
        
      case 'promise':
        // This will be caught by unhandledrejection handler
        Promise.reject(new Error('Test error: Unhandled promise rejection'))
        break
        
      case 'manual':
        // Direct logging
        logger.error('Test error: Manual error log', {
          type: 'manual_test',
          timestamp: new Date().toISOString(),
          metadata: {
            test: true,
            source: 'test-error-page'
          }
        })
        break
        
      case 'reference':
        // This will cause a reference error
        // @ts-ignore
        nonExistentFunction()
        break
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Error Logging Test Page</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          ⚠️ This page is for testing error logging to Logtail. 
          Click buttons below to trigger different types of errors.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => triggerError('manual')}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Manual Error Log (Safe)
        </button>
        
        <button
          onClick={() => triggerError('throw')}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Throw Error (Will show error boundary)
        </button>
        
        <button
          onClick={() => triggerError('async')}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Async Error (Check console)
        </button>
        
        <button
          onClick={() => triggerError('promise')}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Promise Rejection (Check console)
        </button>
        
        <button
          onClick={() => triggerError('reference')}
          className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Reference Error (Will show error boundary)
        </button>
      </div>

      {errorType === 'manual' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✓ Manual error logged successfully! Check your Logtail dashboard.
          </p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <p>Dashboard: <a href="https://logs.betterstack.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://logs.betterstack.com</a></p>
      </div>
    </div>
  )
}