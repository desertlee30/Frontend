#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Synchronizing users.json files...${NC}"

# Define file paths
BACKEND_DIR="backend"
DATA_DIR="$BACKEND_DIR/data"
USERS_JSON="$DATA_DIR/users.json"

# Check if files exist
if [ ! -f "$USERS_JSON" ]; then
  echo -e "${RED}Error: $USERS_JSON does not exist in the local directory.${NC}"
  exit 1
fi

# Display current users in the file
echo -e "${YELLOW}Current users in local users.json:${NC}"
cat "$USERS_JSON" | grep -E '"email":|"firstName":|"lastName":|"id":' | sed 's/"password": "[^"]*",//g'
echo ""

# Stop the server to prevent write conflicts
echo -e "${YELLOW}Stopping server if running...${NC}"
kill $(cat server.pid 2>/dev/null) >/dev/null 2>&1 || true
sleep 1

# Make a backup of the current file
echo -e "${YELLOW}Making backup of users.json...${NC}"
cp "$USERS_JSON" "$USERS_JSON.backup"
echo -e "${GREEN}Backup saved to $USERS_JSON.backup${NC}"

# Restart the server
echo -e "${YELLOW}Restarting server...${NC}"
./start-server.sh

echo -e "${GREEN}Synchronization complete!${NC}"
echo -e "${YELLOW}To view users, open the Admin Debug panel in your browser and click 'Fetch Users'.${NC}" 