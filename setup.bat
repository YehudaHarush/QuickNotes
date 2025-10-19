@echo off
setlocal enabledelayedexpansion

echo [93mQuickNotes - Initial Setup[0m
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [91mError: Docker is not installed[0m
    echo Please install Docker Desktop first: https://docs.docker.com/desktop/install/windows-install/
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [91mError: Docker Compose is not installed[0m
    echo Please install Docker Compose first
    exit /b 1
)

echo [92m✓ Docker and Docker Compose are installed[0m

REM Copy environment files if they don't exist
if not exist .env (
    copy .env.example .env >nul
    echo [92m✓ Created .env file[0m
) else (
    echo [93m! .env file already exists, skipping[0m
)

if not exist frontend\.env (
    copy frontend\.env.example frontend\.env >nul
    echo [92m✓ Created frontend\.env file[0m
) else (
    echo [93m! frontend\.env file already exists, skipping[0m
)

echo.
echo [93mBuilding Docker images...[0m
docker-compose build

echo.
echo [92m✓ Setup complete![0m
echo.
echo [93mNext steps:[0m
echo   1. Review and update .env file with your configuration
echo   2. Start the application:
echo      [92mdocker-compose up[0m
echo.
echo   Or use PowerShell commands:
echo      [92mdocker-compose up -d[0m          - Start in production mode
echo      [92mdocker-compose logs -f[0m        - View logs
echo      [92mdocker-compose down[0m           - Stop all services
echo.
echo Once started, access the application at: [92mhttp://localhost[0m
echo.

pause
