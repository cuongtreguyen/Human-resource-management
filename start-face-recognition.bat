@echo off

REM Face Recognition System Startup Script for Windows

echo 🚀 Starting Face Recognition System...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Build and start the face recognition API
echo 📦 Building Docker image...
docker-compose build

echo 🔧 Starting services...
docker-compose up -d

REM Wait for the API to be ready
echo ⏳ Waiting for API to be ready...
timeout /t 10 /nobreak >nul

REM Check if the API is responding
set max_attempts=30
set attempt=0

:check_api
if %attempt% geq %max_attempts% (
    echo ❌ API failed to start. Check Docker logs:
    echo    docker-compose logs
    pause
    exit /b 1
)

curl -s http://localhost:5000/api/status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Face Recognition API is ready!
    echo.
    echo 🌐 API Endpoints:
    echo    - Status: http://localhost:5000/api/status
    echo    - Register: http://localhost:5000/api/register
    echo    - Recognize: http://localhost:5000/api/recognize
    echo    - Employees: http://localhost:5000/api/employees
    echo    - Attendance: http://localhost:5000/api/attendance/today
    echo.
    echo 📱 Frontend: http://localhost:5173
    echo.
    echo 🎯 To test the system:
    echo    1. Open http://localhost:5173
    echo    2. Go to Face Recognition page
    echo    3. Register an employee with photos
    echo    4. Use Check In/Out for attendance
    echo.
    echo 🎉 Face Recognition System is ready!
    pause
    exit /b 0
) else (
    set /a attempt+=1
    echo ⏳ Waiting for API... (attempt %attempt%/%max_attempts%)
    timeout /t 2 /nobreak >nul
    goto check_api
)
