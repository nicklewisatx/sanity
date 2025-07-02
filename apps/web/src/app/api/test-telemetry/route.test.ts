import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractResponseData } from "@workspace/test-utils";

// Mock observability with withSpan
const mockWithSpan = vi.fn();
const mockLogger = {
  info: vi.fn(),
};

vi.mock("@workspace/observability", () => ({
  withSpan: mockWithSpan,
  logger: mockLogger,
}));

// Mock fetch for Axiom queries
global.fetch = vi.fn();

describe("api/test-telemetry", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.useFakeTimers();

    // Set up default withSpan behavior
    mockWithSpan.mockImplementation(async (name, fn) => {
      const mockSpan = {
        setAttribute: vi.fn(),
        setStatus: vi.fn(),
        end: vi.fn(),
        spanContext: () => ({
          traceId: "test-trace-id",
          spanId: "test-span-id",
        }),
      };
      return await fn(mockSpan);
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.useRealTimers();
  });

  it("should handle GET request successfully", async () => {
    process.env.OTEL_ENABLED = "true";
    process.env.OTEL_SERVICE_NAME = "test-service";
    process.env.OTEL_EXPORTER = "console";

    const { GET } = await import("./route");

    const responsePromise = GET();

    // Fast-forward timers for the simulated work (100ms)
    await vi.advanceTimersByTimeAsync(100);

    const response = await responsePromise;

    expect(response.status).toBe(200);

    const data = await extractResponseData(response);
    expect(data).toMatchObject({
      success: true,
      message: "Telemetry test completed",
      result: 84, // 42 * 2
      trace: {
        enabled: true,
        serviceName: "test-service",
        exporter: "console",
        traceId: "test-trace-id",
      },
    });
  });

  it("should create telemetry spans", async () => {
    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(100);
    await responsePromise;

    // Verify main span
    expect(mockWithSpan).toHaveBeenCalledWith(
      "api.test-telemetry",
      expect.any(Function),
    );

    // Verify nested spans
    expect(mockWithSpan).toHaveBeenCalledWith(
      "api.test-telemetry.simulate-work",
      expect.any(Function),
    );

    expect(mockWithSpan).toHaveBeenCalledWith(
      "api.test-telemetry.calculate",
      expect.any(Function),
    );
  });

  it("should set span attributes", async () => {
    let capturedMainSpan: any;
    let capturedWorkSpan: any;
    let capturedCalcSpan: any;

    mockWithSpan.mockImplementation(async (name, fn) => {
      const mockSpan = {
        setAttribute: vi.fn(),
        setStatus: vi.fn(),
        end: vi.fn(),
        spanContext: () => ({
          traceId: "test-trace-id",
          spanId: "test-span-id",
        }),
      };

      if (name === "api.test-telemetry") {
        capturedMainSpan = mockSpan;
      } else if (name === "api.test-telemetry.simulate-work") {
        capturedWorkSpan = mockSpan;
      } else if (name === "api.test-telemetry.calculate") {
        capturedCalcSpan = mockSpan;
      }

      return await fn(mockSpan);
    });

    const { GET } = await import("./route");
    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(100);
    await responsePromise;

    // Verify main span attributes
    expect(capturedMainSpan.setAttribute).toHaveBeenCalledWith(
      "test.type",
      "manual",
    );
    expect(capturedMainSpan.setAttribute).toHaveBeenCalledWith(
      "test.timestamp",
      expect.any(String),
    );
    expect(capturedMainSpan.setAttribute).toHaveBeenCalledWith(
      "test.unique_id",
      expect.stringMatching(/^test-\d+$/),
    );

    // Verify work span attributes
    expect(capturedWorkSpan.setAttribute).toHaveBeenCalledWith(
      "work.duration",
      100,
    );
    expect(capturedWorkSpan.setAttribute).toHaveBeenCalledWith(
      "work.type",
      "simulation",
    );

    // Verify calculation span attributes
    expect(capturedCalcSpan.setAttribute).toHaveBeenCalledWith(
      "calculation.input",
      42,
    );
    expect(capturedCalcSpan.setAttribute).toHaveBeenCalledWith(
      "calculation.output",
      84,
    );
    expect(capturedCalcSpan.setAttribute).toHaveBeenCalledWith(
      "calculation.formula",
      "input * 2",
    );
  });

  it("should verify trace in Axiom when configured", async () => {
    process.env.OTEL_EXPORTER = "axiom";
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";

    // Mock successful Axiom query
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        matches: [{ trace: { trace_id: "test-trace-id" }, name: "test-span" }],
      }),
    } as Response);

    const { GET } = await import("./route");

    const responsePromise = GET();

    // Fast-forward for work simulation (100ms)
    await vi.advanceTimersByTimeAsync(100);

    // Fast-forward for Axiom wait (2000ms)
    await vi.advanceTimersByTimeAsync(2000);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(data.axiomVerification).toEqual({
      found: true,
      count: 1,
      traces: [{ trace: { trace_id: "test-trace-id" }, name: "test-span" }],
    });

    // Verify Axiom API was called
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.axiom.co/v1/datasets/test-dataset/query",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("should handle missing Axiom credentials", async () => {
    process.env.OTEL_EXPORTER = "axiom";
    // No Axiom credentials

    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(100);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(data.axiomVerification).toEqual({
      error: "Axiom credentials not configured",
    });
  });

  it("should handle Axiom query errors", async () => {
    process.env.OTEL_EXPORTER = "axiom";
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";

    // Mock failed Axiom query
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(2000);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(data.axiomVerification).toEqual({
      error: "Failed to query Axiom",
      details: "Network error",
    });
  });

  it("should log telemetry information", async () => {
    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(100);
    await responsePromise;

    expect(mockLogger.info).toHaveBeenCalledWith("Testing telemetry endpoint", {
      traceId: "test-trace-id",
    });

    expect(mockLogger.info).toHaveBeenCalledWith("Telemetry test completed", {
      result: 84,
      traceId: "test-trace-id",
    });
  });
});
