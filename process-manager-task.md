# Process Manager Refactoring Task

## Current State Analysis

### Problem: Over-engineered Process Management

The current setup has evolved into a complex custom process management system with multiple layers:

```
scripts/
├── dev.js                    # Multiple dev entry points
├── dev-simple.js            
├── dev-clean.js             
├── dev-claude.js            
├── process-manager/         # Full custom process manager v1
│   ├── ProcessManager.js
│   ├── services/
│   └── utils/
├── process-manager/v2/      # Another process manager version
├── start-background.js
├── stop.js
└── stop-all.js
```

### How Modern Monorepos Handle This

Most TurboRepo projects use a much simpler approach:

1. **TurboRepo handles orchestration** - `turbo run dev` runs all dev tasks in parallel
2. **No custom process managers** - Let the tools do their job
3. **Simple cleanup** - If needed, a single pre-dev script
4. **Standard npm scripts** - Just `pnpm dev` at the root

Examples from popular projects:
- **Vercel Commerce**: Just uses `turbo dev`
- **T3 Stack**: Simple `turbo dev` with no custom scripts
- **Cal.com**: Uses `turbo dev` with minimal wrapper

## Proposed Solution

### 1. Remove All Custom Process Management

Delete these files:
- All `dev-*.js` scripts
- Entire `process-manager/` directory
- `start-background.js`
- Keep only `stop.js` (simplified)

### 2. Update Root package.json

```json
{
  "scripts": {
    "dev": "pnpm stop && turbo dev",
    "dev:web": "turbo dev --filter=web",
    "dev:studio": "turbo dev --filter=studio", 
    "dev:storybook": "turbo dev --filter=@workspace/ui",
    "stop": "node scripts/stop.js"
  }
}
```

### 3. Simplify stop.js

```javascript
#!/usr/bin/env node
// Simple port cleanup - that's all we need
const { execSync } = require('child_process');

const ports = [3000, 3333, 6006];
ports.forEach(port => {
  try {
    execSync(`kill-port ${port}`, { stdio: 'ignore' });
  } catch {}
});
```

### 4. Let TurboRepo Handle Everything

TurboRepo already provides:
- Parallel execution
- Smart caching
- Process management
- Graceful shutdown
- Log streaming
- Error handling

## Benefits

1. **Simplicity** - Remove 90% of custom code
2. **Maintainability** - Use standard tools
3. **Performance** - TurboRepo is optimized for this
4. **Developer Experience** - Just `pnpm dev` like every other project
5. **Less Bugs** - No custom process management to debug

## Implementation Steps

1. **Test current turbo dev** - Verify it works without wrappers
2. **Update package.json** - Point dev to turbo
3. **Delete custom scripts** - Remove all process management code
4. **Update documentation** - Simplify README and CLAUDE.md
5. **Test everything** - Ensure dev workflow still works

## Notes for Claude Code Users

The current `dev:claude` script with rate-limited output can be replaced with:
- Use `turbo dev --concurrency=1` for sequential output
- Or pipe through a simple rate limiter if really needed
- But honestly, modern terminals handle concurrent output fine

## Decision

This aligns with the "zen:challenge" and "zen:refactor" approach - challenging the assumption that we need custom process management and refactoring to the simplest solution that works.