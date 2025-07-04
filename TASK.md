# Process Management Refactoring Task

**Date:** 2025-07-04  
**Objective:** Simplify process management to use Turbo's native capabilities

## Current State Analysis

### Problems with Current Setup

1. **Over-engineered**: Custom Node.js scripts wrapping simple commands
2. **Redundant tooling**: Using `concurrently` when Turbo can handle parallel execution
3. **Manual port management**: Custom scripts for killing ports instead of letting services manage themselves
4. **Complex error handling**: Dozens of lines of code for what should be simple commands
5. **Multiple abstraction layers**: Scripts calling scripts calling package commands

### Current Architecture

```
User → npm script → Node.js wrapper → concurrently → pnpm filter → actual service
```

### What We're Using

- `concurrently` for parallel process execution
- `kill-port` for manual port cleanup
- Custom Node.js scripts with complex process management
- Manual SIGINT/SIGTERM handling

## Proposed Solution: Pure Turbo Approach

### New Architecture

```
User → npm script → turbo run → service
```

### Key Principles

1. **Turbo handles orchestration**: Use `turbo run dev` with proper configuration
2. **Services manage their own ports**: No pre-emptive port killing
3. **Simple npm scripts**: Direct commands, no Node.js wrappers
4. **Leverage Turbo features**: Filtering, parallel execution, output control

## Implementation Plan

### Phase 1: Update turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "dev:web": {
      "cache": false,
      "persistent": true
    },
    "dev:studio": {
      "cache": false,
      "persistent": true
    },
    "dev:storybook": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    }
  }
}
```

### Phase 2: Simplify package.json scripts

```json
{
  "scripts": {
    // Main development commands
    "dev": "turbo run dev --parallel",
    "dev:web": "turbo run dev --filter=web",
    "dev:studio": "turbo run dev --filter=studio",
    "dev:storybook": "turbo run dev --filter=@workspace/ui",

    // Start commands (with cleanup)
    "start": "pnpm stop && pnpm dev",
    "start:quiet": "turbo run dev --parallel --log-order=stream",

    // Stop command (simple)
    "stop": "pkill -f 'next-server|sanity dev|storybook' || true",

    // Alternative stop with ports
    "stop:ports": "npx kill-port 3000 3333 6006"
  }
}
```

### Phase 3: Update Individual Package Scripts

#### apps/web/package.json

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev --turbopack"
  }
}
```

#### apps/studio/package.json

```json
{
  "scripts": {
    "dev": "sanity dev",
    "dev:debug": "NODE_OPTIONS='--inspect' sanity dev"
  }
}
```

#### packages/ui/package.json

```json
{
  "scripts": {
    "dev": "storybook dev -p 6006",
    "dev:storybook": "storybook dev -p 6006"
  }
}
```

### Phase 4: Clean Up

**Files to Remove:**

- `/scripts/dev.js`
- `/scripts/dev-claude.js`
- `/scripts/dev-turbo.js`
- `/scripts/stop.js`
- `/scripts/claude-safe-wrapper.js` (if not used elsewhere)
- `/scripts/dev-clean.js`
- `/scripts/dev-simple.js`
- `/scripts/start-background.js`
- `/scripts/stop-all.js`
- All `/scripts/process-manager/` files

**Dependencies to Remove:**

- `concurrently` (unless used elsewhere)
- `kill-port` (unless used elsewhere)

## Benefits

1. **Simpler**: ~200 lines of code reduced to ~10 lines of npm scripts
2. **Faster**: Direct execution without wrapper overhead
3. **Native**: Uses Turbo's built-in features
4. **Maintainable**: Standard patterns any developer knows
5. **Reliable**: Less custom code = fewer bugs

## Migration Steps

1. **Test new scripts alongside old ones**
   - Add new scripts with `:new` suffix
   - Verify they work correctly
   - Get team feedback

2. **Gradual rollout**
   - Update documentation
   - Switch CI/CD to new commands
   - Update developer workflows

3. **Cleanup**
   - Remove old scripts
   - Remove unused dependencies
   - Update CLAUDE.md files

## Risks & Mitigations

1. **Port conflicts**: Services should handle EADDRINUSE gracefully
2. **Output formatting**: Use Turbo's `--log-order` for cleaner output
3. **Process cleanup**: Modern Node.js handles SIGINT well, but test thoroughly

## Success Criteria

- [ ] All services start with `pnpm dev`
- [ ] Individual services can be started
- [ ] Clean shutdown with Ctrl+C
- [ ] No orphaned processes
- [ ] Simpler codebase
- [ ] Faster startup time

## Notes

- Turbo's `--parallel` flag runs all matching tasks concurrently
- `--log-order=stream` provides cleaner output similar to Claude mode
- Modern services (Next.js, Sanity, Storybook) handle ports well
- `pkill` is more reliable than port-based killing for process cleanup
