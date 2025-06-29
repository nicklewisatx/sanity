# Logging Guide

We use a centralized logger package (`@workspace/logger`) based on Winston for consistent logging across all applications.

## Quick Start

### Basic Usage

```typescript
import logger from "@workspace/logger";

// Basic logging methods
logger.info("Server started on port 3000");
logger.error("Failed to connect to database", { error: err });
logger.warn("API rate limit approaching");
logger.debug("User data:", { userId: 123 });
logger.http("GET /api/users 200 45ms");
```

### Child Loggers

Create service-specific loggers for better log organization:

```typescript
import { createChildLogger } from "@workspace/logger";

const dbLogger = createChildLogger("database");
dbLogger.info("Connection established");
dbLogger.error("Query failed", { query, error });

const authLogger = createChildLogger("auth");
authLogger.info("User logged in", { userId });
authLogger.warn("Invalid login attempt", { email });
```

## Log Levels

Ordered from highest to lowest priority:

| Level   | Usage                                         | Example                                            |
| ------- | --------------------------------------------- | -------------------------------------------------- |
| `error` | Critical errors requiring immediate attention | Database connection failures, unhandled exceptions |
| `warn`  | Warning conditions that should be reviewed    | Deprecated API usage, high memory usage            |
| `info`  | General informational messages                | Server startup, successful operations              |
| `http`  | HTTP request logging                          | Request/response details, API calls                |
| `debug` | Detailed debugging information                | Variable values, execution flow                    |

## Configuration

### Development Environment

- **Format**: Colorized console output with timestamps
- **Level**: `debug` (all logs visible)
- **Output**: Console only by default

### Production Environment

- **Format**: JSON for structured logging
- **Level**: `info` (debug logs hidden)
- **Output**: Console + rotating file logs
- **Files**:
  - `logs/error-YYYY-MM-DD.log` (errors only)
  - `logs/combined-YYYY-MM-DD.log` (all logs)

### Environment Variables

```bash
# Override default log level
LOG_LEVEL=debug  # error, warn, info, http, debug

# Custom log directory (default: logs)
LOG_DIR=/var/log/myapp

# Enable file logging in development
ENABLE_FILE_LOGS=true

# Disable console colors
NO_COLOR=1
```

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ❌ Bad: Using wrong levels
logger.info("CRITICAL ERROR: Database is down!");
logger.debug("User successfully logged in");

// ✅ Good: Appropriate levels
logger.error("Database connection failed", { error });
logger.info("User login successful", { userId });
```

### 2. Include Contextual Data

```typescript
// ❌ Bad: No context
logger.error("Operation failed");

// ✅ Good: Rich context
logger.error("Failed to process order", {
  orderId,
  userId,
  error: err.message,
  stack: err.stack,
  attemptNumber,
});
```

### 3. Use Child Loggers for Services

```typescript
// ❌ Bad: Generic logger everywhere
logger.info("[Database] Connected");
logger.info("[Auth] User logged in");

// ✅ Good: Service-specific loggers
const dbLogger = createChildLogger("database");
const authLogger = createChildLogger("auth");

dbLogger.info("Connected to PostgreSQL");
authLogger.info("User authenticated", { userId });
```

### 4. Structure Your Log Data

```typescript
// ❌ Bad: Unstructured strings
logger.info(`User ${userId} performed ${action} on ${resource}`);

// ✅ Good: Structured objects
logger.info("User action", {
  userId,
  action,
  resource,
  timestamp: new Date().toISOString(),
  metadata: { ip, userAgent },
});
```

### 5. Avoid Logging Sensitive Data

```typescript
// ❌ Bad: Logging sensitive information
logger.debug("User login", {
  email: user.email,
  password: user.password, // Never log passwords!
});

// ✅ Good: Sanitized data
logger.debug("User login attempt", {
  email: user.email,
  // Omit password
  loginMethod: "password",
});
```

## Common Patterns

### Request Logging Middleware

```typescript
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });

  next();
}
```

### Error Logging

```typescript
try {
  await performOperation();
} catch (error) {
  logger.error("Operation failed", {
    error: error.message,
    stack: error.stack,
    context: {
      userId,
      operation: "dataSync",
      timestamp: new Date().toISOString(),
    },
  });
  throw error; // Re-throw if needed
}
```

### Performance Logging

```typescript
const timer = logger.startTimer();
await expensiveOperation();
timer.done({
  message: "Expensive operation completed",
  userId,
  operationType: "dataProcessing",
});
```

## Log Analysis

### Development

```bash
# View logs with pretty printing
pnpm dev | pnpm --filter=@workspace/logger pretty

# Filter by level
LOG_LEVEL=error pnpm dev

# Search logs
pnpm dev | grep -i "error"
```

### Production

```bash
# View error logs
tail -f logs/error-*.log

# Search all logs
grep "userId:123" logs/combined-*.log

# Parse JSON logs
cat logs/combined-*.log | jq '.level="error"'
```

## Integration Examples

### Next.js App Router

```typescript
// app/api/route.ts
import logger from "@workspace/logger";

export async function GET(request: Request) {
  logger.http("API request received", {
    url: request.url,
    headers: Object.fromEntries(request.headers),
  });

  try {
    const data = await fetchData();
    logger.info("Data fetched successfully");
    return Response.json(data);
  } catch (error) {
    logger.error("Failed to fetch data", { error });
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
```

### Sanity Studio Plugin

```typescript
// plugins/logger.ts
import { createChildLogger } from "@workspace/logger";

const studioLogger = createChildLogger("studio");

export function logStudioEvent(event: string, data?: any) {
  studioLogger.info(event, data);
}
```
