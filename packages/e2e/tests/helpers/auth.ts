import { Page } from '@playwright/test';

export async function bypassVercelProtection(page: Page) {
  const bypass = process.env.VERCEL_PROTECTION_BYPASS_SECRET;
  if (bypass) {
    await page.goto(`/?x-vercel-protection-bypass=${bypass}`);
  }
}