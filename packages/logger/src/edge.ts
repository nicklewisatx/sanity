// Edge-compatible logger that only uses console methods
// No file system operations or Node.js modules

// const isProduction = process.env.NODE_ENV === 'production';
const enableHttpLogging = process.env.EDGE_LOG_HTTP === "true";
const logEndpoint = process.env.EDGE_LOG_ENDPOINT || "/api/logs";

// Configuration is now silent

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

type LogLevel = keyof typeof levels;

interface LogBuffer {
  entries: Array<{
    level: LogLevel;
    message: string;
    timestamp: string;
    service?: string;
    meta?: unknown;
  }>;
  timer?: number;
}

class EdgeLogger {
  private level: LogLevel;
  private service?: string;
  private buffer: LogBuffer = { entries: [] };

  constructor(service?: string) {
    const envLevel = process.env.LOG_LEVEL || "info";
    this.level = (envLevel as LogLevel) || "info";
    this.service = service;
  }

  private shouldLog(msgLevel: LogLevel): boolean {
    return levels[msgLevel] <= levels[this.level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: unknown,
  ): string {
    const timestamp = new Date().toISOString();
    const service = this.service ? ` [${this.service}]` : "";
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} ${level.toUpperCase()}${service}: ${message}${metaStr}`;
  }

  private async sendToHttp(level: LogLevel, message: string, meta?: unknown) {
    if (!enableHttpLogging) return;

    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      meta,
    };

    this.buffer.entries.push(entry);

    // Clear existing timer
    if (this.buffer.timer) {
      clearTimeout(this.buffer.timer);
    }

    // Batch logs and send after 100ms of inactivity or when buffer reaches 10 entries
    if (this.buffer.entries.length >= 10) {
      this.flushBuffer();
    } else {
      this.buffer.timer = setTimeout(
        () => this.flushBuffer(),
        100,
      ) as unknown as number;
    }
  }

  private async flushBuffer() {
    if (this.buffer.entries.length === 0) return;

    const entries = [...this.buffer.entries];
    this.buffer.entries = [];

    try {
      // In Edge Runtime, we need to use absolute URLs
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${logEndpoint}`
          : `http://localhost:3000${logEndpoint}`;

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries.length === 1 ? entries[0] : entries),
      });
    } catch (error) {
      // Silently fail - we don't want logging to break the app
      console.error("Failed to send logs to HTTP endpoint:", error);
    }
  }

  error(message: string, meta?: unknown) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, meta));
      this.sendToHttp("error", message, meta);
    }
  }

  warn(message: string, meta?: unknown) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, meta));
      this.sendToHttp("warn", message, meta);
    }
  }

  info(message: string, meta?: unknown) {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, meta));
      this.sendToHttp("info", message, meta);
    }
  }

  http(message: string, meta?: unknown) {
    if (this.shouldLog("http")) {
      console.log(this.formatMessage("http", message, meta));
      this.sendToHttp("http", message, meta);
    }
  }

  debug(message: string, meta?: unknown) {
    if (this.shouldLog("debug")) {
      console.log(this.formatMessage("debug", message, meta));
      this.sendToHttp("debug", message, meta);
    }
  }

  child(options: { service: string }) {
    return new EdgeLogger(options.service);
  }
}

const logger = new EdgeLogger();

export default logger;

export const createChildLogger = (service: string) => {
  return logger.child({ service });
};

export type Logger = typeof logger;
