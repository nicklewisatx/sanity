#!/bin/bash
set -e

# Extract file path from Claude Code context
FILE_PATH="$CLAUDE_FILE_PATH"

# Security: Validate path is within project
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
REAL_PATH=$(realpath "$FILE_PATH" 2>/dev/null || echo "")

if [[ ! "$REAL_PATH" =~ ^"$PROJECT_ROOT" ]]; then
    echo "Security: File path outside project boundary"
    exit 1
fi

# Only process TypeScript/JavaScript files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

# Detect which workspace the file belongs to
WORKSPACE=""
if [[ "$FILE_PATH" =~ apps/web/ ]]; then
    WORKSPACE="@sanity/web"
elif [[ "$FILE_PATH" =~ apps/studio/ ]]; then
    WORKSPACE="@sanity/studio"
elif [[ "$FILE_PATH" =~ packages/ ]]; then
    WORKSPACE=$(cd "$PROJECT_ROOT" && pnpm list --depth=-1 --json | jq -r ".[] | select(.path | contains(\"$(dirname "$FILE_PATH")\")) | .name")
fi

# Run checks with timeout
timeout 2s bash -c "
    # 1. Format check (non-blocking)
    pnpm exec prettier --check \"$FILE_PATH\" 2>/dev/null || {
        echo \"🔧 Auto-formatting $FILE_PATH...\"
        pnpm exec prettier --write \"$FILE_PATH\"
    }
    
    # 2. Essential lint rules only
    if [ -n \"$WORKSPACE\" ]; then
        pnpm --filter=\"$WORKSPACE\" exec eslint \"$FILE_PATH\" \
            --rule 'no-unused-vars: error' \
            --rule 'no-undef: error' \
            --rule 'prefer-const: warn' \
            --rule 'no-explicit-any: warn' \
            --no-eslintrc 2>&1 | grep -E '(error|warning)' || true
    fi
" || {
    echo "⚠️  Checks timed out - proceeding anyway"
}