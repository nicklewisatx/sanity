#!/bin/bash

# Kill any existing processes on the dev ports
echo "Cleaning up existing processes..."
lsof -ti:3000,3333 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to be released
sleep 2

# Start turbo dev with no-daemon flag to prevent background process issues
echo "Starting development servers..."
exec turbo dev --no-daemon