# Scripts Directory

This directory contains development scripts for the monorepo.

## Current Scripts (Simplified Approach)

### Core Development Scripts
- **dev-simple.js** - Basic development server using concurrently
- **dev-clean.js** - Kills ports before starting (recommended)
- **dev-claude.js** - Claude Code optimized with rate-limited output
- **stop.js** - Stops all development servers

### Other Scripts
- **lint-safe.js** - Safe linting wrapper
- **test-safe.js** - Safe testing wrapper
- **test-ci-parity.ts** - CI parity testing

## Legacy Scripts (To Be Removed)

The following can be safely deleted after migration:
- `process-manager/` - Complex custom process management
- `claude-safe-wrapper.js` - No longer needed
- `start-background.js` - Replaced by new scripts
- `stop-all.js` - Replaced by stop.js
- `dev.js` - Replaced by dev-simple.js

## Usage

```bash
# Recommended for development
pnpm start          # Cleans ports and starts all services

# For Claude Code
pnpm start:claude   # Rate-limited output

# Stop everything
pnpm stop
```

## Benefits of New Approach

1. **Simplicity** - Uses industry-standard tools (concurrently, kill-port)
2. **No State Management** - No PID files or state.json
3. **Better Error Handling** - Built into concurrently
4. **Easier Maintenance** - Simple, readable scripts
5. **Claude Compatibility** - Special mode for AI assistants