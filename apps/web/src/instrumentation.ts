export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only import Node.js logger when in Node.js runtime
    const logger = (await import('@workspace/logger')).default;
    
    logger.info('Next.js server starting', {
      runtime: process.env.NEXT_RUNTIME,
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL,
    });

    // Log when the server is ready
    logger.debug('Server instrumentation initialized');
  }
}

export async function onRequestError(
  error: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
) {
  // Use edge-compatible logger for error handling since this might run in Edge Runtime
  const logger = (await import('@workspace/logger/edge')).default;
  
  logger.error('Request error occurred', {
    digest: error.digest,
    message: error.message,
    stack: error.stack,
    path: request.path,
    method: request.method,
  });
}