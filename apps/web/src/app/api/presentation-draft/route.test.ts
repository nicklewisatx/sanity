import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockRequest } from "@workspace/test-utils";

// Mock Sanity client and token first
const mockClient = {
  withConfig: vi.fn(() => ({})),
};

vi.mock("@/lib/sanity/client", () => ({
  client: mockClient,
}));

vi.mock("@/lib/sanity/token", () => ({
  token: "test-token",
}));

// Mock next-sanity
const mockDefineEnableDraftMode = vi.fn();
vi.mock("next-sanity/draft-mode", () => ({
  defineEnableDraftMode: mockDefineEnableDraftMode,
}));

describe("api/presentation-draft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should enable draft mode with valid secret", async () => {
    // Mock the GET handler that defineEnableDraftMode returns
    const mockHandler = vi.fn(async (request: Request) => {
      const url = new URL(request.url);
      const previewSecret = url.searchParams.get("previewSecret");

      if (!previewSecret) {
        return new Response("Missing previewSecret", { status: 400 });
      }

      if (previewSecret !== "valid-secret") {
        return new Response("Invalid previewSecret", { status: 401 });
      }

      return new Response("Draft mode enabled", {
        status: 200,
        headers: {
          "Set-Cookie": "draft-mode=true; Path=/; HttpOnly",
        },
      });
    });

    mockDefineEnableDraftMode.mockReturnValue({ GET: mockHandler });

    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/presentation-draft?previewSecret=valid-secret",
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Draft mode enabled");
    expect(response.headers.get("Set-Cookie")).toContain("draft-mode=true");
  });

  it("should return 400 without previewSecret", async () => {
    // Use the same mock handler
    const mockHandler = vi.fn(async (request: Request) => {
      const url = new URL(request.url);
      const previewSecret = url.searchParams.get("previewSecret");

      if (!previewSecret) {
        return new Response("Missing previewSecret", { status: 400 });
      }

      return new Response("Invalid previewSecret", { status: 401 });
    });

    mockDefineEnableDraftMode.mockReturnValue({ GET: mockHandler });

    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/presentation-draft",
    });

    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing previewSecret");
  });

  it("should return 401 with invalid secret", async () => {
    // Use the same mock handler
    const mockHandler = vi.fn(async (request: Request) => {
      const url = new URL(request.url);
      const previewSecret = url.searchParams.get("previewSecret");

      if (!previewSecret) {
        return new Response("Missing previewSecret", { status: 400 });
      }

      if (previewSecret !== "valid-secret") {
        return new Response("Invalid previewSecret", { status: 401 });
      }

      return new Response("Draft mode enabled", { status: 200 });
    });

    mockDefineEnableDraftMode.mockReturnValue({ GET: mockHandler });

    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/presentation-draft?previewSecret=wrong-secret",
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Invalid previewSecret");
  });

  it("should configure client with token", async () => {
    // Mock a simple handler for this test
    mockDefineEnableDraftMode.mockReturnValue({
      GET: vi.fn(() => new Response("OK")),
    });

    await import("./route");

    expect(mockDefineEnableDraftMode).toHaveBeenCalledWith({
      client: expect.objectContaining({}),
    });
    expect(mockClient.withConfig).toHaveBeenCalledWith({ token: "test-token" });
  });
});
