#!/bin/bash

echo "Starting Face Recognition System..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Change to script directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Run setup
echo "Running setup..."
python3 setup_environment.py

# Start the API server
echo "Starting Face Recognition API Server..."
echo "The server will run on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo
python3 face_recognition_api.py
