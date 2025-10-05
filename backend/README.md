# Face Recognition Backend API

This is the Python backend API for the Face Recognition System.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### GET /api/status
Check API status and connection.

**Response:**
```json
{
  "status": "connected",
  "message": "Face Recognition API is running",
  "known_faces": 5,
  "timestamp": "2024-01-10T10:30:00"
}
```

### POST /api/register
Register a new user with face photos.

**Request Body:**
```json
{
  "user_id": "123",
  "full_name": "John Doe",
  "photos": ["base64_encoded_image1", "base64_encoded_image2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User John Doe registered successfully",
  "faces_detected": 2,
  "total_users": 5
}
```

### POST /api/train
Train the face recognition model.

**Response:**
```json
{
  "success": true,
  "message": "Model training completed",
  "total_faces": 5
}
```

### POST /api/recognize
Recognize a face from uploaded image.

**Request Body:**
```json
{
  "photo": "base64_encoded_image"
}
```

**Response:**
```json
{
  "success": true,
  "recognized": true,
  "user_id": "123",
  "name": "John Doe",
  "confidence": 95.5,
  "timestamp": "2024-01-10T10:30:00"
}
```

### GET /api/users
Get list of registered users.

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "user_id": "123",
      "full_name": "John Doe"
    }
  ],
  "total": 1
}
```

### POST /api/attendance
Record attendance for recognized user.

**Request Body:**
```json
{
  "user_id": "123",
  "name": "John Doe",
  "confidence": 95.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance recorded for John Doe",
  "attendance": {
    "user_id": "123",
    "name": "John Doe",
    "confidence": 95.5,
    "timestamp": "2024-01-10T10:30:00",
    "status": "checked_in"
  }
}
```

## Features

- Face detection and encoding using face_recognition library
- User registration with multiple photos
- Face recognition with confidence scoring
- Attendance recording
- Model persistence using pickle
- CORS enabled for frontend integration

## Dependencies

- Flask: Web framework
- face_recognition: Face detection and recognition
- OpenCV: Image processing
- NumPy: Numerical operations
- Pillow: Image handling
- Flask-CORS: Cross-origin resource sharing
