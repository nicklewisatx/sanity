import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractResponseData } from "@workspace/test-utils";

// Mock OpenTelemetry API
const mockSpan = {
  spanContext: vi.fn(() => ({
    traceId: "test-trace-id",
    spanId: "test-span-id",
    traceFlags: 1,
  })),
  setAttributes: vi.fn(),
  setAttribute: vi.fn(),
  recordException: vi.fn(),
  end: vi.fn(),
};

const mockTracer = {
  startSpan: vi.fn(() => mockSpan),
};

vi.mock("@opentelemetry/api", () => ({
  trace: {
    getTracer: vi.fn(() => mockTracer),
    setSpan: vi.fn((context, span) => context),
  },
  context: {
    active: vi.fn(() => ({})),
    with: vi.fn(async (context, fn) => await fn()),
  },
}));

// Mock observability config
const mockConfig = {
  serviceName: "test-service",
  exporter: "console",
  axiom: {
    apiToken: "test-token",
    dataset: "test-dataset",
  },
};

vi.mock("@workspace/observability", () => ({
  getConfig: vi.fn(() => mockConfig),
  isEnabled: vi.fn(() => true),
}));

describe("api/otel-debug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers();
    delete global._otelRegistered;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return debug information when telemetry is enabled", async () => {
    const { GET } = await import("./route");

    const responsePromise = GET();

    // Advance timers for the simulated work
    await vi.advanceTimersByTimeAsync(50); // Child span work
    await vi.advanceTimersByTimeAsync(100); // Exporter time

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      success: true,
      debug: {
        otelEnabled: true,
        config: {
          serviceName: "test-service",
          exporter: "console",
          axiom: {
            apiToken: "***", // Should be masked
            dataset: "test-dataset",
          },
        },
        span: {
          traceId: "test-trace-id",
          spanId: "test-span-id",
          isValid: true,
          traceFlags: 1,
        },
      },
    });

    // Verify spans were created
    expect(mockTracer.startSpan).toHaveBeenCalledWith("debug.test.root");
    expect(mockTracer.startSpan).toHaveBeenCalledWith("debug.test.child");
  });

  it("should handle disabled telemetry", async () => {
    const { getConfig, isEnabled } = await import("@workspace/observability");
    const mockedIsEnabled = vi.mocked(isEnabled);
    const mockedGetConfig = vi.mocked(getConfig);

    mockedIsEnabled.mockReturnValue(false);
    mockedGetConfig.mockReturnValue({
      serviceName: "test-service",
      exporter: "none",
    });

    const { GET } = await import("./route");
    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(150);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data.debug.otelEnabled).toBe(false);
    expect(data.debug.checks.exporterConfigured).toBe(false);
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Test error");

    // Create a new span that throws when recording exception
    const errorSpan = {
      ...mockSpan,
      recordException: vi.fn(),
      end: vi.fn(),
    };

    mockTracer.startSpan.mockReturnValueOnce(errorSpan);

    // Mock setAttributes to throw the error
    errorSpan.setAttributes = vi.fn(() => {
      throw error;
    });

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: "Debug test failed",
      details: "Test error",
    });

    // Verify error handling
    expect(errorSpan.recordException).toHaveBeenCalledWith(error);
    expect(errorSpan.end).toHaveBeenCalled();
  });

  it("should mark instrumentation as registered when enabled", async () => {
    // Reset module to trigger global registration
    vi.resetModules();
    vi.doMock("@workspace/observability", () => ({
      getConfig: vi.fn(() => ({ exporter: "console" })),
      isEnabled: vi.fn(() => true),
    }));

    await import("./route");

    expect(global._otelRegistered).toBe(true);
  });

  it("should validate span context properly", async () => {
    // Test with invalid span context
    mockSpan.spanContext.mockReturnValueOnce({
      traceId: "00000000000000000000000000000000",
      spanId: "0000000000000000",
      traceFlags: 0,
    });

    const { GET } = await import("./route");
    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(150);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(data.debug.span.isValid).toBe(false);
    expect(data.debug.checks.contextValid).toBe(false);
  });

  it("should set span attributes correctly", async () => {
    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(150);
    await responsePromise;

    // Verify root span attributes were called with the expected structure
    expect(mockSpan.setAttributes).toHaveBeenCalledWith(
      expect.objectContaining({
        "debug.test": true,
        "debug.timestamp": expect.any(Number),
        "debug.config": expect.any(String),
      }),
    );

    // Verify the config was stringified (behavior check, not exact content)
    const callArgs = mockSpan.setAttributes.mock.calls[0][0];
    expect(callArgs["debug.config"]).toBeTruthy();
    expect(() => JSON.parse(callArgs["debug.config"])).not.toThrow();

    // Verify child span attribute
    expect(mockSpan.setAttribute).toHaveBeenCalledWith("child.test", true);
  });

  it("should provide instructions for verification", async () => {
    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(150);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(data.instructions).toEqual({
      console: "Check your terminal for span output if using console exporter",
      axiom: "Visit https://app.axiom.co and check your dataset for traces",
      verify: "Trace ID to search for: test-trace-id",
    });
  });

  it("should include environment information", async () => {
    process.env.NODE_ENV = "test";
    process.env.NEXT_RUNTIME = "nodejs";
    global._otelRegistered = true;

    const { GET } = await import("./route");

    const responsePromise = GET();
    await vi.advanceTimersByTimeAsync(150);

    const response = await responsePromise;
    const data = await extractResponseData(response);

    expect(data.debug.environment).toEqual({
      NODE_ENV: "test",
      NEXT_RUNTIME: "nodejs",
      instrumentationRegistered: true,
    });
  });
});
