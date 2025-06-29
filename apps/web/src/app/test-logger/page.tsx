import logger from '@workspace/logger';

export default function TestLoggerPage() {
  // Server-side logging
  logger.info('Test logger page accessed', { 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    fileLogsEnabled: process.env.ENABLE_FILE_LOGS,
  });
  
  logger.debug('Debug message from test page', { test: true });
  logger.warn('Warning message from test page');
  logger.error('Error message from test page (this is just a test)');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Logger Test Page</h1>
      <p className="mb-4">This page tests server-side logging. Check your console and log files.</p>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Log Configuration:</h2>
        <ul className="list-disc list-inside">
          <li>Log Level: {process.env.LOG_LEVEL || 'default'}</li>
          <li>File Logs Enabled: {process.env.ENABLE_FILE_LOGS || 'false'}</li>
          <li>Log Directory: {process.env.LOG_DIR || 'logs'}</li>
          <li>Environment: {process.env.NODE_ENV}</li>
        </ul>
      </div>
      
      <div className="mt-4 bg-blue-100 p-4 rounded">
        <h2 className="font-bold mb-2">Log Messages Sent:</h2>
        <ol className="list-decimal list-inside">
          <li>INFO: Test logger page accessed</li>
          <li>DEBUG: Debug message from test page</li>
          <li>WARN: Warning message from test page</li>
          <li>ERROR: Error message from test page (test only)</li>
        </ol>
      </div>
    </div>
  );
}