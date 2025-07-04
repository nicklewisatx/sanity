import { existsSync } from "fs";
import { join } from "path";

export interface CIValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCIParity(
  projectRoot = process.cwd(),
): CIValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check pnpm-lock.yaml exists
  const lockfilePath = join(projectRoot, "pnpm-lock.yaml");
  if (!existsSync(lockfilePath)) {
    errors.push('pnpm-lock.yaml not found. Run "pnpm install" to generate it.');
  }

  // Check Node version
  const requiredNodeVersion = 20;
  const currentNodeVersion = parseInt(
    process.version.slice(1).split(".")[0] || "0",
  );
  if (currentNodeVersion < requiredNodeVersion) {
    errors.push(
      `Node.js version ${requiredNodeVersion} or higher required. Current: ${process.version}`,
    );
  }

  // Check required environment variables for CI
  const requiredEnvVars = [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "SANITY_STUDIO_PROJECT_ID",
    "SANITY_STUDIO_DATASET",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );
  if (missingEnvVars.length > 0) {
    warnings.push(
      `Missing environment variables: ${missingEnvVars.join(", ")}`,
    );
  }

  // Check if running with frozen lockfile
  if (
    process.env.CI !== "true" &&
    !process.argv.includes("--frozen-lockfile")
  ) {
    warnings.push(
      "Not using --frozen-lockfile. CI uses this flag to ensure reproducible builds.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertCIParity(projectRoot?: string): void {
  const result = validateCIParity(projectRoot);

  if (result.warnings.length > 0) {
    console.warn("\n⚠️  CI Parity Warnings:");
    result.warnings.forEach((warning) => console.warn(`   - ${warning}`));
  }

  if (!result.valid) {
    console.error("\n❌ CI Parity Errors:");
    result.errors.forEach((error) => console.error(`   - ${error}`));
    throw new Error(
      "CI parity validation failed. Fix the errors above to match CI environment.",
    );
  }
}
