# Scripts Directory

This directory contains utility scripts for development and CI/CD tasks.

## Current Scripts

### Development Support

- **`test-ci-parity.ts`** - Ensures local and CI environments match
  - Used by `pnpm ci-parity` command
  - Runs before tests to validate environment consistency

### Claude Hooks

- **`claude-hooks/`** - AI assistant integration
  - Automatic formatting and linting on file edits
  - Helps maintain code quality during AI-assisted development

## Process Management

We've simplified process management to use Turbo's native capabilities:

```bash
# Start all services
pnpm dev              # Uses turbo run dev --parallel

# Start individual services  
pnpm dev:web          # turbo run dev --filter=web
pnpm dev:studio       # turbo run dev --filter=studio
pnpm dev:storybook    # turbo run dev --filter=@workspace/ui

# Stop services
pnpm stop             # pkill -f 'next-server|sanity dev|storybook'
pnpm stop:ports       # npx kill-port 3000 3333 6006
```

## Design Philosophy

- **Native Tools**: Use Turbo's built-in orchestration
- **Simple Scripts**: Direct commands, no wrapper complexity
- **Standard Patterns**: Follow Turbo/monorepo best practices
- **Minimal Dependencies**: Reduce external tool requirements

## Migration Notes

We've removed custom process management scripts in favor of:
- Turbo's `--parallel` flag for concurrent execution
- Turbo's `--filter` flag for selective service starting
- Native `pkill` for process cleanup
- Direct npm scripts without Node.js wrappers

This reduces complexity from ~200 lines of custom code to ~10 lines of standard commands.