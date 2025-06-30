import { trace } from "@opentelemetry/api";
import { shouldLog } from "../config";
import type { ObservabilityConfig } from "../config";

interface LogContext {
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

function getTraceContext(): { traceId: string; spanId: string } | null {
  const span = trace.getActiveSpan();
  if (!span) return null;

  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

function formatLog(
  level: ObservabilityConfig["logLevel"],
  message: string,
  context?: LogContext,
): string {
  const traceContext = getTraceContext();
  const fullContext = {
    ...context,
    ...traceContext,
  };

  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${
    Object.keys(fullContext).length > 0 ? JSON.stringify(fullContext) : ""
  }`;
}

export function debug(message: string, context?: LogContext): void {
  if (shouldLog("debug")) {
    console.log(formatLog("debug", message, context));
  }
}

export function info(message: string, context?: LogContext): void {
  if (shouldLog("info")) {
    console.log(formatLog("info", message, context));
  }
}

export function warn(message: string, context?: LogContext): void {
  if (shouldLog("warn")) {
    console.warn(formatLog("warn", message, context));
  }
}

export function error(message: string, context?: LogContext): void {
  if (shouldLog("error")) {
    console.error(formatLog("error", message, context));
  }
}

export const logger = {
  debug,
  info,
  warn,
  error,
};
