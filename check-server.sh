#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "========================================="
echo -e "${YELLOW}Checking backend server status...${NC}"
echo "========================================="

# Check if server is running on port 3000
if netstat -tuln | grep -q ":3000"; then
  echo -e "${GREEN}✓ Server is running on port 3000${NC}"
else
  echo -e "${RED}✗ Server is NOT running on port 3000${NC}"
  echo -e "${YELLOW}Try running ./start-server.sh${NC}"
fi

# Try to access the server API endpoint
echo -e "\nTesting API endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://20.2.210.82:3000/api/recipes)

if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✓ API endpoint is accessible (HTTP 200)${NC}"
else
  echo -e "${RED}✗ API endpoint returned HTTP $RESPONSE${NC}"
  echo -e "${YELLOW}Make sure the server is running and routes are set up correctly${NC}"
fi

echo -e "\nChecking server logs (last 10 lines):"
echo -e "${YELLOW}-------------------------------------${NC}"
tail -n 10 backend/server.log 2>/dev/null || echo -e "${RED}No server log file found${NC}"
echo -e "${YELLOW}-------------------------------------${NC}"

echo -e "\n${YELLOW}If you need to start the server, run:${NC}"
echo -e "./start-server.sh"

echo -e "\n${YELLOW}If you need to restart the server, run:${NC}"
echo -e "pkill -f 'node server.js' && ./start-server.sh" 