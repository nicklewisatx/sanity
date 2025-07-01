# Observability Package - OpenTelemetry Integration

**Last Updated by Claude:** 2025-07-01

## Overview

This package provides OpenTelemetry instrumentation for the monorepo, enabling distributed tracing and monitoring across applications. It's built to work with both Next.js and other Node.js applications.

## Key Technologies

- **OpenTelemetry SDK:** Core tracing infrastructure
- **OTLP Exporter:** HTTP trace exporting
- **Vercel OTEL:** Vercel-specific optimizations
- **Build Tool:** tsup for dual ESM/CJS builds

## Package Structure

```
packages/observability/
├── src/
│   ├── index.ts        # Main exports
│   ├── tracer.ts       # Tracer configuration
│   └── instrumentation/ # Auto-instrumentation
├── dist/               # Built outputs (ESM + CJS)
└── tsup.config.ts      # Build configuration
```

## Exports

Dual module system support:

- **ESM:** `./dist/index.js`
- **CommonJS:** `./dist/index.cjs`
- **Types:** `./dist/index.d.ts`

## Key Features

1. **Auto-instrumentation:** Automatic tracing for HTTP, gRPC
2. **Custom Spans:** API for manual instrumentation
3. **Resource Detection:** Automatic service metadata
4. **Configurable Exporters:** Support for various backends
5. **Environment-based Config:** Different settings per environment

## Usage

### In Next.js (instrumentation.ts)

```typescript
import { registerOTel } from "@workspace/observability";

export function register() {
  registerOTel("next-app");
}
```

### Manual Instrumentation

```typescript
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("my-service");
const span = tracer.startSpan("operation-name");
// ... do work
span.end();
```

## Configuration

Environment variables:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-collector.com
OTEL_SERVICE_NAME=your-service
OTEL_TRACES_SAMPLER=always_on
OTEL_LOG_LEVEL=debug
```

## Build Process

```bash
# Build package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```

## Integration Points

1. **Next.js:** Via instrumentation.ts
2. **Node Services:** Direct import
3. **Vercel:** Automatic with @vercel/otel
4. **Custom Collectors:** OTLP HTTP endpoint

## Common Patterns

### Creating Spans

```typescript
async function doWork() {
  return tracer.startActiveSpan("work", async (span) => {
    try {
      // Your code here
      span.setAttributes({
        "work.type": "processing",
        "work.items": 42,
      });
      return result;
    } finally {
      span.end();
    }
  });
}
```

### Error Tracking

```typescript
span.recordException(error);
span.setStatus({
  code: SpanStatusCode.ERROR,
  message: error.message,
});
```

## Telemetry Backends

Compatible with:

- **Jaeger:** Local development
- **Axiom:** Production monitoring
- **Datadog:** APM integration
- **New Relic:** Full-stack observability
- **Custom OTLP:** Any OpenTelemetry collector

## Development Tips

1. Use `OTEL_LOG_LEVEL=debug` for troubleshooting
2. Test locally with Jaeger UI
3. Keep spans focused and named well
4. Add relevant attributes for filtering
5. Use semantic conventions

## Performance Considerations

- Sampling reduces overhead
- Batch span exports
- Minimal runtime impact
- Async span processing
- Configurable buffer sizes

## Notes for AI Assistants

- This package is the central telemetry solution
- Don't add telemetry directly to apps
- Follow OpenTelemetry semantic conventions
- Keep the package framework-agnostic where possible
- Test with multiple exporters
- Document custom span attributes

## Common Tasks

1. **Add instrumentation:** Extend in src/instrumentation/
2. **New exporter:** Add to configuration options
3. **Custom attributes:** Use semantic conventions
4. **Debug traces:** Enable debug logging
5. **Performance:** Profile with sampling rates

## Maintenance Notes

**IMPORTANT:** Update this file when:

- New instrumentation libraries added
- Export formats change
- Configuration options added
- Major OpenTelemetry updates
