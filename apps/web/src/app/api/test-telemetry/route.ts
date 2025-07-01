import type { Span } from "@opentelemetry/api";
import { logger, withSpan } from "@workspace/observability";
import { NextResponse } from "next/server";

async function queryAxiomForTraces(traceId: string) {
  const axiomToken = process.env.AXIOM_API_TOKEN;
  const axiomDataset = process.env.AXIOM_DATASET;

  if (!axiomToken || !axiomDataset) {
    return { error: "Axiom credentials not configured" };
  }

  // Wait a bit for traces to be processed
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // Query Axiom API for the trace
    const response = await fetch(
      `https://api.axiom.co/v1/datasets/${axiomDataset}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${axiomToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apl: `dataset | where trace.trace_id == "${traceId}" | limit 10`,
          startTime: new Date(Date.now() - 60000).toISOString(), // Last minute
          endTime: new Date().toISOString(),
        }),
      },
    );

    if (!response.ok) {
      return {
        error: "Axiom query failed",
        status: response.status,
        message: await response.text(),
      };
    }

    const data = await response.json();
    return {
      found: data.matches?.length > 0,
      count: data.matches?.length || 0,
      traces: data.matches || [],
    };
  } catch (error) {
    return {
      error: "Failed to query Axiom",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET() {
  // Capture the trace ID for verification
  let capturedTraceId: string | undefined;

  const spanResult = await withSpan(
    "api.test-telemetry",
    async (span: Span) => {
      // Capture trace ID from the span context
      const spanContext = span.spanContext();
      capturedTraceId = spanContext.traceId;

      logger.info("Testing telemetry endpoint", { traceId: capturedTraceId });

      // Add some attributes
      span.setAttribute("test.type", "manual");
      span.setAttribute("test.timestamp", new Date().toISOString());
      span.setAttribute("test.unique_id", `test-${Date.now()}`);

      // Simulate some work with nested spans
      await withSpan(
        "api.test-telemetry.simulate-work",
        async (childSpan: Span) => {
          childSpan.setAttribute("work.duration", 100);
          childSpan.setAttribute("work.type", "simulation");
          await new Promise((resolve) => setTimeout(resolve, 100));
        },
      );

      // Simulate a calculation
      const result = await withSpan(
        "api.test-telemetry.calculate",
        async (childSpan: Span) => {
          childSpan.setAttribute("calculation.input", 42);
          const output = 42 * 2;
          childSpan.setAttribute("calculation.output", output);
          childSpan.setAttribute("calculation.formula", "input * 2");
          return output;
        },
      );

      logger.info("Telemetry test completed", {
        result,
        traceId: capturedTraceId,
      });

      return result;
    },
  );

  // If using Axiom, verify the trace was sent
  let axiomVerification = null;
  if (process.env.OTEL_EXPORTER === "axiom" && capturedTraceId) {
    logger.info("Verifying trace in Axiom", { traceId: capturedTraceId });
    axiomVerification = await queryAxiomForTraces(capturedTraceId);
  }

  return NextResponse.json({
    success: true,
    message: "Telemetry test completed",
    result: spanResult,
    trace: {
      enabled: process.env.OTEL_ENABLED === "true",
      serviceName: process.env.OTEL_SERVICE_NAME,
      exporter: process.env.OTEL_EXPORTER,
      traceId: capturedTraceId,
    },
    axiomVerification,
    debug: {
      env: {
        OTEL_ENABLED: process.env.OTEL_ENABLED,
        OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
        OTEL_EXPORTER: process.env.OTEL_EXPORTER,
        AXIOM_API_TOKEN: process.env.AXIOM_API_TOKEN ? "***" : undefined,
        AXIOM_DATASET: process.env.AXIOM_DATASET,
      },
    },
  });
}
