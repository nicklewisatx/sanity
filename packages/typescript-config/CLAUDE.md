# TypeScript Config Package - Shared TS Configuration

**Last Updated by Claude:** 2025-07-01

## Overview

This package provides shared TypeScript configurations for the monorepo, ensuring consistent type checking and compilation settings across all packages and applications.

## Configuration Files

Typically includes:

- **base.json:** Core TypeScript settings
- **react.json:** React-specific settings
- **node.json:** Node.js backend settings
- **package.json:** Package-specific settings

## Usage

In app/package `tsconfig.json`:

```json
{
  "extends": "@workspace/typescript-config/base.json",
  "compilerOptions": {
    // app-specific overrides
  }
}
```

## Key Settings

Common compiler options:

- **strict:** true - Maximum type safety
- **esModuleInterop:** true - Better imports
- **skipLibCheck:** true - Faster builds
- **moduleResolution:** bundler/node
- **target:** ES2022 or later

## Type Safety Features

1. **Strict Null Checks:** Catch null/undefined errors
2. **No Implicit Any:** Require explicit types
3. **Strict Function Types:** Precise function signatures
4. **No Unused Locals:** Clean code enforcement

## Path Mapping

Supports workspace imports:

```json
{
  "paths": {
    "@workspace/*": ["../../packages/*"]
  }
}
```

## Build Targets

- **Web Apps:** ES2022 + DOM libs
- **Node Apps:** ES2022 + Node types
- **Libraries:** Compatible output

## Notes for AI Assistants

- Use the strictest settings possible
- Run `pnpm check-types` regularly
- Don't use `any` unless absolutely necessary
- Prefer unknown over any for safety
- Keep configurations DRY via extends

## Maintenance Notes

**IMPORTANT:** Update this file when:

- TypeScript version updates
- New compiler options added
- Target environments change
