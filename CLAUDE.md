# Sanity + Next.js Project Guide

This is a modern monorepo project using Next.js 15, Sanity Studio v3, and TurboRepo.

## CLAUDE.md Maintenance

**IMPORTANT:** Each package and app has its own CLAUDE.md file with specific context:

- `/apps/web/CLAUDE.md` - Next.js frontend application
- `/apps/studio/CLAUDE.md` - Sanity Studio CMS
- `/packages/ui/CLAUDE.md` - Shared UI components
- `/packages/observability/CLAUDE.md` - OpenTelemetry integration
- `/packages/eslint-config/CLAUDE.md` - ESLint configuration
- `/packages/typescript-config/CLAUDE.md` - TypeScript configuration
- `/packages/e2e/CLAUDE.md` - Playwright E2E testing

**Last Updated by Claude:** 2025-07-01 - Added pnpm lock file reminder

### Keeping CLAUDE.md Files Updated

When making significant changes:

1. Update the relevant package/app CLAUDE.md file
2. Include "Last Updated by Claude" timestamp
3. Document new patterns, dependencies, or structure changes
4. Keep descriptions concise but comprehensive

These files help AI assistants understand the codebase efficiently.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

- Web app: http://localhost:3000
- Sanity Studio: http://localhost:3333

## Documentation

### Core Guides

- [📚 Stack & Architecture](./docs/stack.md) - Technology overview and project structure
- [🚀 Local Development](./docs/local-development.md) - Commands, workflow, and environment setup

### Development

- [🎨 Frontend Guide](./docs/frontend.md) - Next.js patterns, components, and data fetching
- [🗄️ Sanity Backend](./docs/sanity-backend.md) - Schemas, GROQ queries, and Studio development
- [⚡ Performance](./docs/performance.md) - Optimization techniques and best practices
- [📊 Observability](./docs/observability.md) - OpenTelemetry integration and tracing

### Support

- [🔧 Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions
- [🤖 Slash Commands](./docs/commands/README.md) - Automated development tasks

## Key Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm dev --filter=web      # Start specific app
pnpm start                  # Start dev server in background (recommended for AI assistants)

# Code Quality
pnpm lint                  # Run linter
pnpm format               # Format code
pnpm check-types          # Type checking

# Testing
pnpm test                  # Run unit tests
pnpm test:e2e             # Run E2E tests
pnpm --filter=@repo/e2e test:ui  # Run E2E tests in UI mode

# Sanity
cd apps/studio && pnpm run type     # Generate types
cd apps/studio && npx sanity deploy # Deploy studio
```

## Environment Variables

Create `.env.local` files:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-token

# apps/studio/.env.local
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

## Development Workflow

1. **Make Changes**: Edit files, hot reload works automatically
2. **Check Types**: Run `pnpm check-types` before committing
3. **Format Code**: Run `pnpm format` to ensure consistency
4. **Tests**: Run `pnpm test` to check tests
5. **Generate Types**: After schema changes, run type generation

## Need Help?

- Check [Troubleshooting Guide](./docs/troubleshooting.md) for common issues
- Use Vision plugin at `/studio/vision` to test GROQ queries
- Enable debug logging with `LOG_LEVEL=debug pnpm dev`

## Important Reminders

- **pnpm Lock Files**: **ALWAYS** commit `pnpm-lock.yaml` when adding new packages or dependencies. Without the lockfile, CI/CD deployments will fail because pnpm workspaces require it for dependency resolution. Local tests may pass but deployments will fail without it.
- **Claude Code Dev Server Fix**: To avoid timeouts when running dev servers:
  - Use `pnpm start:claude` for a Claude Code-optimized dev server (runs with --no-daemon and --concurrency=1)
  - Use `pnpm start:background` to run completely in background with logs in `dev.log`
  - The `start` script now includes automatic port cleanup to prevent conflicts
- **OpenTelemetry Setup**: The project has OpenTelemetry integration prepared. See [Local Development Guide](./docs/local-development.md) for telemetry configuration details
- **Sanity Visual Editing**: When working with Sanity's visual editing feature, the `stega` parameter is a valid option for `sanityFetch`. See: https://www.sanity.io/docs/visual-editing/stega

## Claude Code Hooks

This project includes TypeScript hooks for bug prevention when using Claude Code:

- **Automatic Formatting**: Prettier runs on TypeScript/JavaScript files before edits
- **Essential Linting**: Catches common errors (unused vars, undefined vars, prefer-const)
- **Fast Performance**: 2-second timeout ensures no workflow interruptions
- **Workspace Aware**: Uses pnpm filters for monorepo efficiency

Configuration: `.claude/config.json` - Customize lint rules and enable/disable features
Documentation: See [Claude Hooks Guide](./docs/claude-hooks.md) for detailed information
