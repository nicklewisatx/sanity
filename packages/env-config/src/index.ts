import { z } from 'zod';

// Define environment variable schemas
export const sanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().optional(),
  NEXT_PUBLIC_SANITY_STUDIO_URL: z.string().url().optional(),
  SANITY_API_READ_TOKEN: z.string().optional(),
  SANITY_API_WRITE_TOKEN: z.string().optional(),
});

export const vercelEnvSchema = z.object({
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
});

export const logtailEnvSchema = z.object({
  LOGTAIL_TOKEN: z.string().optional(),
  LOGTAIL_INGESTION_HOST: z.string().optional(),
});

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Combined schema for the entire app
export const envSchema = baseEnvSchema
  .merge(sanityEnvSchema)
  .merge(vercelEnvSchema)
  .merge(logtailEnvSchema);

export type EnvConfig = z.infer<typeof envSchema>;

// Type-safe environment variable access
export function getEnvConfig(): EnvConfig {
  return envSchema.parse(process.env);
}

// Partial validation for specific contexts
export function validateSanityEnv() {
  return sanityEnvSchema.parse(process.env);
}

// Get config with defaults
export function getEnvConfigSafe(): Partial<EnvConfig> {
  return envSchema.safeParse(process.env).data || {};
}

// Environment validation result
export interface EnvValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}

// Validate environment with detailed errors
export function validateEnvironment(): EnvValidationResult {
  const result = envSchema.safeParse(process.env);
  
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.push({
        field: issue.path.join('.'),
        message: issue.message
      });
    });
  }

  // Add warnings for optional but recommended fields
  if (!process.env.SANITY_API_READ_TOKEN) {
    warnings.push({
      field: 'SANITY_API_READ_TOKEN',
      message: 'Token not set. Some features may be limited.'
    });
  }

  if (!process.env.LOGTAIL_TOKEN && process.env.NODE_ENV === 'production') {
    warnings.push({
      field: 'LOGTAIL_TOKEN',
      message: 'Logging token not set for production environment.'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Get base URL helper
export function getBaseUrl(): string {
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

// Export types
export type SanityEnv = z.infer<typeof sanityEnvSchema>;
export type VercelEnv = z.infer<typeof vercelEnvSchema>;
export type LogtailEnv = z.infer<typeof logtailEnvSchema>;
export type BaseEnv = z.infer<typeof baseEnvSchema>;