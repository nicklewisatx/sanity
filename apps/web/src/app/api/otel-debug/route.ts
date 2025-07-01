import { context, trace } from "@opentelemetry/api";
import { getConfig, isEnabled } from "@workspace/observability";
import { NextResponse } from "next/server";

export async function GET() {
  const config = getConfig();
  const tracer = trace.getTracer("otel-debug", "1.0.0");

  // Create a test span directly using OpenTelemetry API
  const span = tracer.startSpan("debug.test.root");
  const spanContext = span.spanContext();

  try {
    // Add attributes
    span.setAttributes({
      "debug.test": true,
      "debug.timestamp": Date.now(),
      "debug.config": JSON.stringify(config),
    });

    // Create child span
    await context.with(trace.setSpan(context.active(), span), async () => {
      const childSpan = tracer.startSpan("debug.test.child");
      childSpan.setAttribute("child.test", true);

      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 50));

      childSpan.end();
    });

    // Force span to end
    span.end();

    // Give exporter time to send
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      debug: {
        otelEnabled: isEnabled(),
        config: {
          ...config,
          axiom: (config as any).axiom
            ? {
                ...(config as any).axiom,
                apiToken: (config as any).axiom.apiToken ? "***" : undefined,
              }
            : undefined,
        },
        span: {
          traceId: spanContext.traceId,
          spanId: spanContext.spanId,
          isValid: spanContext.traceId !== "00000000000000000000000000000000",
          traceFlags: spanContext.traceFlags,
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_RUNTIME: process.env.NEXT_RUNTIME,
          instrumentationRegistered: !!global._otelRegistered,
        },
        checks: {
          configLoaded: !!config,
          spanCreated: !!span,
          contextValid:
            spanContext.traceId !== "00000000000000000000000000000000",
          exporterConfigured: config.exporter !== "none",
        },
      },
      instructions: {
        console:
          "Check your terminal for span output if using console exporter",
        axiom: "Visit https://app.axiom.co and check your dataset for traces",
        verify: `Trace ID to search for: ${spanContext.traceId}`,
      },
    });
  } catch (error) {
    span.recordException(error as Error);
    span.end();

    return NextResponse.json(
      {
        error: "Debug test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Mark that instrumentation has been registered
declare global {
  var _otelRegistered: boolean | undefined;
}

if (isEnabled()) {
  global._otelRegistered = true;
}
