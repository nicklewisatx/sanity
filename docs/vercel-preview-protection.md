# Vercel Preview Protection Setup

This guide explains how to set up Vercel preview protection bypass for E2E tests.

## Why This Is Needed

Vercel preview deployments can be password-protected to prevent unauthorized access. E2E tests need to bypass this protection to run against preview deployments in CI.

## Getting the Bypass Secret

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Security**
3. Under **Protection Bypass for Preview Deployments**, you'll find:
   - The bypass secret (if one exists)
   - Option to generate a new bypass secret

## Setting Up GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VERCEL_PROTECTION_BYPASS_SECRET`
5. Value: The bypass secret from Vercel
6. Click **Add secret**

## Using in E2E Tests

The bypass is already configured in `.github/workflows/e2e.yml` and available as an environment variable.

To use it in tests, you have two options:

### Option 1: Use the bypass helper (Recommended)

```typescript
import { test } from '@playwright/test';
import { bypassVercelProtection } from './helpers/auth';

test.beforeEach(async ({ page }) => {
  await bypassVercelProtection(page);
});
```

### Option 2: Configure globally in playwright.config.ts

```typescript
export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    // Add bypass token to all requests
    extraHTTPHeaders: process.env.VERCEL_PROTECTION_BYPASS_SECRET ? {
      'x-vercel-protection-bypass': process.env.VERCEL_PROTECTION_BYPASS_SECRET,
    } : undefined,
  },
});
```

## Troubleshooting

- If tests fail with 401/403 errors, the bypass secret is likely missing or incorrect
- Ensure the secret is set in both Vercel and GitHub
- The bypass parameter can be added as a query parameter: `?x-vercel-protection-bypass=SECRET`
- Or as a header: `x-vercel-protection-bypass: SECRET`

## Security Notes

- Never commit the bypass secret to the repository
- Rotate the secret periodically
- Only share with team members who need CI access