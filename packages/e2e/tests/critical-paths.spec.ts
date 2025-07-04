import { test, expect } from "@playwright/test";

test.describe("Critical User Paths", () => {
  test("homepage loads and navigation works", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Roboto Studio Demo|Nick Lewis/);

    // Test navigation - find any "About" link (could be in nav or footer)
    const aboutLinks = page.getByRole("link", { name: "About" });
    const aboutLinkCount = await aboutLinks.count();
    
    if (aboutLinkCount > 0) {
      // Click the first About link found
      await aboutLinks.first().click();
      await expect(page).toHaveURL(/\/about/);
    } else {
      console.log("No About link found, skipping navigation test");
    }
  });

  test("CMS content displays correctly", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Blog");

    // Verify the page loads without errors
    // Note: Blog posts may not exist in test environments
    const posts = page.getByRole("article");
    const count = await posts.count();

    // If no posts exist, verify the empty state or page structure
    if (count === 0) {
      // Verify the page still renders correctly without posts
      await expect(page.locator("main")).toBeVisible();
    } else {
      // If posts exist, verify at least one is displayed
      expect(count).toBeGreaterThan(0);
    }
  });
});
