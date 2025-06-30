# @workspace/observability

Centralized OpenTelemetry integration for the Sanity + Next.js monorepo, providing comprehensive observability for local development.

## Features

- **Centralized Configuration**: Single package managing all telemetry configuration
- **Environment-Based Control**: Easy on/off switching via environment variables
- **Multiple Exporters**: Console (local dev) and Axiom (cloud) support
- **Zero Overhead When Disabled**: No performance impact when `OTEL_ENABLED=false`
- **Developer-Friendly**: Human-readable console output for local debugging
- **Type-Safe**: Full TypeScript support with utility functions

## Installation

This package is already included in the monorepo. To use it in a new app:

```bash
# Add to your app's package.json
"@workspace/observability": "workspace:*"
```

## Configuration

### Environment Variables

```bash
# Master control
OTEL_ENABLED=true|false          # Enable/disable all telemetry

# Service configuration
OTEL_SERVICE_NAME=my-service     # Service identifier
OTEL_LOG_LEVEL=debug|info|warn|error  # Logging verbosity

# Export configuration
OTEL_EXPORTER=console|axiom|none  # Where to send telemetry data

# Axiom configuration (when OTEL_EXPORTER=axiom)
AXIOM_API_TOKEN=xaat-...         # Your Axiom API token
AXIOM_DATASET=my-dataset         # Axiom dataset name
AXIOM_DOMAIN=api.axiom.co        # Optional: Axiom API domain
```

### Next.js Integration

1. Create `instrumentation.ts` in your Next.js app root:

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeObservability } = await import(
      "@workspace/observability"
    );
    initializeObservability();
  }
}
```

2. Enable instrumentation in `next.config.ts`:

```typescript
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  transpilePackages: ["@workspace/observability"],
};
```

## Usage

### Automatic Instrumentation

Once configured, OpenTelemetry automatically instruments:

- HTTP requests (incoming and outgoing)
- Database queries
- Next.js server components
- API routes

### Custom Spans

```typescript
import {
  withSpan,
  createSpan,
  setSpanAttributes,
} from "@workspace/observability";

// Async function with automatic span management
const result = await withSpan("fetch-user-data", async (span) => {
  setSpanAttributes(span, { userId: "123" });
  const user = await fetchUser("123");
  return user;
});

// Manual span management
const span = createSpan("process-payment");
try {
  span.setAttribute("amount", 100);
  await processPayment();
  span.setStatus({ code: SpanStatusCode.OK });
} catch (error) {
  span.recordException(error);
  throw error;
} finally {
  span.end();
}
```

### Structured Logging

```typescript
import { logger } from "@workspace/observability";

// Logs include trace context automatically
logger.info("User logged in", { userId: "123" });
logger.warn("Rate limit approaching", { remaining: 10 });
logger.error("Payment failed", { error: error.message });
```

## Development Workflow

### Local Development (Console Output)

```bash
OTEL_ENABLED=true
OTEL_SERVICE_NAME=sanity-web-local
OTEL_EXPORTER=console
OTEL_LOG_LEVEL=debug
```

Output appears in your terminal with structured format:

```
[2024-01-01T12:00:00.000Z] [INFO] User logged in {"userId":"123","traceId":"abc123","spanId":"def456"}
```

### Local with Axiom

```bash
OTEL_ENABLED=true
OTEL_SERVICE_NAME=sanity-web-dev
OTEL_EXPORTER=axiom
AXIOM_API_TOKEN=xaat-...
AXIOM_DATASET=dev-traces
```

View traces in Axiom dashboard: https://app.axiom.co

### Production (Disabled by Default)

```bash
OTEL_ENABLED=false
```

## Best Practices

1. **Use Semantic Names**: Name spans descriptively (e.g., `fetch-user-profile` not `fetch`)
2. **Add Context**: Include relevant attributes (user IDs, request IDs, etc.)
3. **Handle Errors**: Always record exceptions in spans
4. **Avoid Over-Instrumentation**: Focus on key operations and user journeys
5. **Test Performance**: Verify minimal overhead in production scenarios

## Debugging

### Check if OpenTelemetry is Running

```typescript
import { isEnabled, getConfig } from "@workspace/observability";

console.log("OTEL enabled:", isEnabled());
console.log("OTEL config:", getConfig());
```

### Common Issues

**No telemetry data appearing:**

- Verify `OTEL_ENABLED=true`
- Check console for initialization messages
- Ensure `instrumentationHook` is enabled in Next.js config

**Axiom export failing:**

- Verify API token and dataset are correct
- Check network connectivity to Axiom
- Look for error messages in console

**Performance impact:**

- Ensure `OTEL_ENABLED=false` in production
- Use sampling for high-traffic scenarios
- Monitor span creation in hot paths

## API Reference

### Configuration

- `getConfig()`: Get current configuration
- `isEnabled()`: Check if telemetry is enabled
- `shouldLog(level)`: Check if logging level is active

### Tracing

- `createSpan(name, options?)`: Create a new span
- `withSpan(name, fn, options?)`: Execute function with span
- `withSpanSync(name, fn, options?)`: Sync version of withSpan
- `setSpanAttribute(span, key, value)`: Set single attribute
- `setSpanAttributes(span, attributes)`: Set multiple attributes

### Logging

- `logger.debug(message, context?)`
- `logger.info(message, context?)`
- `logger.warn(message, context?)`
- `logger.error(message, context?)`

## Future Enhancements

- [ ] Metrics collection (response times, cache hits)
- [ ] Custom Sanity Studio integration
- [ ] Sampling configuration
- [ ] Additional exporters (Jaeger, Zipkin)
- [ ] Performance profiling integration
