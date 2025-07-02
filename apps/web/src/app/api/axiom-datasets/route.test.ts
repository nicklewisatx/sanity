import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { extractResponseData } from "@workspace/test-utils";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("api/axiom-datasets", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("GET", () => {
    it("should return error when API token is missing", async () => {
      delete process.env.AXIOM_API_TOKEN;

      const { GET } = await import("./route");
      const response = await GET();
      const data = await extractResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({ error: "Missing API token" });
    });

    it("should successfully list datasets", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";
      process.env.AXIOM_DATASET = "my-dataset";

      const mockDatasets = [
        {
          name: "my-dataset",
          created: "2024-01-01",
          description: "Test dataset",
        },
        {
          name: "other-dataset",
          created: "2024-01-02",
          description: "Other dataset",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDatasets,
      });

      const { GET } = await import("./route");
      const response = await GET();
      const data = await extractResponseData(response);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.axiom.co/v1/datasets",
        {
          headers: {
            Authorization: "Bearer test-token",
          },
        },
      );

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        count: 2,
        datasets: [
          {
            name: "my-dataset",
            created: "2024-01-01",
            description: "Test dataset",
          },
          {
            name: "other-dataset",
            created: "2024-01-02",
            description: "Other dataset",
          },
        ],
        currentDataset: "my-dataset",
        exists: true,
      });
    });

    it("should handle non-existent current dataset", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";
      process.env.AXIOM_DATASET = "non-existent";

      const mockDatasets = [
        { name: "dataset-1", created: "2024-01-01", description: "Dataset 1" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDatasets,
      });

      const { GET } = await import("./route");
      const response = await GET();
      const data = await extractResponseData(response);

      expect(data.currentDataset).toBe("non-existent");
      expect(data.exists).toBe(false);
    });

    it("should handle API error responses", async () => {
      process.env.AXIOM_API_TOKEN = "invalid-token";

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

    it("should handle network errors", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";

      const networkError = new Error("Network error");
      mockFetch.mockRejectedValueOnce(networkError);

      const { GET } = await import("./route");
      const response = await GET();
      const data = await extractResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({
        error: "Failed to fetch datasets",
        details: "Network error",
      });
    });
  });

  describe("POST", () => {
    it("should return error when API token is missing", async () => {
      delete process.env.AXIOM_API_TOKEN;

      const { POST } = await import("./route");
      const response = await POST();
      const data = await extractResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({ error: "Missing API token" });
    });

    it("should successfully create dataset with custom name", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";
      process.env.AXIOM_DATASET = "custom-dataset";

      const mockDataset = {
        name: "custom-dataset",
        created: "2024-01-01",
        description: "OpenTelemetry traces for Sanity Next.js development",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDataset,
      });

      const { POST } = await import("./route");
      const response = await POST();
      const data = await extractResponseData(response);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.axiom.co/v1/datasets",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "custom-dataset",
            description: "OpenTelemetry traces for Sanity Next.js development",
          }),
        },
      );

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: "Dataset 'custom-dataset' created successfully",
        dataset: mockDataset,
      });
    });

    it("should use default dataset name when not specified", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";
      delete process.env.AXIOM_DATASET;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: "dev-traces" }),
      });

      const { POST } = await import("./route");
      const response = await POST();
      const data = await extractResponseData(response);

      const callArgs = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callArgs.name).toBe("dev-traces");

      expect(data.message).toBe("Dataset 'dev-traces' created successfully");
    });

    it("should handle API error responses", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";
      process.env.AXIOM_DATASET = "existing-dataset";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        text: async () => "Dataset already exists",
      });

      const { POST } = await import("./route");
      const response = await POST();
      const data = await extractResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({
        error: "Failed to create dataset",
        status: 409,
        message: "Dataset already exists",
      });
    });

    it("should handle network errors", async () => {
      process.env.AXIOM_API_TOKEN = "test-token";

      const networkError = new Error("Connection refused");
      mockFetch.mockRejectedValueOnce(networkError);

      const { POST } = await import("./route");
      const response = await POST();
      const data = await extractResponseData(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({
        error: "Failed to create dataset",
        details: "Connection refused",
      });
    });
  });
});
