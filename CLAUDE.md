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
pnpm dev                    # Start all apps in background mode
pnpm watch                  # Start all apps with live console output
pnpm dev --filter=web      # Start only the web app
pnpm dev --filter=studio   # Start only Sanity studio

# Process Management
pnpm kill                  # Kill processes on ports 3000-3004 & 3333
pnpm stop                  # Same as kill - stops all dev processes
pnpm status               # Show running app processes and environment
pnpm restart              # Kill and restart development

# Environment Management
pnpm env:validate         # Validate environment configuration
pnpm env:setup           # Setup environment files interactively

# Code Quality
pnpm lint                  # Run linter
pnpm format               # Format code
pnpm check-types          # Type checking
pnpm validate            # Run lint, type-check, and tests

# Sanity
cd apps/studio && pnpm run type     # Generate types
cd apps/studio && npx sanity deploy # Deploy studio
```

## Process Management

The project uses a TypeScript-based CLI for managing development processes:

- **`pnpm dev`** - Starts development servers in background mode with environment validation
- **`pnpm watch`** - Starts development servers with live console output (use for debugging)
- **`pnpm kill` / `pnpm stop`** - Gracefully terminates all processes with retry logic
- **`pnpm status`** - Shows detailed status including environment, processes, and ports
- **`pnpm restart`** - Cleanly restarts the development environment

### Advanced Options

```bash
# Start specific apps
pnpm dev --filter=web        # Start only Next.js
pnpm dev --filter=studio     # Start only Sanity Studio

# Skip environment checks
pnpm dev --skip-env-check    # Bypass environment validation

# Force kill processes
pnpm kill --force           # Skip graceful shutdown

# Kill specific port
pnpm kill --port 3000       # Kill only port 3000

# Status in JSON format
pnpm status --json          # Machine-readable output
```

## Environment Variables

The project uses centralized environment configuration with validation:

```bash
# Setup environment files
pnpm env:setup              # Create .env.local files from examples

# Validate configuration
pnpm env:validate           # Check all required variables
```

### Required Variables

```bash
# Core Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional but Recommended
SANITY_API_READ_TOKEN=your-token
LOGTAIL_TOKEN=your-logtail-token
```

### Environment Files

- `.env.local` - Root environment (shared across all apps)
- `apps/web/.env.local` - Web app specific
- `apps/studio/.env.local` - Studio specific

Priority: `process.env` > `.env.local` > `.env`

## Development Workflow

1. **Make Changes**: Edit files, hot reload works automatically
2. **Check Types**: Run `pnpm check-types` before committing
3. **Format Code**: Run `pnpm format` to ensure consistency
4. **Generate Types**: After schema changes, run type generation

## Need Help?

- Check [Troubleshooting Guide](./docs/troubleshooting.md) for common issues
- Use Vision plugin at `/studio/vision` to test GROQ queries
- Enable debug logging with `LOG_LEVEL=debug pnpm dev`
