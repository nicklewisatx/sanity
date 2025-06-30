'use client'

import { useEffect } from 'react'
import { logger } from '@workspace/logger'

export function ErrorLogger() {
  useEffect(() => {
    // Log unhandled errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Unhandled client error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack || event.error?.toString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      })
    }

    // Log unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection', {
        reason: event.reason?.message || event.reason?.toString() || 'Unknown',
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      })
    }

    // Add event listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Log that error logging is initialized
    logger.debug('Client-side error logging initialized', {
      url: window.location.href,
      timestamp: new Date().toISOString(),
    })

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}