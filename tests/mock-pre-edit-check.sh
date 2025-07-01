#!/bin/bash
# Mock version of pre-edit-check.sh for testing
set -e

FILE_PATH="$CLAUDE_FILE_PATH"
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
REAL_PATH=$(realpath "$FILE_PATH" 2>/dev/null || echo "")

# Security check
if [[ ! "$REAL_PATH" =~ ^"$PROJECT_ROOT" ]]; then
    echo "Security: File path outside project boundary"
    exit 1
fi

# File type check
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

# Simulate different behaviors based on file name
if [[ "$FILE_PATH" =~ "bad-format.ts" ]]; then
    echo "🔧 Auto-formatting $FILE_PATH..."
    exit 0
elif [[ "$FILE_PATH" =~ "unused-vars.ts" ]]; then
    echo "  4:7  error  'unusedVariable' is defined but never used  no-unused-vars"
    echo "  5:5  error  'anotherUnused' is defined but never used   no-unused-vars"
    exit 1
elif [[ "$FILE_PATH" =~ "good-code.ts" ]]; then
    # Clean file, no output
    exit 0
fi

exit 0