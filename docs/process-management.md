# Process Management

Simplified development server orchestration using Turbo's native capabilities.

## Overview

The project uses TurboRepo's built-in task orchestration for running multiple development servers in parallel. This provides a simple, maintainable solution using standard monorepo patterns.

## Architecture

```
Root package.json scripts:
├── dev              # turbo run dev --parallel
├── dev:web          # turbo run dev --filter=web
├── dev:studio       # turbo run dev --filter=studio
├── dev:storybook    # turbo run dev --filter=@workspace/ui
├── start            # pnpm stop && pnpm dev
├── start:quiet      # turbo run dev --parallel --log-order=stream
├── stop             # pkill -f 'next-server|sanity dev|storybook'
└── stop:ports       # npx kill-port 3000 3333 6006
```

## How It Works

### Starting Services

```bash
pnpm dev              # Start all services in parallel
pnpm dev:web          # Start just web app
pnpm dev:studio       # Start just Sanity Studio
pnpm dev:storybook    # Start just Storybook
```

The system:
1. Uses Turbo's `--parallel` flag to run all dev tasks concurrently
2. Leverages Turbo's dependency graph for proper startup order
3. Shows unified output with service prefixes
4. Handles Ctrl+C gracefully to stop all services

### Stopping Services

```bash
pnpm stop             # Kill processes by name pattern
pnpm stop:ports       # Kill processes by port number
```

Two approaches for flexibility:
- `pkill` pattern matching for quick cleanup
- Port-based killing as a fallback option

### Quiet Mode

```bash
pnpm start:quiet
```

Uses `--log-order=stream` for cleaner, sequential output that's easier to read in terminals with limited scrollback.

## Service Configuration

| Service | Port | Package | Command |
|---------|------|---------|---------|
| Web | 3000 | apps/web | `next dev --turbopack` |
| Studio | 3333 | apps/studio | `sanity dev` |
| Storybook | 6006 | packages/ui | `storybook dev -p 6006` |

## Benefits of Turbo Approach

1. **Native Monorepo Support**: Built for this use case
2. **Dependency Awareness**: Respects task dependencies
3. **Intelligent Caching**: Skips unnecessary work
4. **Unified Configuration**: All in turbo.json
5. **Standard Patterns**: Familiar to any Turbo user

## Migration from Custom Scripts

We've replaced ~200 lines of custom Node.js process management with ~10 lines of standard npm scripts:

**Before**: Custom scripts → concurrently → services  
**After**: npm script → turbo → services

This reduces complexity, improves maintainability, and follows established patterns.

## Troubleshooting

### Port Already in Use

```bash
pnpm stop:ports       # Kill specific ports
pnpm start           # Auto-cleanup before starting
```

### Process Won't Stop

```bash
# Nuclear option - kills all Node processes
pkill -f node
```

### Individual Service Issues

```bash
# Check individual service logs
pnpm dev:web --log-order=stream
```

## Best Practices

1. Use `pnpm start` for a clean startup (includes automatic cleanup)
2. Use `pnpm dev` for quick restarts during development
3. Use individual service commands when debugging specific issues
4. Let Turbo handle the orchestration complexity