# ESLint Config Package - Shared Linting Rules

**Last Updated by Claude:** 2025-07-01

## Overview

This package provides shared ESLint configuration for the entire monorepo, ensuring consistent code style and catching common errors across all TypeScript and React code.

## Configuration Structure

The package likely exports different configs:

- **Base config:** Core JavaScript/TypeScript rules
- **React config:** React-specific rules and hooks
- **Next.js config:** Next.js specific rules

## Usage

In app/package `eslint.config.js`:

```javascript
import baseConfig from "@workspace/eslint-config";

export default [
  ...baseConfig,
  // app-specific overrides
];
```

## Key Features

1. **TypeScript Support:** Type-aware linting rules
2. **React Rules:** Hooks rules, JSX best practices
3. **Import Order:** Consistent import organization
4. **Accessibility:** a11y rule enforcement
5. **Performance:** Rules to catch performance issues

## Common Rules

- Prefer `const` over `let`
- No unused variables
- Consistent return types
- React hooks dependencies
- Import order and grouping

## Extending Configuration

Apps can extend with specific needs:

```javascript
export default [
  ...baseConfig,
  {
    rules: {
      // app-specific overrides
    },
  },
];
```

## Notes for AI Assistants

- This is the source of truth for code style
- Don't disable rules without good reason
- Run `pnpm lint` before commits
- Fix linting issues, don't ignore them
- Keep rules consistent across monorepo

## Maintenance Notes

**IMPORTANT:** Update this file when:

- Major rule changes
- New plugins added
- Config structure changes
