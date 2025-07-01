# Telemetry Troubleshooting Guide

## Testing Your Setup

### 1. Basic Health Check

```bash
# Test if telemetry is working
curl http://localhost:3000/api/otel-debug
```

This endpoint will:

- Create test spans using OpenTelemetry directly
- Return the trace ID for verification
- Show your current configuration

### 2. Full Telemetry Test

```bash
# Test with Axiom verification
curl http://localhost:3000/api/test-telemetry
```

This endpoint will:

- Create nested spans with attributes
- Query Axiom to verify the trace arrived (if using Axiom)
- Show debug information about your setup

### 3. Check Axiom Connection

```bash
# Verify Axiom dataset and recent traces
curl http://localhost:3000/api/axiom-check
```

This endpoint will:

- Verify your Axiom credentials work
- Show recent traces from your service
- Count total traces in the last hour

## Common Issues and Solutions

### No Traces in Console

1. **Check OTEL_ENABLED**

   ```bash
   # In apps/web/.env.local
   OTEL_ENABLED=true  # Must be exactly "true"
   ```

2. **Verify Instrumentation Hook**
   - Check `apps/web/next.config.ts` has `instrumentationHook: true`
   - Restart the dev server after changing

3. **Check Console Output**
   Look for these messages on startup:
   ```
   [Instrumentation] Starting registration...
   [Instrumentation] Loading observability module...
   [Instrumentation] Observability initialized!
   ```

### No Traces in Axiom

1. **Verify Environment Variables**

   ```bash
   # All three must be set
   OTEL_EXPORTER=axiom
   AXIOM_API_TOKEN=xaat-your-token
   AXIOM_DATASET=your-dataset-name
   ```

2. **Check Token Permissions**
   - Token needs write access to the dataset
   - Test with: `curl http://localhost:3000/api/axiom-check`

3. **Verify Dataset Exists**
   - Log into Axiom UI
   - Check dataset name matches exactly (case-sensitive)

4. **Check for Errors**
   ```bash
   # Look for export errors in console
   OTEL_LOG_LEVEL=debug pnpm dev
   ```

### Traces Not Linking Properly

1. **Context Propagation**

   ```typescript
   // BAD - Context lost
   async function doWork() {
     const span = createSpan("work");
     await someAsyncWork();
     span.end();
   }

   // GOOD - Context preserved
   async function doWork() {
     return withSpan("work", async (span) => {
       await someAsyncWork();
     });
   }
   ```

2. **Check Trace IDs**
   - Use `/api/otel-debug` to get trace ID
   - Search in Axiom with: `trace.trace_id == "your-trace-id"`

### Performance Issues

1. **Disable in Production**

   ```bash
   # Production .env
   OTEL_ENABLED=false
   ```

2. **Reduce Span Creation**

   ```typescript
   // Only trace important operations
   if (isImportantOperation) {
     return withSpan("important.op", async () => {
       // ...
     });
   }
   ```

3. **Use Sampling** (future enhancement)

## Debugging Commands

### Check Current Configuration

```typescript
// Add to any file temporarily
import { getConfig, isEnabled } from "@workspace/observability";
console.log("OTEL Config:", getConfig());
console.log("OTEL Enabled:", isEnabled());
```

### Manual Span Test

```typescript
// Test span creation directly
import { createSpan } from "@workspace/observability";

const span = createSpan("manual.test");
span.setAttribute("test", true);
span.end();
```

### Force Flush

```typescript
// In API routes, ensure spans are flushed
export async function GET() {
  const result = await withSpan("api.endpoint", async () => {
    // Your logic
  });

  // Give time for export
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Response.json(result);
}
```

## Axiom Specific

### Query Language (APL)

Find your traces:

```apl
dataset
| where service.name == "sanity-web-local"
| where _time > ago(5m)
```

Find specific trace:

```apl
dataset
| where trace.trace_id == "your-trace-id"
```

Find errors:

```apl
dataset
| where status.code == 2  // Error status
| where service.name == "sanity-web-local"
```

### Axiom Dashboard

1. Go to https://app.axiom.co
2. Select your dataset
3. Use "Traces" view for span visualization
4. Use "Stream" view for raw data

## Environment-Specific Setup

### Local Development

```bash
# Recommended for local dev
OTEL_ENABLED=true
OTEL_SERVICE_NAME=sanity-web-local
OTEL_EXPORTER=console
OTEL_LOG_LEVEL=info
```

### Local with Axiom

```bash
# For testing Axiom integration
OTEL_ENABLED=true
OTEL_SERVICE_NAME=sanity-web-dev
OTEL_EXPORTER=axiom
OTEL_LOG_LEVEL=debug
AXIOM_API_TOKEN=xaat-...
AXIOM_DATASET=dev-traces
```

### CI/CD

```bash
# Disable for CI
OTEL_ENABLED=false
```

## Verification Checklist

- [ ] `OTEL_ENABLED=true` in environment
- [ ] `instrumentationHook: true` in next.config.ts
- [ ] Observability package built (`pnpm build` in packages/observability)
- [ ] Dev server restarted after config changes
- [ ] Console shows initialization messages
- [ ] Test endpoints return trace IDs
- [ ] Axiom credentials are correct (if using Axiom)
- [ ] Dataset exists and is writable (if using Axiom)

## Still Not Working?

1. **Full Reset**

   ```bash
   # Clean and rebuild
   rm -rf node_modules packages/*/node_modules
   pnpm install
   cd packages/observability && pnpm build
   pnpm dev
   ```

2. **Enable Debug Logging**

   ```bash
   OTEL_LOG_LEVEL=debug pnpm dev
   ```

3. **Check Next.js Logs**
   - Look for errors during instrumentation
   - Check for module resolution issues

4. **Test Minimal Setup**
   - Try console exporter first
   - Add one span at a time
   - Verify each step works
