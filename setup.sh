#!/bin/bash

# Colors
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'

echo -e "${YELLOW}QuickNotes - Initial Setup${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${YELLOW}! .env file already exists, skipping${NC}"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env file${NC}"
else
    echo -e "${YELLOW}! frontend/.env file already exists, skipping${NC}"
fi

# Generate a random JWT secret
if [ "$(uname)" == "Darwin" ] || [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    # Update .env file with random JWT secret
    if [ -f .env ]; then
        sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env && rm .env.bak
        echo -e "${GREEN}✓ Generated random JWT secret${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review and update .env file with your configuration"
echo "  2. Start the application:"
echo -e "     ${GREEN}docker-compose up${NC}"
echo ""
echo "  Or use Make commands:"
echo -e "     ${GREEN}make start${NC}   - Start in production mode"
echo -e "     ${GREEN}make dev${NC}     - Start in development mode"
echo -e "     ${GREEN}make logs${NC}    - View logs"
echo -e "     ${GREEN}make stop${NC}    - Stop all services"
echo ""
echo -e "Once started, access the application at: ${GREEN}http://localhost${NC}"
echo ""
