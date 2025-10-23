#!/bin/bash

echo "Starting Face Recognition Backend..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed or not in PATH"
    echo "Please install Python 3.7+ and try again"
    exit 1
fi

# Navigate to the project root
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "src/main/face_recog/face_recognition_api.py" ]; then
    echo "Face recognition API not found"
    echo "Please make sure you're running this from the project root"
    exit 1
fi

# Install required packages if needed
echo "Installing required packages..."
pip3 install flask opencv-python pillow numpy requests werkzeug

# Start the Flask API
echo
echo "Starting Face Recognition API on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo

cd "src/main/face_recog"
python3 face_recognition_api.py
