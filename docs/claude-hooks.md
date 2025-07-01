# Claude Code Hooks Guide

## Overview

This project includes TypeScript hooks that provide automatic validation and formatting when using Claude Code. These hooks help prevent common bugs and maintain code quality without disrupting your workflow.

**Last Updated by Claude:** 2025-07-01

## Features

### 🔧 Automatic Formatting

- Prettier runs automatically on TypeScript/JavaScript files before edits
- Ensures consistent code style across the project
- Non-blocking: formatting failures don't prevent edits

### ⚡ Essential Linting

- Catches critical errors before they're committed:
  - `no-unused-vars`: Detects unused variables
  - `no-undef`: Catches undefined variable usage
  - `prefer-const`: Suggests const for unchanging variables
  - `no-explicit-any`: Warns about TypeScript any usage

### 🚀 Performance Optimized

- 2-second timeout ensures no workflow interruptions
- Workspace-aware: uses pnpm filters for monorepo efficiency
- Incremental TypeScript checking (when enabled)
- Caching for repeated operations

### 🔒 Security

- Path validation ensures edits stay within project boundaries
- No execution of arbitrary code from file contents
- Scripts run with standard user permissions

## Configuration

The hooks are configured in two places:

### 1. Hook Registration (`.claude/hooks.json`)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "^(Edit|MultiEdit|Write)$",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/claude-hooks/pre-edit-check.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "^(Edit|MultiEdit|Write)$",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/claude-hooks/post-edit-log.sh"
          }
        ]
      }
    ]
  }
}
```

### 2. Hook Settings (`.claude/config.json`)

```json
{
  "hooks": {
    "typescript": {
      "enableFormatting": true, // Enable Prettier formatting
      "enableLinting": true, // Enable ESLint checks
      "enableTypeChecking": false, // Enable TypeScript checking (opt-in)
      "lintRules": [
        // Essential lint rules
        "no-unused-vars",
        "no-undef",
        "prefer-const"
      ],
      "timeout": 2000 // Max execution time (ms)
    }
  }
}
```

## How It Works

1. **Pre-Edit Hook**: Before Claude Code edits a TypeScript/JavaScript file:
   - Validates the file path is within project boundaries
   - Runs Prettier to check formatting (auto-fixes if needed)
   - Runs essential ESLint rules for the specific workspace
   - All checks complete within 2 seconds or timeout gracefully

2. **Post-Edit Hook**: After edits complete:
   - Logs completion for tracking
   - Reports any new issues introduced

3. **Workspace Detection**: The hooks automatically detect which workspace a file belongs to:
   - `apps/web/` → `@sanity/web`
   - `apps/studio/` → `@sanity/studio`
   - `packages/*` → Detected via pnpm workspace

## Enabling/Disabling Features

### Disable All Hooks

Remove or rename the `.claude/hooks.json` file.

### Disable Specific Features

Edit `.claude/config.json`:

```json
{
  "hooks": {
    "typescript": {
      "enableFormatting": false, // Disable Prettier
      "enableLinting": false, // Disable ESLint
      "enableTypeChecking": false // Already disabled by default
    }
  }
}
```

### Enable TypeScript Checking

TypeScript checking is disabled by default for performance. To enable:

```json
{
  "hooks": {
    "typescript": {
      "enableTypeChecking": true
    }
  }
}
```

## Troubleshooting

### Hooks Not Running

1. Ensure scripts are executable: `chmod +x scripts/claude-hooks/*.sh`
2. Check Claude Code supports hooks (version requirements)
3. Verify `.claude/hooks.json` exists and is valid JSON

### Performance Issues

1. Disable TypeScript checking if enabled
2. Increase timeout in `.claude/config.json`
3. Check for large files that might slow down processing

### False Positives

1. Customize lint rules in `.claude/config.json`
2. Add ESLint disable comments for specific lines
3. Update Prettier config for formatting preferences

## Script Locations

- **Pre-edit check**: `scripts/claude-hooks/pre-edit-check.sh`
- **Type check**: `scripts/claude-hooks/type-check-incremental.sh`
- **Post-edit log**: `scripts/claude-hooks/post-edit-log.sh`

## Security Notes

- All file paths are validated to be within the project root
- Scripts use `realpath` to resolve symlinks and prevent escapes
- Timeouts prevent resource exhaustion
- No user input is executed as code

## Future Enhancements

- [ ] Add support for other file types (CSS, JSON, etc.)
- [ ] Implement smart caching for faster repeated checks
- [ ] Add hook metrics and performance tracking
- [ ] Support for custom project-specific rules
- [ ] Integration with CI/CD pipeline checks

## Contributing

When modifying hooks:

1. Test with various file types and sizes
2. Ensure timeouts work correctly
3. Verify security constraints are maintained
4. Update this documentation
