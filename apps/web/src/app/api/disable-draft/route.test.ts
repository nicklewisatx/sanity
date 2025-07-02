import { createMockRequest } from "@workspace/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/headers
const mockDisable = vi.fn();
vi.mock("next/headers", () => ({
  draftMode: vi.fn(() =>
    Promise.resolve({
      disable: mockDisable,
    }),
  ),
}));

// Mock next/navigation - redirect in Next.js throws a special error
class NextRedirectError extends Error {
  constructor(public url: string) {
    super(`NEXT_REDIRECT: ${url}`);
    this.name = "NEXT_REDIRECT";
  }
}

const mockRedirect = vi.fn((url: string) => {
  throw new NextRedirectError(url);
});

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

describe("api/disable-draft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should disable draft mode and redirect to home", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft",
    });

    // Expect the redirect to throw
    const promise = GET(request);

    // Fast-forward the timer
    await vi.advanceTimersByTimeAsync(1000);

    // Should throw redirect error
    await expect(promise).rejects.toThrow(NextRedirectError);
    await expect(promise).rejects.toThrow("NEXT_REDIRECT: /");

    expect(mockDisable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("should redirect to specified slug", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft?slug=/blog/my-post",
    });

    const promise = GET(request);

    // Fast-forward the timer
    await vi.advanceTimersByTimeAsync(1000);

    // Should throw redirect error with the slug
    await expect(promise).rejects.toThrow(NextRedirectError);
    await expect(promise).rejects.toThrow("NEXT_REDIRECT: /blog/my-post");

    expect(mockDisable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/blog/my-post");
  });

  it("should handle URL-encoded slugs", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft?slug=%2Fblog%2Fmy%20post%20title",
    });

    const promise = GET(request);

    await vi.advanceTimersByTimeAsync(1000);

    // Should throw redirect error with decoded slug
    await expect(promise).rejects.toThrow(NextRedirectError);
    await expect(promise).rejects.toThrow("NEXT_REDIRECT: /blog/my post title");

    expect(mockRedirect).toHaveBeenCalledWith("/blog/my post title");
  });

  it("should wait 1 second before redirecting", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft",
    });

    const promise = GET(request);

    // Should not redirect immediately
    expect(mockRedirect).not.toHaveBeenCalled();

    // Advance time by 500ms - still shouldn't redirect
    await vi.advanceTimersByTimeAsync(500);
    expect(mockRedirect).not.toHaveBeenCalled();

    // Advance remaining 500ms
    await vi.advanceTimersByTimeAsync(500);

    // Should throw redirect error after 1 second
    await expect(promise).rejects.toThrow(NextRedirectError);

    expect(mockRedirect).toHaveBeenCalled();
  });
});
