import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractResponseData } from "@workspace/test-utils";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("api/axiom-test", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env = originalEnv;
  });

  it("should return error when credentials are missing", async () => {
    delete process.env.AXIOM_API_TOKEN;
    delete process.env.AXIOM_DATASET;

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({ error: "Missing credentials" });
  });

  it("should return error when only token is missing", async () => {
    delete process.env.AXIOM_API_TOKEN;
    process.env.AXIOM_DATASET = "test-dataset";

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({ error: "Missing credentials" });
  });

  it("should return error when only dataset is missing", async () => {
    process.env.AXIOM_API_TOKEN = "test-token";
    delete process.env.AXIOM_DATASET;

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({ error: "Missing credentials" });
  });

  it("should successfully test Axiom connection and ingestion", async () => {
    const testDate = new Date("2024-01-01T12:00:00.000Z");
    vi.setSystemTime(testDate);

    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";
    process.env.OTEL_SERVICE_NAME = "test-service";

    const mockDatasets = [
      { name: "test-dataset", created: "2024-01-01" },
      { name: "other-dataset", created: "2024-01-02" },
    ];

    // Mock datasets list response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDatasets,
    });

    // Mock ingest response
    const mockIngestResult = {
      ingested: 1,
      failed: 0,
      datasetId: "test-dataset-id",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIngestResult,
    });

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    // Verify datasets were listed
    expect(mockFetch).toHaveBeenCalledWith("https://api.axiom.co/v1/datasets", {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    // Verify test event was ingested
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.axiom.co/v1/datasets/test-dataset/ingest",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            _time: "2024-01-01T12:00:00.000Z",
            test: true,
            message: "OpenTelemetry test event",
            service: "test-service",
          },
        ]),
      },
    );

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      datasets: ["test-dataset", "other-dataset"],
      targetDataset: "test-dataset",
      datasetExists: true,
      ingestResult: mockIngestResult,
      testEvent: {
        _time: "2024-01-01T12:00:00.000Z",
        test: true,
        message: "OpenTelemetry test event",
        service: "test-service",
      },
    });
  });

  it("should handle datasets list API error", async () => {
    process.env.AXIOM_API_TOKEN = "invalid-token";
    process.env.AXIOM_DATASET = "test-dataset";

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({
      error: "Failed to list datasets",
      status: 401,
      message: "Unauthorized",
    });
  });

  it("should handle ingest API error", async () => {
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";

    // Mock successful datasets list
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ name: "test-dataset" }],
    });

    // Mock failed ingest
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Invalid event format",
    });

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({
      error: "Failed to ingest test event",
      status: 400,
      message: "Invalid event format",
      dataset: "test-dataset",
    });
  });

  it("should handle network errors", async () => {
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";

    const networkError = new Error("Network timeout");
    mockFetch.mockRejectedValueOnce(networkError);

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({
      error: "Failed to test Axiom",
      details: "Network timeout",
    });
  });

  it("should detect when target dataset does not exist", async () => {
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "non-existent-dataset";

    const mockDatasets = [
      { name: "other-dataset-1" },
      { name: "other-dataset-2" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDatasets,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ingested: 1 }),
    });

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(data.targetDataset).toBe("non-existent-dataset");
    expect(data.datasetExists).toBe(false);
  });

  it("should handle undefined OTEL_SERVICE_NAME", async () => {
    process.env.AXIOM_API_TOKEN = "test-token";
    process.env.AXIOM_DATASET = "test-dataset";
    delete process.env.OTEL_SERVICE_NAME;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ name: "test-dataset" }],
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ingested: 1 }),
    });

    const { GET } = await import("./route");
    const response = await GET();
    const data = await extractResponseData(response);

    expect(data.testEvent.service).toBeUndefined();
  });
});
