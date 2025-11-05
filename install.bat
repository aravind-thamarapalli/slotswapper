@echo off
REM Adobe Slot Swap - Installation Script for Windows
REM This script sets up the project with WebSocket and Docker support

setlocal enabledelayedexpansion

echo.
echo 🚀 Adobe Slot Swap - Installation Script (Windows)
echo ================================================
echo.

REM Color codes (limited in Windows batch)
set "GREEN=[32m"
set "YELLOW=[33m"
set "BLUE=[34m"
set "RED=[31m"
set "NC=[0m"

REM Check if Docker is installed
echo Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✅ Docker is installed
docker --version

REM Check if Docker Compose is installed
echo.
echo Checking Docker Compose installation...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed or not in PATH
    echo Please install Docker Compose or update Docker Desktop
    pause
    exit /b 1
)
echo ✅ Docker Compose is installed
docker-compose --version

REM Check if Node.js is installed
echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Node.js is not installed (needed for local development)
    echo Download from https://nodejs.org/
) else (
    echo ✅ Node.js is installed
    node --version
)

REM Setup .env file
echo.
echo Setting up environment configuration...
if not exist "backend\.env" (
    echo Creating backend\.env...
    copy backend\.env.example backend\.env >nul
    echo ✅ backend\.env created
    echo ⚠️  Please update backend\.env with your configuration!
) else (
    echo ✅ backend\.env already exists
)

REM Ask to build images
echo.
set /p build_choice="Do you want to build Docker images now? (y/n) "
if /i "%build_choice%"=="y" (
    echo.
    echo Building Docker images...
    echo This may take a few minutes...
    docker-compose build
    if errorlevel 1 (
        echo ❌ Failed to build Docker images
        pause
        exit /b 1
    )
    echo ✅ Docker images built successfully
    
    REM Ask to start services
    echo.
    set /p start_choice="Do you want to start services now? (y/n) "
    if /i "%start_choice%"=="y" (
        echo.
        echo Starting services with Docker Compose...
        docker-compose up -d
        if errorlevel 1 (
            echo ❌ Failed to start services
            pause
            exit /b 1
        )
        echo ✅ Services started
        
        echo.
        echo Checking service status...
        timeout /t 5 /nobreak
        docker-compose ps
    )
)

REM Ask for local development setup
echo.
set /p local_choice="Do you want to install dependencies for local development? (y/n) "
if /i "%local_choice%"=="y" (
    echo.
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
    
    echo.
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo ✅ Frontend dependencies installed
)

REM Display access information
echo.
echo ================================================
echo ✅ Installation Complete!
echo ================================================
echo.
echo Access the application:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000/api
echo   WebSocket: ws://localhost:5000
echo   MongoDB:   mongodb://admin:password@localhost:27017/adobe_db
echo.
echo Useful Commands:
echo   View logs:     docker-compose logs -f
echo   Stop services: docker-compose down
echo   View status:   docker-compose ps
echo   Execute cmd:   docker-compose exec backend npm list
echo.
echo Documentation:
echo   Setup Guide:        DOCKER_WEBSOCKET_SETUP.md
echo   Implementation:     IMPLEMENTATION_COMPLETE.md
echo   Summary:            WEBSOCKET_DOCKER_COMPLETE.md
echo.
pause
