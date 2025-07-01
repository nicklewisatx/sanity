#!/bin/bash
# Incremental TypeScript checking for modified files only
FILE_PATH="$1"
PROJECT_ROOT=$(git rev-parse --show-toplevel)

# Use TypeScript's incremental build
cd "$PROJECT_ROOT"
tsc --incremental --noEmit --skipLibCheck --tsBuildInfoFile .claude-tsc-cache.json \
    --include "$FILE_PATH" 2>&1 | head -20