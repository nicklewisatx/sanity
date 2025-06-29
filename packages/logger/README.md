# @workspace/logger

A lightweight, edge-compatible logger for the monorepo that works in both Node.js and Vercel Edge Runtime environments.

## Features

- ✅ Zero external dependencies
- ✅ Edge runtime compatible (Web APIs only)
- ✅ Structured JSON logging
- ✅ Log levels: error, warn, info, debug
- ✅ Environment-based configuration
- ✅ TypeScript support
- ✅ Safe JSON stringification (handles circular references, errors, etc.)
- ✅ Non-blocking performance

## Installation

This package is part of the monorepo and can be imported directly:

```typescript
import { logger } from '@workspace/logger'
```

## Usage

### Basic Logging

```typescript
import { logger } from '@workspace/logger'

// Simple messages
logger.info('Application started')
logger.warn('Low memory warning')
logger.error('Failed to connect to database')
logger.debug('Debug information')

// With context
logger.info('User logged in', { userId: '123', email: 'user@example.com' })
logger.error('Request failed', { 
  endpoint: '/api/users',
  statusCode: 500,
  error: new Error('Internal server error')
})
```

### Log Output Format

All logs are output as structured JSON:

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "context": {
    "userId": "123",
    "email": "user@example.com"
  }
}
```

### Log Levels

Configure the log level using the `LOG_LEVEL` environment variable:

```bash
# Development
LOG_LEVEL=debug pnpm dev

# Production
LOG_LEVEL=warn pnpm start
```

Available levels (from highest to lowest priority):
- `error` - Error messages only
- `warn` - Warnings and errors
- `info` - Informational messages, warnings, and errors (default)
- `debug` - All messages including debug

### Special Type Handling

The logger safely handles special JavaScript types:

```typescript
// Circular references
const obj = { name: 'test' }
obj.self = obj
logger.info('Circular reference', { obj }) // self will be "[Circular]"

// Error objects
const error = new Error('Something went wrong')
logger.error('Operation failed', { error }) // Error is serialized with name, message, and stack

// Other special types
logger.debug('Special types', {
  undefined: undefined,     // "[undefined]"
  symbol: Symbol('test'),   // "Symbol(test)"
  bigint: BigInt(123),     // "123"
  function: () => {},      // "[Function: anonymous]"
})
```

## Edge Runtime Compatibility

This logger is designed to work in edge runtime environments where Node.js APIs are not available. It uses only Web Standard APIs:

- `console.log`, `console.warn`, `console.error`, `console.info`
- `JSON.stringify`
- `Date.toISOString()`

## Environment Variables

- `LOG_LEVEL` - Set the minimum log level (error, warn, info, debug). Default: `info`

In edge runtime, you may need to configure environment variables differently:

```typescript
// Vercel Edge Runtime
export const config = {
  runtime: 'edge',
}

// Access via global
globalThis.LOG_LEVEL = 'debug'
```

## TypeScript

The logger is fully typed. You can import types if needed:

```typescript
import type { Logger, LogLevel, LogContext, LogEntry } from '@workspace/logger'
```

## Performance

The logger is designed for minimal performance impact:
- Non-blocking console output
- No async operations
- Minimal object creation
- Efficient JSON stringification

## Testing

Run tests with:

```bash
pnpm test
```

Tests include:
- Unit tests for all functionality
- Edge runtime compatibility tests
- Circular reference handling
- Log level filtering