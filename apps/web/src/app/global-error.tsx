'use client'

import { useEffect } from 'react'
import { logger } from '@workspace/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log critical error to Logtail
    logger.error('Critical application error caught by global error boundary', {
      error: error.message,
      stack: error.stack,
      digest: error.digest,
      severity: 'critical',
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md space-y-4 text-center">
            <h2 className="text-2xl font-bold">Critical Error</h2>
            <p>A critical error occurred. Please refresh the page.</p>
            <button
              onClick={reset}
              className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}