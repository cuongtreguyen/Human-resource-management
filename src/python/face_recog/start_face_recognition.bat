@echo off
echo Starting Face Recognition System...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Change to script directory
cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Run setup
echo Running setup...
python setup_environment.py

REM Start the API server
echo Starting Face Recognition API Server...
echo The server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python face_recognition_api.py

pause
