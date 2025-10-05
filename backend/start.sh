#!/bin/bash

# Face Recognition Backend Startup Script

echo "Starting Face Recognition Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
else
    echo "requirements.txt not found. Please create it first."
    exit 1
fi

# Start the Flask application
echo "Starting Flask application on http://localhost:5000"
python3 app.py
