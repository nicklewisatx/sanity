import type { Span } from "@opentelemetry/api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the live module
const mockOriginalSanityFetch = vi.fn();
vi.mock("./live", () => ({
  sanityFetch: mockOriginalSanityFetch,
  SanityLive: {},
}));

// Mock the observability module
const mockSpan: Span = {
  setAttributes: vi.fn(),
  setAttribute: vi.fn(),
  setStatus: vi.fn(),
  updateName: vi.fn(),
  end: vi.fn(),
  isRecording: vi.fn(() => true),
  recordException: vi.fn(),
  addEvent: vi.fn(),
  addLink: vi.fn(),
  spanContext: vi.fn(() => ({
    traceId: "test-trace-id",
    spanId: "test-span-id",
    traceFlags: 1,
  })),
} as unknown as Span;

const mockWithSpan = vi.fn(
  async (name: string, fn: (span: Span) => Promise<any>, options?: any) => {
    return fn(mockSpan);
  },
);

vi.mock("@workspace/observability", () => ({
  withSpan: mockWithSpan,
}));

describe("sanityFetch with tracing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should wrap sanity fetch with tracing", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    const mockResult = { title: "Test Document", _id: "123" };
    mockOriginalSanityFetch.mockResolvedValue(mockResult);

    const result = await sanityFetch({
      query: '*[_type == "post"][0]',
      params: { limit: 10 },
      tags: ["post", "homepage"],
    });

    // Verify result
    expect(result).toEqual(mockResult);

    // Verify tracing was applied
    expect(mockWithSpan).toHaveBeenCalledWith(
      "sanity.fetch",
      expect.any(Function),
      {
        attributes: {
          "db.system": "sanity",
          "db.operation": "query",
        },
      },
    );

    // Verify span attributes were set
    expect(mockSpan.setAttributes).toHaveBeenCalledWith({
      "sanity.query": '*[_type == "post"][0]',
      "sanity.params": '{"limit":10}',
      "sanity.tags": "post,homepage",
    });

    // Verify original sanityFetch was called
    expect(mockOriginalSanityFetch).toHaveBeenCalledWith({
      query: '*[_type == "post"][0]',
      params: { limit: 10 },
      tags: ["post", "homepage"],
    });
  });

  it("should handle array results", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    const mockResults = [
      { title: "Post 1", _id: "1" },
      { title: "Post 2", _id: "2" },
      { title: "Post 3", _id: "3" },
    ];
    mockOriginalSanityFetch.mockResolvedValue(mockResults);

    const result = await sanityFetch({
      query: '*[_type == "post"]',
    });

    expect(result).toEqual(mockResults);

    // Verify array-specific attributes
    expect(mockSpan.setAttribute).toHaveBeenCalledWith(
      "sanity.result.count",
      3,
    );
    expect(mockSpan.setAttribute).toHaveBeenCalledWith(
      "sanity.result.type",
      "array",
    );
  });

  it("should handle object results", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    const mockResult = { title: "Single Post", _id: "abc" };
    mockOriginalSanityFetch.mockResolvedValue(mockResult);

    const result = await sanityFetch({
      query: '*[_type == "post"][0]',
    });

    expect(result).toEqual(mockResult);

    // Verify object-specific attributes
    expect(mockSpan.setAttribute).toHaveBeenCalledWith(
      "sanity.result.type",
      "object",
    );
  });

  it("should handle null results", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    mockOriginalSanityFetch.mockResolvedValue(null);

    const result = await sanityFetch({
      query: '*[_type == "nonexistent"][0]',
    });

    expect(result).toBeNull();

    // Should not set result attributes for null
    expect(mockSpan.setAttribute).not.toHaveBeenCalledWith(
      expect.stringContaining("sanity.result"),
      expect.anything(),
    );
  });

  it("should truncate long queries and params", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    const longQuery = '*[_type == "post" && ' + "a".repeat(250) + "]";
    const longParams = { filter: "b".repeat(250) };

    mockOriginalSanityFetch.mockResolvedValue([]);

    await sanityFetch({
      query: longQuery,
      params: longParams,
    });

    // Verify truncation
    const callArgs = mockSpan.setAttributes.mock.calls[0][0];
    expect(callArgs["sanity.query"].length).toBe(200);
    expect(callArgs["sanity.params"].length).toBe(200);
  });

  it("should handle queries without optional parameters", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    mockOriginalSanityFetch.mockResolvedValue({ test: true });

    await sanityFetch({
      query: '*[_type == "basic"]',
    });

    expect(mockSpan.setAttributes).toHaveBeenCalledWith({
      "sanity.query": '*[_type == "basic"]',
      "sanity.params": "{}",
      "sanity.tags": "",
    });

    expect(mockOriginalSanityFetch).toHaveBeenCalledWith({
      query: '*[_type == "basic"]',
      params: {},
    });
  });

  it("should pass through stega parameter", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    mockOriginalSanityFetch.mockResolvedValue({ stega: true });

    await sanityFetch({
      query: '*[_type == "stega"]',
      stega: true,
    });

    expect(mockOriginalSanityFetch).toHaveBeenCalledWith({
      query: '*[_type == "stega"]',
      params: {},
      stega: true,
    });
  });

  it("should properly type results", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    interface Post {
      title: string;
      _id: string;
      slug: string;
    }

    const mockPost: Post = {
      title: "Typed Post",
      _id: "123",
      slug: "typed-post",
    };

    mockOriginalSanityFetch.mockResolvedValue(mockPost);

    const result = await sanityFetch<Post>({
      query: '*[_type == "post"][0]',
    });

    // TypeScript should recognize this as Post
    expect(result.title).toBe("Typed Post");
    expect(result._id).toBe("123");
    expect(result.slug).toBe("typed-post");
  });

  it("should handle errors from original sanityFetch", async () => {
    const { sanityFetch } = await import("./fetch-with-tracing");

    const error = new Error("Sanity query failed");
    mockOriginalSanityFetch.mockRejectedValue(error);

    await expect(
      sanityFetch({
        query: '*[_type == "error"]',
      }),
    ).rejects.toThrow("Sanity query failed");
  });
});
