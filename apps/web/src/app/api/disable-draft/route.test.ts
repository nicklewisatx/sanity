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

// Mock next/navigation
const mockRedirect = vi.fn();

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

    // Start the GET handler
    const promise = GET(request);

    // Fast-forward the timer by 1 second
    await vi.advanceTimersByTimeAsync(1000);

    // Wait for completion
    await promise;

    expect(mockDisable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("should redirect to specified slug", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft?slug=/blog/my-post",
    });

    // Start the GET handler
    const promise = GET(request);

    // Fast-forward the timer by 1 second
    await vi.advanceTimersByTimeAsync(1000);

    // Wait for completion
    await promise;

    expect(mockDisable).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/blog/my-post");
  });

  it("should handle URL-encoded slugs", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft?slug=%2Fblog%2Fmy%20post%20title",
    });

    // Start the GET handler
    const promise = GET(request);

    // Fast-forward the timer by 1 second
    await vi.advanceTimersByTimeAsync(1000);

    // Wait for completion
    await promise;

    expect(mockRedirect).toHaveBeenCalledWith("/blog/my post title");
  });

  it("should wait 1 second before redirecting", async () => {
    const { GET } = await import("./route");

    const request = createMockRequest({
      url: "http://localhost:3000/api/disable-draft",
    });

    // Start the GET handler in the background
    const promise = GET(request);

    // Should not redirect immediately
    expect(mockRedirect).not.toHaveBeenCalled();

    // Advance time by 500ms - still shouldn't redirect
    await vi.advanceTimersByTimeAsync(500);
    expect(mockRedirect).not.toHaveBeenCalled();

    // Advance remaining 500ms
    await vi.advanceTimersByTimeAsync(500);

    // Wait for completion
    await promise;

    expect(mockRedirect).toHaveBeenCalled();
  });
});
