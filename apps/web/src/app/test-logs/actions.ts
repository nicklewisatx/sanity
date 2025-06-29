'use server';

import logger from '@workspace/logger';

export async function testServerLogging() {
  // Test various log levels
  logger.debug('Test debug message from server', { extra: 'metadata', timestamp: new Date().toISOString() });
  logger.info('Test info message from server', { userId: 123, action: 'test' });
  logger.warn('Test warning message from server', { warning: 'be careful', severity: 'medium' });
  logger.error('Test error message from server', { error: 'something went wrong', stack: 'test stack' });
  (logger as any).http('Test HTTP message from server', { method: 'GET', path: '/test', status: 200 });
  
  return { success: true };
}