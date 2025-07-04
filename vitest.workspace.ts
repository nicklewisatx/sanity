import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // Include all apps and packages
  "apps/*",
  "packages/*",
  // Exclude e2e tests as they use Playwright
  "!packages/e2e",
]);
