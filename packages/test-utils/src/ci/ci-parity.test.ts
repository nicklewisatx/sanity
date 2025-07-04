import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { existsSync } from "fs";
import { validateCIParity, assertCIParity } from "./index.js";

// Mock fs
vi.mock("fs", () => ({
  existsSync: vi.fn(),
}));

const mockedExistsSync = vi.mocked(existsSync);

describe("CI Parity Validation", () => {
  const originalEnv = process.env;
  const originalArgv = process.argv;
  const originalVersion = process.version;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
    // Mock Node 20
    Object.defineProperty(process, "version", {
      value: "v20.10.0",
      configurable: true,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    process.argv = originalArgv;
    Object.defineProperty(process, "version", {
      value: originalVersion,
      configurable: true,
    });
  });

  describe("validateCIParity", () => {
    it("should pass when all requirements are met", () => {
      mockedExistsSync.mockReturnValue(true);
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
      process.env.SANITY_STUDIO_PROJECT_ID = "test-project";
      process.env.SANITY_STUDIO_DATASET = "production";
      process.env.CI = "true";

      const result = validateCIParity();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("should error when pnpm-lock.yaml is missing", () => {
      mockedExistsSync.mockReturnValue(false);

      const result = validateCIParity();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'pnpm-lock.yaml not found. Run "pnpm install" to generate it.',
      );
    });

    it("should error when Node version is too old", () => {
      mockedExistsSync.mockReturnValue(true);
      Object.defineProperty(process, "version", {
        value: "v18.0.0",
        configurable: true,
      });

      const result = validateCIParity();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Node.js version 20 or higher required. Current: v18.0.0",
      );
    });

    it("should warn about missing environment variables", () => {
      mockedExistsSync.mockReturnValue(true);
      // Set two env vars
      process.env.NEXT_PUBLIC_SANITY_DATASET = "test";
      process.env.SANITY_STUDIO_DATASET = "test";
      // Delete two env vars
      delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      delete process.env.SANITY_STUDIO_PROJECT_ID;

      const result = validateCIParity();

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        "Missing environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_STUDIO_PROJECT_ID",
      );
    });

    it("should warn when not using frozen lockfile", () => {
      mockedExistsSync.mockReturnValue(true);
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "test";
      process.env.SANITY_STUDIO_PROJECT_ID = "test";
      process.env.SANITY_STUDIO_DATASET = "test";
      delete process.env.CI;

      const result = validateCIParity();

      expect(result.warnings).toContain(
        "Not using --frozen-lockfile. CI uses this flag to ensure reproducible builds.",
      );
    });

    it("should not warn about frozen lockfile when in CI", () => {
      mockedExistsSync.mockReturnValue(true);
      process.env.CI = "true";

      const result = validateCIParity();

      expect(result.warnings).not.toContain(
        "Not using --frozen-lockfile. CI uses this flag to ensure reproducible builds.",
      );
    });
  });

  describe("assertCIParity", () => {
    const consoleSpy = {
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };

    beforeEach(() => {
      consoleSpy.warn.mockClear();
      consoleSpy.error.mockClear();
    });

    it("should not throw when validation passes", () => {
      mockedExistsSync.mockReturnValue(true);
      process.env.CI = "true";

      expect(() => assertCIParity()).not.toThrow();
    });

    it("should throw when validation fails", () => {
      mockedExistsSync.mockReturnValue(false);

      expect(() => assertCIParity()).toThrow("CI parity validation failed");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining("CI Parity Errors:"),
      );
    });

    it("should log warnings but not throw", () => {
      mockedExistsSync.mockReturnValue(true);
      delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

      expect(() => assertCIParity()).not.toThrow();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining("CI Parity Warnings:"),
      );
    });
  });
});
