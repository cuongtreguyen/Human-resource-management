#!/bin/bash

# Face Recognition System Startup Script

echo "🚀 Starting Face Recognition System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start the face recognition API
echo "📦 Building Docker image..."
docker-compose build

echo "🔧 Starting services..."
docker-compose up -d

# Wait for the API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 10

# Check if the API is responding
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:5000/api/status > /dev/null; then
        echo "✅ Face Recognition API is ready!"
        echo ""
        echo "🌐 API Endpoints:"
        echo "   - Status: http://localhost:5000/api/status"
        echo "   - Register: http://localhost:5000/api/register"
        echo "   - Recognize: http://localhost:5000/api/recognize"
        echo "   - Employees: http://localhost:5000/api/employees"
        echo "   - Attendance: http://localhost:5000/api/attendance/today"
        echo ""
        echo "📱 Frontend: http://localhost:5173"
        echo ""
        echo "🎯 To test the system:"
        echo "   1. Open http://localhost:5173"
        echo "   2. Go to Face Recognition page"
        echo "   3. Register an employee with photos"
        echo "   4. Use Check In/Out for attendance"
        echo ""
        break
    else
        attempt=$((attempt + 1))
        echo "⏳ Waiting for API... (attempt $attempt/$max_attempts)"
        sleep 2
    fi
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ API failed to start. Check Docker logs:"
    echo "   docker-compose logs"
    exit 1
fi

echo "🎉 Face Recognition System is ready!"
