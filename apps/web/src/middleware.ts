import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@workspace/logger/edge';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const pathname = request.nextUrl.pathname;
  
  // Skip logging for the logs endpoint to prevent feedback loop
  if (pathname === '/api/logs') {
    return NextResponse.next();
  }
  
  // Log incoming requests (only if log level allows HTTP logging)
  logger.http('Incoming request', {
    method: request.method,
    url: request.url,
    pathname: pathname,
    userAgent: request.headers.get('user-agent'),
  });

  const response = NextResponse.next();
  
  // Log response time
  const duration = Date.now() - start;
  logger.debug('Request completed', {
    pathname: pathname,
    duration: `${duration}ms`,
  });

  return response;
}

// Configure which routes use this middleware
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
};