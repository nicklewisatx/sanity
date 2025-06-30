export async function register() {
  console.log("[Instrumentation] Starting registration...");
  console.log("[Instrumentation] NEXT_RUNTIME:", process.env.NEXT_RUNTIME);
  console.log("[Instrumentation] OTEL_ENABLED:", process.env.OTEL_ENABLED);
  console.log(
    "[Instrumentation] OTEL_SERVICE_NAME:",
    process.env.OTEL_SERVICE_NAME,
  );
  console.log("[Instrumentation] OTEL_EXPORTER:", process.env.OTEL_EXPORTER);

  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[Instrumentation] Loading observability module...");
    const { initializeObservability } = await import(
      "@workspace/observability"
    );
    console.log("[Instrumentation] Initializing observability...");
    initializeObservability();
    console.log("[Instrumentation] Observability initialized!");
  } else {
    console.log("[Instrumentation] Skipping - not in Node.js runtime");
  }
}
