import winston from "winston";
import "winston-daily-rotate-file";
import { join } from "path";
import { mkdirSync } from "fs";
import { resolve } from "path";

const isProduction = process.env.NODE_ENV === "production";
const logDirectory = resolve(process.cwd(), process.env.LOG_DIR || "logs");

// Error throttling configuration
interface ThrottleEntry {
  count: number;
  firstSeen: number;
  lastSeen: number;
}

const errorThrottle = new Map<string, ThrottleEntry>();
const THROTTLE_WINDOW_MS = 60000; // 1 minute window
const THROTTLE_THRESHOLD = 5; // Log first 5 occurrences, then throttle
const THROTTLE_LOG_INTERVAL = 10; // Log every 10th occurrence after threshold

// Ensure log directory exists
try {
  mkdirSync(logDirectory, { recursive: true });
} catch (error) {
  console.error("Failed to create log directory:", error);
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Console format with colors for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${info.level}: ${info.message}${info.stack ? "\n" + info.stack : ""}`,
        ),
      ),
);

// File format without colors
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.uncolorize(),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || "info",
    format: consoleFormat,
  }),
];

// Configuration is now silent unless there's an error

if (isProduction || process.env.ENABLE_FILE_LOGS === "true") {
  transports.push(
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: join(logDirectory, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: join(logDirectory, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat,
    }),
  );
}

// Function to check if an error should be throttled
function shouldThrottle(
  message: string,
  level: string,
): { throttle: boolean; info?: string } {
  if (level !== "error" && level !== "warn") {
    return { throttle: false };
  }

  const now = Date.now();
  const key = `${level}:${message}`;
  const entry = errorThrottle.get(key);

  // Clean up old entries periodically
  if (errorThrottle.size > 100) {
    for (const [k, v] of errorThrottle.entries()) {
      if (now - v.lastSeen > THROTTLE_WINDOW_MS * 2) {
        errorThrottle.delete(k);
      }
    }
  }

  if (!entry) {
    errorThrottle.set(key, { count: 1, firstSeen: now, lastSeen: now });
    return { throttle: false };
  }

  // Reset counter if outside window
  if (now - entry.firstSeen > THROTTLE_WINDOW_MS) {
    errorThrottle.set(key, { count: 1, firstSeen: now, lastSeen: now });
    return { throttle: false };
  }

  entry.count++;
  entry.lastSeen = now;

  // Always log first few occurrences
  if (entry.count <= THROTTLE_THRESHOLD) {
    return { throttle: false };
  }

  // After threshold, only log every Nth occurrence
  if ((entry.count - THROTTLE_THRESHOLD) % THROTTLE_LOG_INTERVAL === 0) {
    return {
      throttle: false,
      info: ` [Repeated ${entry.count} times in ${Math.round((now - entry.firstSeen) / 1000)}s]`,
    };
  }

  return { throttle: true };
}

// Create a custom logger that wraps winston with throttling
class ThrottledLogger {
  private winston: winston.Logger;

  constructor(winstonLogger: winston.Logger) {
    this.winston = winstonLogger;
  }

  private log(level: string, message: string, meta?: unknown) {
    const { throttle, info } = shouldThrottle(message, level);

    if (throttle) {
      return;
    }

    const enhancedMessage = info ? `${message}${info}` : message;
    return this.winston.log(level, enhancedMessage, meta);
  }

  error(message: string, meta?: unknown) {
    return this.log("error", message, meta);
  }

  warn(message: string, meta?: unknown) {
    return this.log("warn", message, meta);
  }

  info(message: string, meta?: unknown) {
    return this.winston.info(message, meta);
  }

  http(message: string, meta?: unknown) {
    return this.winston.http(message, meta);
  }

  debug(message: string, meta?: unknown) {
    return this.winston.debug(message, meta);
  }

  child(options: Record<string, unknown>) {
    return new ThrottledLogger(this.winston.child(options));
  }
}

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  transports,
  exitOnError: false,
});

// Winston already has the http level, we just need to use it correctly
const extendedLogger = winstonLogger;

const logger = new ThrottledLogger(extendedLogger);

export default logger;

export const createChildLogger = (service: string) => {
  return logger.child({ service });
};

export type Logger = ThrottledLogger;
