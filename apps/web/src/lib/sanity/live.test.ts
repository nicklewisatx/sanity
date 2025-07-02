import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { createMockSanityClient, mockSanityData } from "@workspace/test-utils";

// Mock next/headers
const mockIsEnabled = vi.fn();
vi.mock("next/headers", () => ({
  draftMode: vi.fn(() => ({ isEnabled: mockIsEnabled })),
}));

// Mock the client
const mockClient = createMockSanityClient();
vi.mock("./client", () => ({
  client: mockClient,
}));

// Mock the token
vi.mock("./token", () => ({
  token: "test-token",
}));

// Mock defineLive from next-sanity
const mockSanityFetch = vi.fn();
const MockSanityLive = vi.fn();

vi.mock("next-sanity", () => ({
  defineLive: vi.fn((config) => {
    // Store the config for assertions
    const client = config.client;
    const serverToken = config.serverToken;
    const browserToken = config.browserToken;

    // Return mocked sanityFetch that simulates the behavior
    return {
      sanityFetch: async (options: any) => {
        const { query, params, revalidate = 60, stega } = options;
        const isDraftMode = mockIsEnabled();

        // Determine perspective based on draft mode
        const perspective = isDraftMode ? "previewDrafts" : "published";

        // Determine stega value
        const stegaValue = stega !== undefined ? stega : isDraftMode;

        // Build fetch options based on mode
        const fetchOptions: any = {
          perspective,
          stega: stegaValue,
        };

        // Only add caching options in production mode
        if (!isDraftMode) {
          fetchOptions.next = {
            revalidate,
            tags: ["sanity"],
          };
        }

        // Call the mocked client
        return mockClient.fetch(query, params, fetchOptions);
      },
      SanityLive: MockSanityLive,
    };
  }),
}));

describe("lib/sanity/live", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.SANITY_API_READ_TOKEN;
    mockIsEnabled.mockReturnValue(false);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("sanityFetch", () => {
    const query = `*[_type == "post"]`;
    const params = { slug: "hello-world" };

    describe("in Production Mode (draftMode disabled)", () => {
      beforeEach(() => {
        mockIsEnabled.mockReturnValue(false);
      });

      it("should fetch data with caching", async () => {
        const mockData = [mockSanityData.blog];
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({
          query,
          params,
          revalidate: 3600,
        });

        expect(result).toEqual(mockData);
        expect(mockClient.fetch).toHaveBeenCalledWith(query, params, {
          next: {
            revalidate: 3600,
            tags: ["sanity"],
          },
          perspective: "published",
          stega: false,
        });
      });

      it("should use default revalidation time", async () => {
        const mockData = [mockSanityData.blog];
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({ query });

        expect(result).toEqual(mockData);
        expect(mockClient.fetch).toHaveBeenCalledWith(query, undefined, {
          next: {
            revalidate: 60,
            tags: ["sanity"],
          },
          perspective: "published",
          stega: false,
        });
      });
    });

    describe("in Draft Mode (draftMode enabled)", () => {
      beforeEach(() => {
        mockIsEnabled.mockReturnValue(true);
      });

      it("should fetch data without caching", async () => {
        const mockData = [mockSanityData.blog];
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({ query, params });

        expect(result).toEqual(mockData);
        expect(mockClient.fetch).toHaveBeenCalledWith(query, params, {
          perspective: "previewDrafts",
          stega: true,
        });
      });

      it("should ignore revalidation in draft mode", async () => {
        const mockData = [mockSanityData.blog];
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({
          query,
          params,
          revalidate: 3600, // Should be ignored
        });

        expect(result).toEqual(mockData);
        expect(mockClient.fetch).toHaveBeenCalledWith(query, params, {
          perspective: "previewDrafts",
          stega: true,
        });
      });
    });

    describe("error handling", () => {
      it("should throw errors from Sanity client", async () => {
        const error = new Error("Sanity API error");
        mockClient.fetch.mockRejectedValueOnce(error);

        const { sanityFetch } = await import("./live");
        await expect(sanityFetch({ query })).rejects.toThrow(
          "Sanity API error",
        );
      });
    });

    describe("different data types", () => {
      it("should handle single document queries", async () => {
        const mockData = mockSanityData.homePage;
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({
          query: `*[_type == "homePage"][0]`,
        });

        expect(result).toEqual(mockData);
      });

      it("should handle empty results", async () => {
        mockClient.fetch.mockResolvedValueOnce([]);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({ query });

        expect(result).toEqual([]);
      });

      it("should handle null results", async () => {
        mockClient.fetch.mockResolvedValueOnce(null);

        const { sanityFetch } = await import("./live");
        const result = await sanityFetch({ query });

        expect(result).toBeNull();
      });
    });

    describe("stega parameter", () => {
      it("should accept explicit stega parameter in production", async () => {
        mockIsEnabled.mockReturnValue(false);
        const mockData = [mockSanityData.blog];
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        await sanityFetch({
          query,
          params,
          revalidate: 3600,
          stega: true,
        });

        expect(mockClient.fetch).toHaveBeenCalledWith(query, params, {
          next: {
            revalidate: 3600,
            tags: ["sanity"],
          },
          perspective: "published",
          stega: true,
        });
      });

      it("should accept explicit stega parameter in draft mode", async () => {
        mockIsEnabled.mockReturnValue(true);
        const mockData = [mockSanityData.blog];
        mockClient.fetch.mockResolvedValueOnce(mockData);

        const { sanityFetch } = await import("./live");
        await sanityFetch({
          query,
          params,
          stega: false,
        });

        expect(mockClient.fetch).toHaveBeenCalledWith(query, params, {
          perspective: "previewDrafts",
          stega: false,
        });
      });
    });
  });

  describe("defineLive configuration", () => {
    it("should be configured with correct parameters", async () => {
      const { defineLive } = await import("next-sanity");

      await import("./live");

      expect(defineLive).toHaveBeenCalledWith({
        client: mockClient,
        serverToken: "test-token",
        browserToken: "test-token",
      });
    });
  });
});
