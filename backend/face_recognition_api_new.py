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
import sqlite3

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

# Create directories for storing data
os.makedirs('data/faces', exist_ok=True)
os.makedirs('data/models', exist_ok=True)
os.makedirs('data/attendance', exist_ok=True)
os.makedirs('data/database', exist_ok=True)

# Database setup
DB_PATH = 'data/database/attendance.db'

def init_database():
    """Initialize SQLite database for attendance tracking"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create employees table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_code TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            department TEXT,
            position TEXT,
            face_encoding BLOB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create attendance table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            date DATE NOT NULL,
            check_in TIME,
            check_out TIME,
            status TEXT DEFAULT 'Present',
            confidence REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees (id)
        )
    ''')
    
    conn.commit()
    conn.close()

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

def save_employee_to_db(employee_code, full_name, department, position, face_encoding):
    """Save employee to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO employees (employee_code, full_name, department, position, face_encoding)
            VALUES (?, ?, ?, ?, ?)
        ''', (employee_code, full_name, department, position, face_encoding))
        
        conn.commit()
        employee_id = cursor.lastrowid
        return employee_id
    except Exception as e:
        print(f"Error saving employee: {e}")
        return None
    finally:
        conn.close()

def record_attendance(employee_id, check_type='check_in'):
    """Record attendance in database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        today = datetime.now().date()
        current_time = datetime.now().time()
        
        # Check if attendance record exists for today
        cursor.execute('''
            SELECT id, check_in, check_out FROM attendance 
            WHERE employee_id = ? AND date = ?
        ''', (employee_id, today))
        
        record = cursor.fetchone()
        
        if record:
            record_id, check_in, check_out = record
            if check_type == 'check_in' and not check_in:
                cursor.execute('''
                    UPDATE attendance SET check_in = ? WHERE id = ?
                ''', (current_time, record_id))
            elif check_type == 'check_out' and not check_out:
                cursor.execute('''
                    UPDATE attendance SET check_out = ? WHERE id = ?
                ''', (current_time, record_id))
        else:
            # Create new attendance record
            check_in = current_time if check_type == 'check_in' else None
            check_out = current_time if check_type == 'check_out' else None
            
            cursor.execute('''
                INSERT INTO attendance (employee_id, date, check_in, check_out)
                VALUES (?, ?, ?, ?)
            ''', (employee_id, today, check_in, check_out))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error recording attendance: {e}")
        return False
    finally:
        conn.close()

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
        employee_code = data.get('employee_code')
        full_name = data.get('full_name')
        department = data.get('department', '')
        position = data.get('position', '')
        photos = data.get('photos', [])
        
        if not employee_code or not full_name or not photos:
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
        
        # Save to database
        face_encoding_blob = pickle.dumps(avg_encoding)
        employee_id = save_employee_to_db(employee_code, full_name, department, position, face_encoding_blob)
        
        if not employee_id:
            return jsonify({'error': 'Failed to save employee to database'}), 500
        
        # Add to known faces for recognition
        known_face_encodings.append(avg_encoding)
        known_face_names.append(f"{employee_code}_{full_name}")
        
        # Save the model
        save_face_model()
        
        return jsonify({
            'success': True,
            'message': f'Employee {full_name} registered successfully',
            'faces_detected': len(face_encodings),
            'employee_id': employee_id,
            'total_users': len(known_face_names)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    """Recognize a face and record attendance"""
    try:
        data = request.json
        photo = data.get('photo')
        check_type = data.get('check_type', 'check_in')  # 'check_in' or 'check_out'
        
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
            employee_code, full_name = recognized_name.split('_', 1)
            
            # Get employee ID from database
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM employees WHERE employee_code = ?', (employee_code,))
            result = cursor.fetchone()
            conn.close()
            
            if result:
                employee_id = result[0]
                
                # Record attendance
                attendance_success = record_attendance(employee_id, check_type)
                
                return jsonify({
                    'success': True,
                    'recognized': True,
                    'employee_code': employee_code,
                    'name': full_name,
                    'confidence': round(confidence, 2),
                    'attendance_recorded': attendance_success,
                    'check_type': check_type,
                    'timestamp': datetime.now().isoformat()
                })
            else:
                return jsonify({
                    'success': False,
                    'recognized': True,
                    'error': 'Employee not found in database'
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

@app.route('/api/employees', methods=['GET'])
def get_employees():
    """Get list of registered employees"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT employee_code, full_name, department, position, created_at 
            FROM employees ORDER BY created_at DESC
        ''')
        
        employees = []
        for row in cursor.fetchall():
            employees.append({
                'employee_code': row[0],
                'full_name': row[1],
                'department': row[2],
                'position': row[3],
                'created_at': row[4]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'employees': employees,
            'total': len(employees)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    """Get attendance records"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get query parameters
        date = request.args.get('date')
        employee_code = request.args.get('employee_code')
        
        query = '''
            SELECT a.id, e.employee_code, e.full_name, e.department, 
                   a.date, a.check_in, a.check_out, a.status, a.confidence
            FROM attendance a
            JOIN employees e ON a.employee_id = e.id
        '''
        
        params = []
        conditions = []
        
        if date:
            conditions.append('a.date = ?')
            params.append(date)
        
        if employee_code:
            conditions.append('e.employee_code = ?')
            params.append(employee_code)
        
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        
        query += ' ORDER BY a.date DESC, a.created_at DESC'
        
        cursor.execute(query, params)
        
        attendance_records = []
        for row in cursor.fetchall():
            attendance_records.append({
                'id': row[0],
                'employee_code': row[1],
                'full_name': row[2],
                'department': row[3],
                'date': row[4],
                'check_in': row[5],
                'check_out': row[6],
                'status': row[7],
                'confidence': row[8]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'attendance': attendance_records,
            'total': len(attendance_records)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance/today', methods=['GET'])
def get_today_attendance():
    """Get today's attendance records"""
    try:
        today = datetime.now().date()
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT a.id, e.employee_code, e.full_name, e.department, 
                   a.check_in, a.check_out, a.status, a.confidence
            FROM attendance a
            JOIN employees e ON a.employee_id = e.id
            WHERE a.date = ?
            ORDER BY a.check_in ASC
        ''', (today,))
        
        attendance_records = []
        for row in cursor.fetchall():
            attendance_records.append({
                'id': row[0],
                'employee_code': row[1],
                'full_name': row[2],
                'department': row[3],
                'check_in': row[4],
                'check_out': row[5],
                'status': row[6],
                'confidence': row[7]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'attendance': attendance_records,
            'date': str(today),
            'total': len(attendance_records)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Load existing face model on startup
    load_face_model()
    
    print("Starting Face Recognition API...")
    print("Available endpoints:")
    print("- GET  /api/status")
    print("- POST /api/register")
    print("- POST /api/recognize")
    print("- GET  /api/employees")
    print("- GET  /api/attendance")
    print("- GET  /api/attendance/today")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
