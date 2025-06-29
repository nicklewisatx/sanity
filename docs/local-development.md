# Local Development Guide

This guide covers day-to-day development commands and workflows for working with the monorepo.

## Prerequisites

- Node.js 18+
- pnpm 8+
- Git

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev
```

## Development Commands

### Running Applications

```bash
# Run both web and studio in parallel (recommended)
pnpm dev

# Run specific app
pnpm dev --filter=web        # Next.js app only
pnpm dev --filter=studio     # Sanity Studio only

# Run with specific options
pnpm --filter=web dev -- --port 3001  # Custom port
```

### Building & Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=web
pnpm build --filter=studio

# Preview production build
pnpm --filter=web start
```

### Code Quality

```bash
# Type checking
pnpm run check-types        # Check all apps
pnpm --filter=web typecheck # Check specific app

# Linting
pnpm lint                   # Lint all code
pnpm lint:fix              # Auto-fix issues

# Formatting
pnpm format                # Format all code
pnpm format:check          # Check formatting
```

### Sanity-Specific Commands

```bash
# Generate TypeScript types from Sanity schemas
cd apps/studio
pnpm run type

# Deploy Sanity Studio
cd apps/studio
npx sanity deploy

# Run Sanity CLI commands
cd apps/studio
npx sanity [command]
```

## Development Workflow

### 1. Starting Development

```bash
# 1. Start dev servers
pnpm dev

# 2. Open in browser
# Web app: http://localhost:3000
# Studio: http://localhost:3333
```

### 2. Making Changes

1. **Frontend Changes**: Edit files in `apps/web/src`
   - Hot reload works automatically
   - Server components refresh on save

2. **Studio Changes**: Edit schemas in `apps/studio/schemaTypes`
   - Run `pnpm run type` after schema changes
   - Restart dev server if needed

3. **Shared UI**: Edit components in `packages/ui/src`
   - Changes reflect in all consuming apps

### 3. Before Committing

```bash
# 1. Run type checks
pnpm run check-types

# 2. Run linter
pnpm lint:fix

# 3. Format code
pnpm format

# 4. Run any tests (if applicable)
pnpm test
```

## Environment Setup

### Required Environment Variables

Create `.env.local` files in each app:

#### apps/web/.env.local

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
```

#### apps/studio/.env.local

```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_TITLE="Your Site Title"
SANITY_STUDIO_PRESENTATION_URL=http://localhost:3000
```

## Working with TurboRepo

### Cache Management

```bash
# Clear TurboRepo cache
pnpm turbo prune

# Run without cache
pnpm build --force
```

### Filtering Tasks

```bash
# Run command for specific package
pnpm --filter=packagename command

# Run for all packages matching pattern
pnpm --filter="./apps/*" build

# Run excluding packages
pnpm --filter="!studio" dev
```

## Tips for Efficient Development

1. **Use Split Terminal**: Run `pnpm dev` in one terminal, keep another for running commands

2. **Watch Mode**: Most commands support watch mode

   ```bash
   pnpm --filter=web typecheck --watch
   ```

3. **Selective Builds**: Only build what changed

   ```bash
   pnpm build --filter=web...
   ```

4. **Debug Mode**: Enable debug logging

   ```bash
   DEBUG=* pnpm dev
   ```

5. **Clean Install**: When dependencies act up
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

## Port Reference

- Next.js Web: `http://localhost:3000`
- Sanity Studio: `http://localhost:3333`
- Studio Vision Plugin: `http://localhost:3333/vision`
