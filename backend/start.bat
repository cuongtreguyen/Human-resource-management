@echo off

REM Face Recognition Backend Startup Script for Windows

echo Starting Face Recognition Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python first.
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Install dependencies if requirements.txt exists
if exist requirements.txt (
    echo Installing Python dependencies...
    pip install -r requirements.txt
) else (
    echo requirements.txt not found. Please create it first.
    pause
    exit /b 1
)

REM Start the Flask application
echo Starting Flask application on http://localhost:5000
python app.py

pause
