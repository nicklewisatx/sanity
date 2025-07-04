# E2E Testing Package

This package contains Playwright end-to-end tests for the Sanity + Next.js project.

## Quick Start

```bash
# Run all tests (headless by default)
pnpm --filter=@repo/e2e test

# Run tests in headed mode (visible browser)
pnpm --filter=@repo/e2e test:headed

# Run tests in UI mode (interactive)
pnpm --filter=@repo/e2e test:ui

# Debug tests (headed mode with debugging)
pnpm --filter=@repo/e2e test:debug

# View test report
pnpm --filter=@repo/e2e test:report
```

## Structure

- `tests/` - Test files
  - `critical-paths.spec.ts` - Core user journey tests
  - `helpers/auth.ts` - Vercel authentication helpers
- `playwright.config.ts` - Playwright configuration

## Key Features

1. **Headless by Default**: Tests run headless (no visible browser) for CI/CD compatibility
2. **Proper Exit Codes**: Tests exit with correct status codes for CI/CD pipelines
3. **Automatic Server Management**: The `webServer` config starts/stops the dev server automatically
4. **Vercel Authentication**: Handles password-protected preview deployments
5. **MCP Integration**: Claude Code can analyze UI using accessibility trees
6. **Turborepo Optimized**: Proper caching and dependency management
7. **Smart Reporting**: Uses 'list' reporter locally, 'github' reporter in CI

## Writing Tests

Focus on critical user paths first:

```typescript
import { test, expect } from "@playwright/test";

test("user can navigate site", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Sanity/);
});
```

## CI/CD

Tests run automatically on successful Vercel deployments via GitHub Actions.

**Last Updated by Claude**: 2025-07-01 - Updated to run headless by default with proper exit codes
