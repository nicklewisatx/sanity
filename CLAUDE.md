# Sanity + Next.js Monorepo - AI Context Documentation

This is a modern monorepo project using Next.js 15, Sanity Studio v3, and TurboRepo with comprehensive TypeScript support and observability.

**Last Updated by Claude:** 2025-07-04 - Refactored to native Turbo process management

## Project Overview

### Technology Stack

- **Frontend**: Next.js 15.3.4 (App Router) with React 19.1.0
- **CMS**: Sanity Studio v3.93.0 with visual editing
- **Monorepo**: TurboRepo v2.5.4 with pnpm v10.12.2
- **Language**: TypeScript v5.7.3 with strict mode
- **Styling**: Tailwind CSS v3.4.17 with Radix UI components
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Observability**: OpenTelemetry with Axiom integration
- **Component Development**: Storybook v8.6.14 (Vite-based)

### Architecture Pattern

```
/ (root)
├── apps/
│   ├── web/              # Next.js 15 frontend (port 3000)
│   └── studio/           # Sanity Studio v3 CMS (port 3333)
├── packages/
│   ├── ui/               # Shared React component library
│   ├── observability/    # OpenTelemetry integration
│   ├── test-utils/       # Shared testing utilities
│   ├── e2e/              # Playwright E2E tests
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/# Shared TypeScript configurations
├── scripts/              # Process management and automation
├── docs/                 # Project documentation
└── .claude/              # AI assistant configuration
```

## CLAUDE.md Maintenance

**IMPORTANT:** Each package and app has its own CLAUDE.md file with specific context:

- `/apps/web/CLAUDE.md` - Next.js frontend application
- `/apps/studio/CLAUDE.md` - Sanity Studio CMS
- `/packages/ui/CLAUDE.md` - Shared UI components with Storybook
- `/packages/observability/CLAUDE.md` - OpenTelemetry integration
- `/packages/eslint-config/CLAUDE.md` - ESLint configuration
- `/packages/typescript-config/CLAUDE.md` - TypeScript configuration
- `/packages/e2e/CLAUDE.md` - Playwright E2E testing
- `/packages/test-utils/CLAUDE.md` - Testing utilities

### Keeping CLAUDE.md Files Updated

When making significant changes:

1. Update the relevant package/app CLAUDE.md file
2. Include "Last Updated by Claude" timestamp
3. Document new patterns, dependencies, or structure changes
4. Keep descriptions concise but comprehensive
5. Cross-reference related documentation

## Quick Start

```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm dev              # Uses Turbo parallel execution

# Start with automatic port cleanup
pnpm start            # Stops any running processes first, then starts

# Start with quiet output
pnpm start:quiet      # Streamlined output mode

# Start individual services
pnpm dev:web          # Just the web app
pnpm dev:studio       # Just Sanity Studio
pnpm dev:storybook    # Just Storybook

# Stop all services
pnpm stop             # Kills all dev processes
pnpm stop:ports       # Alternative: kills by port numbers
```

### Service URLs

- Web app: http://localhost:3000
- Sanity Studio: http://localhost:3333
- Storybook: http://localhost:6006

## Documentation Structure

### Core Documentation

- [📚 Stack & Architecture](./docs/stack.md) - Technology overview and project structure
- [🚀 Local Development](./docs/local-development.md) - Commands, workflow, and environment setup
- [🔐 Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [👥 Contributing](./CONTRIBUTING.md) - Contribution guidelines
- [🛡️ Security](./SECURITY.md) - Security policies and reporting

### Development Guides

- [🎨 Frontend Guide](./docs/frontend.md) - Next.js patterns, components, and data fetching
- [🗄️ Sanity Backend](./docs/sanity-backend.md) - Schemas, GROQ queries, and Studio development
- [⚡ Performance](./docs/performance.md) - Optimization techniques and best practices
- [📊 Observability](./docs/observability.md) - OpenTelemetry integration and tracing
- [🔄 Process Management](./docs/process-management.md) - Dev server orchestration

### Support & Tools

- [🔧 Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions
- [🪝 Claude Hooks Guide](./docs/claude-hooks.md) - AI assistant integration
- [🤖 Claude Commands](./.claude/commands/README.md) - Automated development tasks
- [📋 Requirements Tracking](./requirements/) - Feature development specifications

## Key Commands

```bash
# Development
pnpm dev                    # Start all apps using Turbo
pnpm start                  # Start with automatic port cleanup
pnpm start:quiet           # Start with streamlined output
pnpm dev:web               # Start just the web app
pnpm dev:studio            # Start just Sanity Studio
pnpm dev:storybook         # Start just Storybook
pnpm stop                  # Stop all development servers
pnpm stop:ports            # Stop by killing specific ports

# Code Quality
pnpm lint                  # Run ESLint across all packages
pnpm format               # Format with Prettier
pnpm check-types          # TypeScript type checking
pnpm build                # Build all packages

# Testing
pnpm test                  # Run all unit tests
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Generate coverage reports
pnpm test:e2e             # Run Playwright E2E tests
pnpm --filter=@repo/e2e test:ui  # E2E tests with UI

# Sanity-specific
cd apps/studio && pnpm run type     # Generate TypeScript types
cd apps/studio && npx sanity deploy # Deploy Studio to production
cd apps/studio && npx sanity dataset:export  # Export dataset
```

## Environment Configuration

### Required Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-token       # For server-side queries
AXIOM_TOKEN=your-axiom-token           # Optional: For observability
AXIOM_DATASET=your-dataset             # Optional: For observability

# apps/studio/.env.local
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000  # For visual editing
```

## Development Workflow

### Standard Development Flow

1. **Start Services**: Use `pnpm start` for coordinated startup
2. **Make Changes**: Hot reload works across all services
3. **Type Safety**: Run `pnpm check-types` before committing
4. **Code Quality**: Run `pnpm format` and `pnpm lint`
5. **Test Changes**: Run `pnpm test` for unit tests
6. **Update Types**: After schema changes, regenerate types
7. **Component Development**: Use Storybook for isolated development

### Data Flow Architecture

```
Sanity Studio → Schema Definition → Type Generation → Next.js App
     ↓                                                    ↓
   Content                                          Type-safe Queries
     ↓                                                    ↓
   CDN/API ← ← ← ← GROQ Queries ← ← ← ← ← ← ← sanityFetch()
```

## Architectural Patterns

### Component Organization

- **Server Components First**: Default to RSC in Next.js 15
- **Client Components**: Explicitly marked with "use client"
- **Shared UI Library**: Reusable components in `@workspace/ui`
- **Component Variants**: Using CVA (class-variance-authority)

### Data Fetching Patterns

- **Server-side**: Direct `sanityFetch` in server components
- **Client-side**: Live preview with `SanityLive` component
- **Caching**: Next.js cache with appropriate tags
- **Tracing**: All queries wrapped with OpenTelemetry

### Code Conventions

- **File Naming**: kebab-case (`blog-card.tsx`)
- **Component Naming**: PascalCase (`BlogCard`)
- **Function Naming**: camelCase (`createSlug`)
- **Type Imports**: Use `type` keyword for type-only imports
- **Exports**: Prefer named exports over default

## Important Reminders

### Critical for CI/CD Success

- **pnpm Lock Files**: **ALWAYS** commit `pnpm-lock.yaml` when adding dependencies. CI/CD will fail without it!
- **Environment Variables**: Use TurboRepo's env configuration for proper variable passthrough
- **Type Generation**: Run type generation after any Sanity schema changes

### Process Management

- **Native Turbo**: All dev commands use Turbo's built-in parallel execution
- **Simple Scripts**: Direct commands without wrapper scripts
- **Automatic Cleanup**: `pnpm start` handles port cleanup automatically
- **Clean Shutdown**: Ctrl+C properly stops all services

### Performance Considerations

- **TurboRepo Caching**: Leverages smart caching for fast rebuilds
- **Selective Builds**: Use `--filter` flag for targeted operations
- **OpenTelemetry**: Instrumentation ready but off by default in development

## Testing Strategy

### Unit Testing (Vitest)

- Co-located test files (`*.test.ts`, `*.test.tsx`)
- Mocking with `vi.mock()` for external dependencies
- Test utilities from `@workspace/test-utils`

### E2E Testing (Playwright)

- Critical user paths in `packages/e2e/tests/`
- Authentication helpers for protected routes
- Visual regression testing capabilities

### CI Parity Testing

- Ensures local and CI environments match
- Tests in `packages/test-utils/src/ci/`

## Troubleshooting Quick Reference

### Common Issues

1. **Port Conflicts**: Process manager handles automatically
2. **Type Errors**: Run `pnpm check-types` and regenerate if needed
3. **Missing Dependencies**: Check `pnpm-lock.yaml` is committed
4. **Stale Cache**: Clear with `pnpm turbo run build --force`

### Debug Commands

```bash
LOG_LEVEL=debug pnpm dev          # Enable debug logging
pnpm why <package-name>           # Check dependency tree
pnpm ls --depth=0                 # List direct dependencies
turbo run build --dry-run         # Preview build plan
```

## Next Steps

- Review package-specific CLAUDE.md files for detailed context
- Check `/docs/` for in-depth guides on specific topics
- Use Claude commands in `.claude/commands/` for automation
- Explore Storybook at http://localhost:6006 for component library

Remember: This is a living document. Update it when architectural decisions change!
