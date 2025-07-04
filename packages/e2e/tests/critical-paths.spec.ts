import { test, expect } from "@playwright/test";

test.describe("Critical User Paths", () => {
  test("homepage loads and navigation works", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Roboto Studio Demo/);

    // Test navigation - verify link exists first
    const aboutLink = page.getByRole("link", { name: "About" });
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL("/about");
  });

  test("CMS content displays correctly", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Blog");

    // Verify posts load - check count is greater than 0
    const posts = page.getByRole("article");
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
  });
});
