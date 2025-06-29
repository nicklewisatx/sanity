// Test logger script

// Enable file logging for testing
process.env.ENABLE_FILE_LOGS = 'true';
process.env.LOG_DIR = 'logs';

const logger = require('@workspace/logger').default;

console.log('Testing logger output...\n');

// Test all log levels
logger.error('This is an error message', { code: 'TEST_ERROR', details: 'Testing error logging' });
logger.warn('This is a warning message', { type: 'TEST_WARNING' });
logger.info('This is an info message', { status: 'Testing' });
logger.http('This is an HTTP message', { method: 'GET', path: '/test' });
logger.debug('This is a debug message', { verbose: true });

// Test child logger
const childLogger = logger.child({ service: 'test-service' });
childLogger.info('This is from a child logger', { component: 'test' });

console.log('\nLogs should be written to:');
console.log('- Console (with colors in development)');
console.log('- logs/error-*.log (errors only)');
console.log('- logs/combined-*.log (all logs)');
console.log('\nCheck the logs directory for output files.');