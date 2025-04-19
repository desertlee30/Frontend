#!/bin/bash

# Change to the backend directory
cd backend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
fi

# Check if server is already running
if pgrep -f "node server.js" > /dev/null; then
  echo "Server is already running. Stopping it first..."
  pkill -f "node server.js"
  sleep 2
fi

# Start the server and log output to server.log
echo "Starting backend server..."
echo "Output is being logged to backend/server.log"
node server.js > server.log 2>&1 &

# Store the process ID
PID=$!
echo $PID > server.pid
echo "Server started with PID: $PID"
echo "To stop the server, run: kill $(cat server.pid)"
echo "To check server status, run: ./check-server.sh" 