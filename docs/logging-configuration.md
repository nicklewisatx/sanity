# Logging Configuration Guide

## Overview

This project uses [Logtail](https://betterstack.com/logs) for centralized logging across all environments including edge runtimes, API routes, and Node.js applications.

## Setup

### 1. Get Your Logtail Token

1. Sign up for a free account at [Better Stack](https://betterstack.com)
2. Create a new source in your Logtail dashboard
3. Copy the source token

### 2. Configure Environment Variables

Add your Logtail token to the appropriate environment files:

```bash
# Root .env (for local development)
LOGTAIL_TOKEN=your-logtail-token

# For EU regions, also add:
LOGTAIL_INGESTION_HOST=sXXXXXXX.eu-nbg-2.betterstackdata.com

# For production deployments:
# - Vercel: Add via dashboard environment variables
# - Cloudflare Workers: Add as a secret
```

## Usage

The logger is available from the `@workspace/logger` package:

```typescript
import { logger } from '@workspace/logger';

// Log messages with different levels
logger.error('Error occurred', { error: err, userId: '123' });
logger.warn('Warning threshold exceeded', { value: 95 });
logger.info('User action completed', { action: 'checkout' });
logger.debug('Debug information', { internal: true });
```

## Viewing Logs

### Logtail Dashboard

Access your logs at: https://logs.betterstack.com

### Query Examples Using curl

```bash
# Get last hour of errors
curl -X POST https://logs.betterstack.com/api/v1/query \
  -H "Authorization: Bearer $LOGTAIL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "level:error", 
    "from": "-1h"
  }'

# Search for specific user
curl -X POST https://logs.betterstack.com/api/v1/query \
  -H "Authorization: Bearer $LOGTAIL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "userId:123", 
    "from": "-24h"
  }'

# Get logs from specific service
curl -X POST https://logs.betterstack.com/api/v1/query \
  -H "Authorization: Bearer $LOGTAIL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "service:web-app AND level:warn", 
    "from": "-7d"
  }'
```

## Edge Runtime Support

The logger automatically detects and works in:
- Vercel Edge Functions
- Cloudflare Workers
- Node.js environments
- Browser environments (console fallback)

## Fallback Behavior

If no `LOGTAIL_TOKEN` is configured, logs will fall back to structured JSON console output:

```json
{
  "level": "error",
  "message": "Database connection failed",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "error": "Connection timeout"
}
```

## Benefits

- **No filesystem required**: Works in edge runtimes
- **SQL-like queries**: Powerful log search and analysis
- **Automatic batching**: Efficient log transmission
- **Structured logging**: Easy to search and filter
- **Free tier**: Generous limits for development