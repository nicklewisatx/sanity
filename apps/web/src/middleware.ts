import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log all requests for debugging (optional - remove in production for performance)
  if (process.env.LOG_REQUESTS === 'true') {
    // Use console.log in Edge Runtime instead of logger
    console.log('[Middleware] Incoming request', {
      method: request.method,
      url: request.url,
      pathname: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
    })
  }

  try {
    return NextResponse.next()
  } catch (error) {
    // Log middleware errors using console
    console.error('[Middleware] Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      method: request.method,
    })
    
    // Return error response
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}