@echo off
echo Starting Face Recognition Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Navigate to the face recognition directory
cd /d "%~dp0"

REM Check if we're in the right directory
if not exist "backend\face_recognition_api.py" (
    echo Face recognition API not found
    echo Please make sure you're running this from the project root
    pause
    exit /b 1
)

REM Install required packages if needed
echo Installing required packages...
cd backend
pip install -r requirements.txt

REM Start the Flask API
echo.
echo Starting Face Recognition API on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python face_recognition_api.py

pause
