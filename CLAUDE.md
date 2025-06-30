# Sanity + Next.js Project Guide

This is a modern monorepo project using Next.js 15, Sanity Studio v3, and TurboRepo.

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

### Support

- [🔧 Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions
- [🤖 Slash Commands](./docs/commands/README.md) - Automated development tasks

## Key Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm dev --filter=web      # Start specific app

# Code Quality
pnpm lint                  # Run linter
pnpm format               # Format code
pnpm check-types          # Type checking

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
4. **Generate Types**: After schema changes, run type generation

## Need Help?

- Check [Troubleshooting Guide](./docs/troubleshooting.md) for common issues
- Use Vision plugin at `/studio/vision` to test GROQ queries
- Enable debug logging with `LOG_LEVEL=debug pnpm dev`
