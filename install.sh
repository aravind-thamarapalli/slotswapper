#!/bin/bash

# Adobe Slot Swap - Installation Script
# This script sets up the project with WebSocket and Docker support

set -e

echo "🚀 Adobe Slot Swap - Installation Script"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
check_docker() {
    echo -e "${BLUE}📦 Checking Docker installation...${NC}"
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        echo "Please install Docker from https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is installed: $(docker --version)${NC}"
}

# Check if Docker Compose is installed
check_docker_compose() {
    echo -e "${BLUE}📦 Checking Docker Compose installation...${NC}"
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker Compose is installed: $(docker-compose --version)${NC}"
}

# Check if Node.js is installed
check_node() {
    echo -e "${BLUE}📦 Checking Node.js installation...${NC}"
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}⚠️  Node.js is not installed (needed for local development)${NC}"
        echo "Download from https://nodejs.org/"
    else
        echo -e "${GREEN}✅ Node.js is installed: $(node --version)${NC}"
    fi
}

# Create .env file if it doesn't exist
setup_env() {
    echo -e "${BLUE}🔧 Setting up environment configuration...${NC}"
    
    if [ ! -f "backend/.env" ]; then
        echo -e "${YELLOW}Creating backend/.env...${NC}"
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ backend/.env created${NC}"
        echo -e "${YELLOW}⚠️  Please update backend/.env with your configuration!${NC}"
    else
        echo -e "${GREEN}✅ backend/.env already exists${NC}"
    fi
}

# Build Docker images
build_images() {
    echo ""
    echo -e "${BLUE}🔨 Building Docker images...${NC}"
    echo "This may take a few minutes..."
    
    if docker-compose build; then
        echo -e "${GREEN}✅ Docker images built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build Docker images${NC}"
        exit 1
    fi
}

# Start services
start_services() {
    echo ""
    echo -e "${BLUE}🚀 Starting services with Docker Compose...${NC}"
    
    if docker-compose up -d; then
        echo -e "${GREEN}✅ Services started${NC}"
    else
        echo -e "${RED}❌ Failed to start services${NC}"
        exit 1
    fi
}

# Check service status
check_status() {
    echo ""
    echo -e "${BLUE}📊 Checking service status...${NC}"
    docker-compose ps
    
    echo ""
    echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
    sleep 5
}

# Display access information
show_access_info() {
    echo ""
    echo -e "${GREEN}✅ Installation Complete!${NC}"
    echo ""
    echo -e "${BLUE}Access the application:${NC}"
    echo "  Frontend:  ${YELLOW}http://localhost:3000${NC}"
    echo "  Backend:   ${YELLOW}http://localhost:5000/api${NC}"
    echo "  WebSocket: ${YELLOW}ws://localhost:5000${NC}"
    echo "  MongoDB:   ${YELLOW}mongodb://admin:password@localhost:27017/adobe_db${NC}"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "  View logs:     ${YELLOW}docker-compose logs -f${NC}"
    echo "  Stop services: ${YELLOW}docker-compose down${NC}"
    echo "  View status:   ${YELLOW}docker-compose ps${NC}"
    echo "  Execute cmd:   ${YELLOW}docker-compose exec backend npm list${NC}"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "  Setup Guide:        ${YELLOW}DOCKER_WEBSOCKET_SETUP.md${NC}"
    echo "  Implementation:     ${YELLOW}IMPLEMENTATION_COMPLETE.md${NC}"
    echo "  Summary:            ${YELLOW}WEBSOCKET_DOCKER_COMPLETE.md${NC}"
}

# Local development setup (optional)
setup_local_dev() {
    echo ""
    read -p "Do you want to install dependencies for local development? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
        cd backend && npm install && cd ..
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
        
        echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
        cd frontend && npm install && cd ..
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    fi
}

# Main installation flow
main() {
    echo ""
    
    # System checks
    check_docker
    check_docker_compose
    check_node
    
    echo ""
    
    # Setup
    setup_env
    
    echo ""
    read -p "Do you want to build Docker images now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_images
        
        echo ""
        read -p "Do you want to start services now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_services
            check_status
        fi
    fi
    
    # Optional local development setup
    setup_local_dev
    
    # Display information
    show_access_info
}

# Run main installation
main
