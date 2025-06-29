import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs' // Use Node.js runtime for file system access

interface LogEntry {
  level: string
  message: string
  timestamp: string
  context?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key if configured
    const apiKey = process.env.LOG_API_KEY
    if (apiKey) {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { logs } = await request.json() as { logs: LogEntry[] }
    
    if (!Array.isArray(logs)) {
      return NextResponse.json({ error: 'Invalid logs format' }, { status: 400 })
    }

    // For production, you would send to a logging service here
    // For now, we'll write to local files when in development
    if (process.env.NODE_ENV === 'development') {
      const logDir = join(process.cwd(), 'logs')
      await mkdir(logDir, { recursive: true })
      
      const date = new Date().toISOString().split('T')[0]
      const logFile = join(logDir, `app-${date}.log`)
      
      const logLines = logs.map(log => JSON.stringify(log)).join('\n') + '\n'
      await writeFile(logFile, logLines, { flag: 'a' })
    }

    // In production, forward to your logging service
    if (process.env.NODE_ENV === 'production' && process.env.EXTERNAL_LOG_ENDPOINT) {
      await fetch(process.env.EXTERNAL_LOG_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.EXTERNAL_LOG_API_KEY && {
            'Authorization': `Bearer ${process.env.EXTERNAL_LOG_API_KEY}`
          })
        },
        body: JSON.stringify({ logs })
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Log endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}