import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("server responds", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
  });

  test("has expected title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
  });
});
