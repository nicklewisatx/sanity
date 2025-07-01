# Observability Guide

This project includes comprehensive OpenTelemetry integration for monitoring and debugging during development.

## Quick Start

1. **Enable telemetry in your `.env.local`:**

```bash
# apps/web/.env.local
OTEL_ENABLED=true
OTEL_SERVICE_NAME=sanity-web-local
OTEL_EXPORTER=console
OTEL_LOG_LEVEL=debug
```

2. **Start the dev server:**

```bash
pnpm dev
```

You'll see trace output in your console showing:

- HTTP requests
- Database queries (Sanity fetches)
- Server component renders
- Custom operations

## Understanding Traces

### Console Output Format

When using the console exporter, traces appear as structured JSON:

```json
{
  "traceId": "abc123...",
  "parentId": "def456...",
  "name": "sanity.fetch",
  "kind": "CLIENT",
  "timestamp": 1234567890,
  "duration": 123.45,
  "attributes": {
    "sanity.query": "*[_type == 'post'][0...10]",
    "sanity.result.count": 10
  }
}
```

### Key Trace Components

- **traceId**: Unique identifier for the entire request flow
- **spanId**: Unique identifier for this specific operation
- **parentId**: Links to parent operation (shows hierarchy)
- **duration**: Time in milliseconds
- **attributes**: Custom metadata about the operation

## Custom Instrumentation

### Instrumenting Data Fetches

The project automatically instruments Sanity fetches:

```typescript
// This is automatically traced
const posts = await sanityFetch({
  query: `*[_type == "post"]`,
  tags: ["posts"],
});
```

### Adding Custom Spans

For other operations, add custom spans:

```typescript
import { withSpan } from "@workspace/observability";

// Trace image processing
const optimizedImage = await withSpan("image.optimize", async (span) => {
  span.setAttribute("image.size", imageSize);
  span.setAttribute("image.format", "webp");

  const result = await optimizeImage(originalImage);

  span.setAttribute("image.optimized.size", result.size);
  return result;
});
```

### Tracing API Routes

```typescript
// app/api/webhook/route.ts
import { withSpan } from "@workspace/observability";

export async function POST(request: Request) {
  return withSpan("webhook.process", async (span) => {
    const payload = await request.json();
    span.setAttribute("webhook.type", payload.type);

    // Process webhook...

    return Response.json({ success: true });
  });
}
```

## Using Axiom for Cloud Telemetry

For a more powerful telemetry experience:

1. **Create an Axiom account** at https://axiom.co
2. **Create a dataset** (e.g., "sanity-dev")
3. **Generate an API token**
4. **Update your `.env.local`:**

```bash
OTEL_ENABLED=true
OTEL_SERVICE_NAME=sanity-web-dev
OTEL_EXPORTER=axiom
AXIOM_API_TOKEN=xaat-your-token-here
AXIOM_DATASET=sanity-dev
```

5. **View traces** at https://app.axiom.co

## Common Patterns

### Tracing Cache Operations

```typescript
const cachedData = await withSpan("cache.get", async (span) => {
  span.setAttribute("cache.key", cacheKey);

  const result = await cache.get(cacheKey);
  span.setAttribute("cache.hit", !!result);

  return result;
});
```

### Tracing External API Calls

```typescript
const apiResult = await withSpan("api.external", async (span) => {
  span.setAttribute("api.url", apiUrl);
  span.setAttribute("api.method", "GET");

  const response = await fetch(apiUrl);
  span.setAttribute("api.status", response.status);

  return response.json();
});
```

### Error Tracking

Errors are automatically captured in spans:

```typescript
await withSpan("risky.operation", async (span) => {
  try {
    return await riskyOperation();
  } catch (error) {
    // Error is automatically recorded
    // Just re-throw it
    throw error;
  }
});
```

## Performance Considerations

### Development Mode

- Console exporter has minimal overhead
- All operations are traced (no sampling)
- Detailed attributes included

### Production Mode

- Set `OTEL_ENABLED=false` for zero overhead
- Or use Axiom with sampling for production monitoring
- Consider which attributes to include (avoid PII)

## Debugging Tips

### No Traces Appearing

1. Check `OTEL_ENABLED=true` in environment
2. Verify `instrumentation.ts` is loading (check console logs)
3. Ensure `instrumentationHook: true` in Next.js config

### Missing Custom Traces

1. Import from `@workspace/observability` not other packages
2. Ensure async operations use `await withSpan`
3. Check span is ending (no infinite operations)

### Axiom Connection Issues

1. Verify API token is correct
2. Check dataset exists
3. Look for network errors in console
4. Try console exporter first to verify setup

## Best Practices

1. **Semantic Naming**: Use dot notation (e.g., `database.query`, `cache.get`)
2. **Consistent Attributes**: Use standard attribute names across your app
3. **Avoid PII**: Don't include personal data in traces
4. **Measure What Matters**: Focus on user-facing operations
5. **Use Span Links**: Connect related operations across services

## Example: Full Request Trace

Here's what a typical page load might look like:

```
GET /blog
├── sanity.fetch (120ms)
│   └── attributes: { query: "*[_type == 'post']" }
├── image.optimize (45ms)
│   └── attributes: { format: "webp", count: 5 }
└── render.page (200ms)
    └── attributes: { component: "BlogIndex" }
```

Total request time: 365ms

## Advanced Usage

### Custom Span Processors

```typescript
// packages/observability/src/processors/custom.ts
export class CustomSpanProcessor implements SpanProcessor {
  onStart(span: Span): void {
    // Add default attributes
    span.setAttribute("app.version", process.env.APP_VERSION);
  }

  onEnd(span: ReadableSpan): void {
    // Custom processing
    if (span.duration > 1000) {
      logger.warn("Slow operation detected", {
        operation: span.name,
        duration: span.duration,
      });
    }
  }
}
```

### Correlation with Logs

All logs automatically include trace context:

```typescript
logger.info("Processing payment", { amount: 100 });
// Output includes traceId and spanId automatically
```

Use this to correlate logs with traces in Axiom.

## Resources

- [OpenTelemetry Docs](https://opentelemetry.io/docs/)
- [Axiom Docs](https://axiom.co/docs)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- Package README: `packages/observability/README.md`
