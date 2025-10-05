# Demo Script for Face Recognition System

This script demonstrates how to use the Face Recognition API endpoints.

## Prerequisites
- Python backend running on http://localhost:5000
- Frontend running on http://localhost:5173

## Test API Endpoints

### 1. Check API Status
```bash
curl http://localhost:5000/api/status
```

### 2. Register a User (with base64 image)
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "001",
    "full_name": "John Doe",
    "photos": ["base64_encoded_image_data"]
  }'
```

### 3. Recognize Face
```bash
curl -X POST http://localhost:5000/api/recognize \
  -H "Content-Type: application/json" \
  -d '{
    "photo": "base64_encoded_image_data"
  }'
```

### 4. Record Attendance
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "001",
    "name": "John Doe",
    "confidence": 95.5
  }'
```

### 5. Get Registered Users
```bash
curl http://localhost:5000/api/users
```

## Frontend Testing

1. Open http://localhost:5173/face-recognition
2. Navigate to "Register User" tab
3. Enter User ID and Full Name
4. Click "Start Camera"
5. Press 's' key to capture photos
6. Click "Register User" to save
7. Switch to "Recognize" tab
8. Click "Start Camera" and "Recognize Face"
9. Check attendance recording

## Troubleshooting

### Backend Issues
- Ensure Python 3.8+ is installed
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5000 is available
- Verify camera permissions

### Frontend Issues
- Ensure Node.js 16+ is installed
- Install dependencies: `npm install`
- Check if port 5173 is available
- Verify browser camera permissions

### Face Recognition Issues
- Ensure good lighting conditions
- Take photos from different angles
- Check if face is clearly visible
- Verify confidence threshold settings
