import os
import cv2
import face_recognition
import numpy as np
import json
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import pickle
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Create directories for storing data
os.makedirs('data/faces', exist_ok=True)
os.makedirs('data/models', exist_ok=True)

# Global variables to store face encodings and names
known_face_encodings = []
known_face_names = []
face_model_file = 'data/models/face_model.pkl'

def load_face_model():
    """Load the trained face recognition model"""
    global known_face_encodings, known_face_names
    try:
        if os.path.exists(face_model_file):
            with open(face_model_file, 'rb') as f:
                data = pickle.load(f)
                known_face_encodings = data['encodings']
                known_face_names = data['names']
            print(f"Loaded {len(known_face_names)} known faces")
        else:
            print("No face model found, starting fresh")
    except Exception as e:
        print(f"Error loading face model: {e}")
        known_face_encodings = []
        known_face_names = []

def save_face_model():
    """Save the trained face recognition model"""
    try:
        data = {
            'encodings': known_face_encodings,
            'names': known_face_names
        }
        with open(face_model_file, 'wb') as f:
            pickle.dump(data, f)
        print(f"Saved face model with {len(known_face_names)} faces")
    except Exception as e:
        print(f"Error saving face model: {e}")

def base64_to_image(base64_string):
    """Convert base64 string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return image
    except Exception as e:
        print(f"Error converting base64 to image: {e}")
        return None

def image_to_face_encoding(image):
    """Extract face encoding from image"""
    try:
        # Convert PIL image to numpy array
        img_array = np.array(image)
        
        # Convert RGB to BGR for face_recognition
        if len(img_array.shape) == 3:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        # Find face locations
        face_locations = face_recognition.face_locations(img_array)
        
        if len(face_locations) == 0:
            return None
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(img_array, face_locations)
        
        if len(face_encodings) > 0:
            return face_encodings[0]  # Return first face found
        
        return None
    except Exception as e:
        print(f"Error extracting face encoding: {e}")
        return None

@app.route('/api/status', methods=['GET'])
def get_status():
    """Check API status"""
    return jsonify({
        'status': 'connected',
        'message': 'Face Recognition API is running',
        'known_faces': len(known_face_names),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/register', methods=['POST'])
def register_user():
    """Register a new user with face photos"""
    try:
        data = request.json
        user_id = data.get('user_id')
        full_name = data.get('full_name')
        photos = data.get('photos', [])
        
        if not user_id or not full_name or not photos:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Process each photo
        face_encodings = []
        for photo in photos:
            image = base64_to_image(photo)
            if image:
                encoding = image_to_face_encoding(image)
                if encoding is not None:
                    face_encodings.append(encoding)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'No faces detected in photos'}), 400
        
        # Average the encodings for better accuracy
        avg_encoding = np.mean(face_encodings, axis=0)
        
        # Add to known faces
        known_face_encodings.append(avg_encoding)
        known_face_names.append(f"{user_id}_{full_name}")
        
        # Save the model
        save_face_model()
        
        return jsonify({
            'success': True,
            'message': f'User {full_name} registered successfully',
            'faces_detected': len(face_encodings),
            'total_users': len(known_face_names)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the face recognition model"""
    try:
        # The model is already trained when faces are registered
        # This endpoint can be used for additional training or validation
        
        return jsonify({
            'success': True,
            'message': 'Model training completed',
            'total_faces': len(known_face_names)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    """Recognize a face from uploaded image"""
    try:
        data = request.json
        photo = data.get('photo')
        
        if not photo:
            return jsonify({'error': 'No photo provided'}), 400
        
        image = base64_to_image(photo)
        if not image:
            return jsonify({'error': 'Invalid image format'}), 400
        
        face_encoding = image_to_face_encoding(image)
        if face_encoding is None:
            return jsonify({'error': 'No face detected'}), 400
        
        # Compare with known faces
        if len(known_face_encodings) == 0:
            return jsonify({'error': 'No registered faces found'}), 400
        
        # Calculate face distances
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        
        # Find the best match
        best_match_index = np.argmin(face_distances)
        best_distance = face_distances[best_match_index]
        
        # Convert distance to confidence (lower distance = higher confidence)
        confidence = max(0, (1 - best_distance) * 100)
        
        if confidence > 50:  # Threshold for recognition
            recognized_name = known_face_names[best_match_index]
            user_id, full_name = recognized_name.split('_', 1)
            
            return jsonify({
                'success': True,
                'recognized': True,
                'user_id': user_id,
                'name': full_name,
                'confidence': round(confidence, 2),
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': True,
                'recognized': False,
                'confidence': round(confidence, 2),
                'message': 'Face not recognized'
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get list of registered users"""
    try:
        users = []
        for name in known_face_names:
            user_id, full_name = name.split('_', 1)
            users.append({
                'user_id': user_id,
                'full_name': full_name
            })
        
        return jsonify({
            'success': True,
            'users': users,
            'total': len(users)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance', methods=['POST'])
def record_attendance():
    """Record attendance for recognized user"""
    try:
        data = request.json
        user_id = data.get('user_id')
        name = data.get('name')
        confidence = data.get('confidence')
        
        if not user_id or not name:
            return jsonify({'error': 'Missing user information'}), 400
        
        # Here you would typically save to a database
        # For now, we'll just return success
        
        attendance_record = {
            'user_id': user_id,
            'name': name,
            'confidence': confidence,
            'timestamp': datetime.now().isoformat(),
            'status': 'checked_in'
        }
        
        return jsonify({
            'success': True,
            'message': f'Attendance recorded for {name}',
            'attendance': attendance_record
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Load existing face model on startup
    load_face_model()
    
    print("Starting Face Recognition API...")
    print("Available endpoints:")
    print("- GET  /api/status")
    print("- POST /api/register")
    print("- POST /api/train")
    print("- POST /api/recognize")
    print("- GET  /api/users")
    print("- POST /api/attendance")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
