import { describe, it, expect, beforeEach, vi } from "vitest";
import { getConfig, isEnabled, shouldLog } from "../config";

describe("Observability Config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isEnabled", () => {
    it('should return true when OTEL_ENABLED is "true"', () => {
      process.env.OTEL_ENABLED = "true";
      expect(isEnabled()).toBe(true);
    });

    it('should return false when OTEL_ENABLED is not "true"', () => {
      process.env.OTEL_ENABLED = "false";
      expect(isEnabled()).toBe(false);
    });

    it("should return false when OTEL_ENABLED is undefined", () => {
      delete process.env.OTEL_ENABLED;
      expect(isEnabled()).toBe(false);
    });
  });

  describe("getConfig", () => {
    it("should return default config when no env vars are set", () => {
      const config = getConfig();
      expect(config).toEqual({
        enabled: false,
        serviceName: "unknown-service",
        logLevel: "info",
        exporter: "console",
      });
    });

    it("should use environment variables when set", () => {
      process.env.OTEL_ENABLED = "true";
      process.env.OTEL_SERVICE_NAME = "test-service";
      process.env.OTEL_LOG_LEVEL = "debug";
      process.env.OTEL_EXPORTER = "none";

      const config = getConfig();
      expect(config).toEqual({
        enabled: true,
        serviceName: "test-service",
        logLevel: "debug",
        exporter: "none",
      });
    });

    it("should configure Axiom when exporter is axiom and credentials are provided", () => {
      process.env.OTEL_ENABLED = "true";
      process.env.OTEL_EXPORTER = "axiom";
      process.env.AXIOM_API_TOKEN = "test-token";
      process.env.AXIOM_DATASET = "test-dataset";
      process.env.AXIOM_DOMAIN = "test.axiom.co";

      const config = getConfig();
      expect(config.exporter).toBe("axiom");
      expect(config.axiom).toEqual({
        apiToken: "test-token",
        dataset: "test-dataset",
        domain: "test.axiom.co",
      });
    });

    it("should fall back to console when Axiom credentials are missing", () => {
      process.env.OTEL_ENABLED = "true";
      process.env.OTEL_EXPORTER = "axiom";
      // Missing AXIOM_API_TOKEN and AXIOM_DATASET

      const config = getConfig();
      expect(config.exporter).toBe("console");
      expect(config.axiom).toBeUndefined();
    });
  });

  describe("shouldLog", () => {
    beforeEach(() => {
      process.env.OTEL_ENABLED = "true";
    });

    it("should return false when disabled", () => {
      process.env.OTEL_ENABLED = "false";
      expect(shouldLog("debug")).toBe(false);
    });

    it("should respect log level hierarchy", () => {
      process.env.OTEL_LOG_LEVEL = "warn";

      expect(shouldLog("debug")).toBe(false);
      expect(shouldLog("info")).toBe(false);
      expect(shouldLog("warn")).toBe(true);
      expect(shouldLog("error")).toBe(true);
    });

    it("should log all levels when set to debug", () => {
      process.env.OTEL_LOG_LEVEL = "debug";

      expect(shouldLog("debug")).toBe(true);
      expect(shouldLog("info")).toBe(true);
      expect(shouldLog("warn")).toBe(true);
      expect(shouldLog("error")).toBe(true);
    });
  });
});
