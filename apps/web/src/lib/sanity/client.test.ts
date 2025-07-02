import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { SanityImageSource } from "@sanity/asset-utils";

// Mock dependencies
vi.mock("next-sanity", () => ({
  createClient: vi.fn(),
}));

vi.mock("@sanity/image-url", () => ({
  default: vi.fn(),
}));

vi.mock("./api", () => ({
  apiVersion: "2024-01-01",
  dataset: "production",
  projectId: "test-project-id",
  studioUrl: "/studio",
}));

describe("lib/sanity/client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("client configuration", () => {
    it("should create client with correct configuration", async () => {
      process.env.NODE_ENV = "production";
      process.env.NEXT_PUBLIC_VERCEL_ENV = "production";

      const { createClient } = await import("next-sanity");
      const mockedCreateClient = vi.mocked(createClient);

      await import("./client");

      expect(mockedCreateClient).toHaveBeenCalledWith({
        projectId: "test-project-id",
        dataset: "production",
        apiVersion: "2024-01-01",
        useCdn: true,
        perspective: "published",
        stega: {
          studioUrl: "/studio",
          enabled: false,
        },
      });
    });

    it("should use CDN in production", async () => {
      process.env.NODE_ENV = "production";

      const { createClient } = await import("next-sanity");
      const mockedCreateClient = vi.mocked(createClient);

      await import("./client");

      const lastCall =
        mockedCreateClient.mock.calls[mockedCreateClient.mock.calls.length - 1];
      expect(lastCall[0].useCdn).toBe(true);
    });

    it("should disable CDN in development", async () => {
      process.env.NODE_ENV = "development";

      const { createClient } = await import("next-sanity");
      const mockedCreateClient = vi.mocked(createClient);

      await import("./client");

      const lastCall =
        mockedCreateClient.mock.calls[mockedCreateClient.mock.calls.length - 1];
      expect(lastCall[0].useCdn).toBe(false);
    });

    it("should enable stega in preview environment", async () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";

      const { createClient } = await import("next-sanity");
      const mockedCreateClient = vi.mocked(createClient);

      await import("./client");

      const lastCall =
        mockedCreateClient.mock.calls[mockedCreateClient.mock.calls.length - 1];
      expect(lastCall[0].stega).toEqual({
        studioUrl: "/studio",
        enabled: true,
      });
    });

    it("should disable stega in production environment", async () => {
      process.env.NODE_ENV = "production";
      process.env.NEXT_PUBLIC_VERCEL_ENV = "production";

      const { createClient } = await import("next-sanity");
      const mockedCreateClient = vi.mocked(createClient);

      await import("./client");

      const lastCall =
        mockedCreateClient.mock.calls[mockedCreateClient.mock.calls.length - 1];
      expect(lastCall[0].stega.enabled).toBe(false);
    });
  });

  describe("urlFor image builder", () => {
    it("should create image URL builder with correct configuration", async () => {
      const createImageUrlBuilder = (await import("@sanity/image-url")).default;
      const mockedImageUrlBuilder = vi.mocked(createImageUrlBuilder);

      await import("./client");

      expect(mockedImageUrlBuilder).toHaveBeenCalledWith({
        projectId: "test-project-id",
        dataset: "production",
      });
    });

    it("should apply auto format, fit, and webp format", async () => {
      const mockSource: SanityImageSource = {
        _type: "image",
        asset: { _ref: "image-123" },
      };

      const mockFormat = vi.fn(() => "formatted-url");
      const mockFit = vi.fn(() => ({ format: mockFormat }));
      const mockAuto = vi.fn(() => ({ fit: mockFit }));
      const mockImage = vi.fn(() => ({ auto: mockAuto }));

      const createImageUrlBuilder = (await import("@sanity/image-url")).default;
      const mockedImageUrlBuilder = vi.mocked(createImageUrlBuilder);

      mockedImageUrlBuilder.mockReturnValue({
        image: mockImage,
      } as any);

      const { urlFor } = await import("./client");
      const result = urlFor(mockSource);

      expect(mockImage).toHaveBeenCalledWith(mockSource);
      expect(mockAuto).toHaveBeenCalledWith("format");
      expect(mockFit).toHaveBeenCalledWith("max");
      expect(mockFormat).toHaveBeenCalledWith("webp");
      expect(result).toBe("formatted-url");
    });
  });
});
