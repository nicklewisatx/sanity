#!/bin/bash
# Test runner for Claude Code hooks

echo "🧪 Running Claude Code Hook Tests"
echo "================================="

# Activate virtual environment
source venv/bin/activate

# Run pytest with verbose output
pytest test_hooks_integration.py -v --tb=short

# Deactivate virtual environment
deactivate

echo ""
echo "✅ Test run complete!"