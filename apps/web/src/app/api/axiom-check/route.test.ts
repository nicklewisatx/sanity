import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractResponseData } from "@workspace/test-utils";

// Mock fetch globally
global.fetch = vi.fn();

describe("api/axiom-check", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };

    // Set default environment variables
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";
    process.env.AXIOM_DOMAIN = "api.axiom.co";
    process.env.OTEL_SERVICE_NAME = "test-service";
    process.env.OTEL_EXPORTER = "otlp";
    process.env.OTEL_ENABLED = "true";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return error when Axiom is not configured", async () => {
    delete process.env.AXIOM_API_TOKEN;
    delete process.env.AXIOM_DATASET;

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(400);

    const data = await extractResponseData(response);
    expect(data).toEqual({
      error: "Axiom not configured",
      config: {
        hasToken: false,
        dataset: undefined,
        domain: "api.axiom.co",
      },
    });
  });

  it("should return error when only token is missing", async () => {
    delete process.env.AXIOM_API_TOKEN;

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(400);

    const data = await extractResponseData(response);
    expect(data.error).toBe("Axiom not configured");
    expect(data.config.hasToken).toBe(false);
    expect(data.config.dataset).toBe("test-dataset");
  });

  it("should handle failed dataset access", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => "Forbidden",
    } as Response);

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(400);

    const data = await extractResponseData(response);
    expect(data).toEqual({
      error: "Failed to access dataset",
      status: 403,
      message: "Forbidden",
    });
  });

  it("should successfully check Axiom with traces", async () => {
    // Mock successful dataset fetch
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "test-dataset",
          created: "2024-01-01T00:00:00Z",
        }),
      } as Response)
      // Mock successful query for recent traces
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          matches: [
            {
              _time: "2024-01-01T00:00:00Z",
              trace: { trace_id: "trace-1" },
              name: "span-1",
              service: { name: "test-service" },
              attributes: { key: "value" },
            },
            {
              _time: "2024-01-01T00:01:00Z",
              trace: { trace_id: "trace-2" },
              name: "span-2",
              service: { name: "test-service" },
              attributes: { key2: "value2" },
            },
          ],
        }),
      } as Response)
      // Mock successful query for all traces
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          buckets: [{ count: 100 }],
        }),
      } as Response);

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await extractResponseData(response);
    expect(data).toEqual({
      success: true,
      dataset: {
        name: "test-dataset",
        created: "2024-01-01T00:00:00Z",
      },
      recentTraces: {
        count: 2,
        serviceName: "test-service",
        traces: [
          {
            timestamp: "2024-01-01T00:00:00Z",
            traceId: "trace-1",
            spanName: "span-1",
            serviceName: "test-service",
            attributes: { key: "value" },
          },
          {
            timestamp: "2024-01-01T00:01:00Z",
            traceId: "trace-2",
            spanName: "span-2",
            serviceName: "test-service",
            attributes: { key2: "value2" },
          },
        ],
      },
      totalTracesLastHour: 100,
      config: {
        serviceName: "test-service",
        exporter: "otlp",
        enabled: "true",
      },
    });

    // Verify API calls
    expect(global.fetch).toHaveBeenCalledTimes(3);

    // Dataset check
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.axiom.co/v1/datasets/test-dataset",
      {
        headers: {
          Authorization: "Bearer test-token",
        },
      },
    );

    // Recent traces query
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

  it("should handle no traces found", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "test-dataset",
          created: "2024-01-01T00:00:00Z",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ buckets: [] }),
      } as Response);

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await extractResponseData(response);
    expect(data.recentTraces.count).toBe(0);
    expect(data.recentTraces.traces).toEqual([]);
    expect(data.totalTracesLastHour).toBe(0);
  });

  it("should handle query failures", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "test-dataset",
          created: "2024-01-01T00:00:00Z",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => "Invalid query",
      } as Response);

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(400);

    const data = await extractResponseData(response);
    expect(data).toEqual({
      error: "Query failed",
      status: 400,
      message: "Invalid query",
    });
  });

  it("should handle network errors", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const { GET } = await import("./route");
    const response = await GET();

    expect(response.status).toBe(500);

    const data = await extractResponseData(response);
    expect(data).toEqual({
      error: "Failed to check Axiom",
      details: "Network error",
    });
  });

  it("should use custom domain when provided", async () => {
    process.env.AXIOM_DOMAIN = "custom.axiom.domain";

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: "test-dataset", created: "2024-01-01" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ buckets: [] }),
      } as Response);

    const { GET } = await import("./route");
    await GET();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://custom.axiom.domain/v1/datasets/test-dataset",
      expect.any(Object),
    );
  });
});
