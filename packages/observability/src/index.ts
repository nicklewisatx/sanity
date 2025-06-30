import { registerOTel } from "@vercel/otel";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { getConfig, isEnabled } from "./config";
import { logger } from "./utils/logging";

export function initializeObservability(): void {
  if (!isEnabled()) {
    logger.debug("OpenTelemetry is disabled");
    return;
  }

  const config = getConfig();
  logger.info(`Initializing OpenTelemetry for service: ${config.serviceName}`);

  try {
    // Create the appropriate span processor based on configuration
    let spanProcessor: SimpleSpanProcessor | null = null;

    switch (config.exporter) {
      case "console":
        logger.debug("Creating console exporter for local development");
        spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
        break;
      case "axiom":
        if (config.axiom) {
          const { apiToken, dataset, domain } = config.axiom;
          logger.debug(`Creating Axiom exporter for dataset: ${dataset}`);

          const exporter = new OTLPTraceExporter({
            url: `https://${domain}/v1/traces`,
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "X-Axiom-Dataset": dataset,
            },
            timeoutMillis: 30000,
          });

          spanProcessor = new SimpleSpanProcessor(exporter);
        } else {
          logger.warn("Axiom configuration missing, falling back to console");
          spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
        }
        break;
      case "none":
        logger.info("No exporter configured");
        return;
    }

    if (!spanProcessor) {
      logger.error("Failed to create span processor");
      return;
    }

    // Initialize using @vercel/otel
    registerOTel({
      serviceName: config.serviceName,
      spanProcessors: [spanProcessor],
      attributes: {
        environment: process.env.NODE_ENV || "development",
        "service.version": process.env.npm_package_version || "unknown",
      },
    });

    logger.info("OpenTelemetry initialized successfully");

    // Register shutdown hooks to ensure spans are flushed
    const shutdown = async () => {
      logger.info("Shutting down OpenTelemetry");
      // Give time for spans to be exported
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Failed to initialize OpenTelemetry", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Export utilities
export * from "./utils/tracing";
export * from "./utils/logging";
export { getConfig, isEnabled } from "./config";
export type { ObservabilityConfig } from "./config";
