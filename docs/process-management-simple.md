# Simplified Process Management

This document describes the new simplified process management approach for the monorepo, replacing the complex custom ProcessManager with industry-standard tools.

## Overview

The new approach uses:
- **concurrently** - For running multiple processes in parallel
- **kill-port** - For cleaning up ports before starting
- **wait-on** - For health checks (if needed)

## Available Commands

### Basic Development
```bash
# Start all services
pnpm dev

# Start specific services
pnpm dev:web        # Just the web app
pnpm dev:studio     # Just Sanity Studio
pnpm dev:storybook  # Just Storybook
```

### Clean Start (Recommended)
```bash
# Kills any processes on required ports before starting
pnpm start
```

### Claude Code Optimized
```bash
# Rate-limited output to prevent terminal overload
pnpm start:claude
```

### Stop All Services
```bash
# Kills processes on all development ports
pnpm stop
```

## Service Configuration

| Service    | Port | Command                          |
|------------|------|----------------------------------|
| Web        | 3000 | `pnpm --filter=web dev`         |
| Studio     | 3333 | `pnpm --filter=studio dev`      |
| Storybook  | 6006 | `pnpm --filter=@workspace/ui storybook` |

## Implementation Details

### dev-simple.js
- Uses `concurrently` with `--kill-others` flag
- Color-coded output for each service
- Graceful shutdown on Ctrl+C

### dev-clean.js
- Runs `kill-port` on all required ports first
- Then executes `dev-simple.js`
- Ensures clean start without port conflicts

### dev-claude.js
- Buffers output to prevent terminal overload
- Rate-limits log output (20 lines every 500ms)
- Extended timeouts for slower operations
- Designed specifically for Claude Code environment

### stop.js
- Simple script to kill processes on all dev ports
- Uses `kill-port` package
- No complex state management needed

## Key Improvements

1. **Simplicity**: No custom process manager, PID files, or state management
2. **Industry Standards**: Uses well-maintained npm packages
3. **Reliability**: Leverages battle-tested tools like `concurrently`
4. **Maintainability**: Simple scripts that are easy to understand and modify
5. **Port Management**: Clean handling of port conflicts
6. **Claude Compatibility**: Special mode to prevent terminal overload

## Migration from Old System

The old ProcessManager system can be safely removed:
- `/scripts/process-manager/` directory
- `/scripts/claude-safe-wrapper.js`
- `/scripts/start-background.js`
- `/scripts/stop-all.js`
- `.turbo-pids/` directory (no longer needed)
- `.turbo-state.json` file (no longer needed)

## Troubleshooting

### Port Already in Use
Run `pnpm stop` or `pnpm start` (which includes automatic cleanup)

### Service Won't Start
Check the individual service logs or run services separately:
```bash
pnpm dev:web
pnpm dev:studio
pnpm dev:storybook
```

### Claude Code Issues
Use `pnpm start:claude` for rate-limited output

## Future Enhancements

If needed, we can add:
- `wait-on` for health checks before dependent services
- Environment-specific configurations
- Custom port configuration via environment variables
- Integration with TurboRepo's built-in dev command