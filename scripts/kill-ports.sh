#!/bin/bash

# Kill processes on ports 3000 and 3333
echo "Checking for processes on ports 3000 and 3333..."

# Get PIDs of processes on these ports
PIDS=$(lsof -ti:3000,3333 2>/dev/null)

if [ -z "$PIDS" ]; then
  echo "No processes found on ports 3000 or 3333"
else
  echo "Found processes: $PIDS"
  echo "Killing processes..."
  echo $PIDS | xargs kill -9 2>/dev/null
  echo "Processes killed successfully"
fi