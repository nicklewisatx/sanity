export interface ObservabilityConfig {
  enabled: boolean;
  serviceName: string;
  logLevel: "debug" | "info" | "warn" | "error";
  exporter: "console" | "axiom" | "none";
  axiom?: {
    apiToken: string;
    dataset: string;
    domain?: string;
  };
}

export function getConfig(): ObservabilityConfig {
  const enabled = process.env.OTEL_ENABLED === "true";
  const serviceName = process.env.OTEL_SERVICE_NAME || "unknown-service";
  const logLevel = (process.env.OTEL_LOG_LEVEL ||
    "info") as ObservabilityConfig["logLevel"];
  const exporter = (process.env.OTEL_EXPORTER ||
    "console") as ObservabilityConfig["exporter"];

  const config: ObservabilityConfig = {
    enabled,
    serviceName,
    logLevel,
    exporter,
  };

  // Add Axiom config if using Axiom exporter
  if (exporter === "axiom") {
    const apiToken = process.env.AXIOM_API_TOKEN;
    const dataset = process.env.AXIOM_DATASET;

    if (!apiToken || !dataset) {
      console.warn(
        "Axiom exporter configured but AXIOM_API_TOKEN or AXIOM_DATASET not set. Falling back to console exporter.",
      );
      config.exporter = "console";
    } else {
      config.axiom = {
        apiToken,
        dataset,
        domain: process.env.AXIOM_DOMAIN || "api.axiom.co",
      };
    }
  }

  return config;
}

export function isEnabled(): boolean {
  return process.env.OTEL_ENABLED === "true";
}

export function shouldLog(level: ObservabilityConfig["logLevel"]): boolean {
  if (!isEnabled()) return false;

  const config = getConfig();
  const levels: ObservabilityConfig["logLevel"][] = [
    "debug",
    "info",
    "warn",
    "error",
  ];
  const configLevelIndex = levels.indexOf(config.logLevel);
  const requestedLevelIndex = levels.indexOf(level);

  return requestedLevelIndex >= configLevelIndex;
}
