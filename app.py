from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import threading
import os
import sys
import time
import uuid
import json
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename



# Load environment variables
try:
    from dotenv import load_dotenv
    import os
    # Chỉ load .env nếu file tồn tại và có thể đọc được
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        try:
            # Thử đọc với UTF-8 trước
            load_dotenv(env_path, encoding='utf-8')
        except (UnicodeDecodeError, UnicodeError) as e:
            # Nếu lỗi encoding, thử đọc lại file với encoding khác và convert
            try:
                with open(env_path, 'rb') as f:
                    content = f.read()
                    # Detect encoding
                    if content.startswith(b'\xff\xfe'):  # UTF-16 LE BOM
                        content = content[2:].decode('utf-16-le').encode('utf-8')
                    elif content.startswith(b'\xfe\xff'):  # UTF-16 BE BOM
                        content = content[2:].decode('utf-16-be').encode('utf-8')
                    else:
                        content = content.decode('utf-8', errors='ignore').encode('utf-8')
                    
                    # Write lại với UTF-8
                    with open(env_path, 'wb') as f:
                        f.write(content)
                    # Load lại
                    load_dotenv(env_path, encoding='utf-8')
            except Exception:
                # Nếu vẫn lỗi, bỏ qua file .env
                pass
        except Exception:
            # Bỏ qua nếu có lỗi khác
            pass
    else:
        # Nếu không có file .env, vẫn load để tìm trong các vị trí khác
        load_dotenv(override=False)
except ImportError:
    pass  # python-dotenv không bắt buộc
except Exception:
    pass  # Bỏ qua nếu có lỗi bất kỳ

# optional: logger + resume parser (đang có trong dự án của bạn)
try:
    from logger_config import setup_logger
    from parser import ResumeParser
    logger = setup_logger('resume_api')
except Exception:
    class _Dummy:
        def info(self,*a,**k): pass
        def error(self,*a,**k): pass
    logger = _Dummy()
    ResumeParser = None

# ---------------- Java API Configuration ---------------- 
JAVA_API_URL = os.getenv('JAVA_API_URL', 'http://localhost:8085')

# ---------------- Paths / Helpers ----------------
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
ATT_DIR     = os.path.join(BASE_DIR, 'attendance')
DATASET_DIR = os.path.join(BASE_DIR, 'datasets')
UPLOAD_DIR  = os.path.join(BASE_DIR, 'uploads')
TRAINER_DIR = os.path.join(BASE_DIR, 'trainer')

os.makedirs(ATT_DIR, exist_ok=True)
os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TRAINER_DIR, exist_ok=True)

def _today_date():
    return datetime.now().strftime("%Y-%m-%d")

def _load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return default
    return default

def _save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ---------------- Java API Helper ---------------- 
def _call_java_api(endpoint, method='POST', data=None):
    """
    Helper function để gọi Java API
    Args:
        endpoint: API endpoint (ví dụ: '/api/face-recognition/recognition-success')
        method: HTTP method ('GET', 'POST', 'PUT', 'DELETE')
        data: Data để gửi (dict)
    Returns:
        Response từ Java API hoặc None nếu lỗi
    """
    try:
        import requests
        url = f"{JAVA_API_URL}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=5)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=5)
        elif method == 'PUT':
            response = requests.put(url, json=data, headers=headers, timeout=5)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=5)
        else:
            logger.error(f"Unsupported HTTP method: {method}")
            return None
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            logger.warning(f"Java API call failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error calling Java API {endpoint}: {e}")
        return None

# ---------------- Flask app ----------------
os.environ['PYTHONUNBUFFERED'] = '1'

app = Flask(__name__)
CORS(app)

current_process = None
system_status = {
    "status": "idle",
    "message": "System is idle",
    "last_updated": time.time()
}

resume_cache = {}
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

# ---------------- Resume demo endpoints ----------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post('/parse_resume')
def parse_resume():
    logger.info("Received resume parsing request")
    if 'file' not in request.files:
        logger.error("No file part")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        logger.error("File type not allowed")
        return jsonify({'error': 'File type not allowed'}), 400

    original = secure_filename(file.filename)
    ext = original.rsplit('.', 1)[1].lower()
    unique = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(UPLOAD_DIR, unique)
    file.save(path)

    try:
        if ResumeParser is None:
            raise RuntimeError("ResumeParser not available in this environment.")
        parser = ResumeParser()
        result = parser.parse(path)
        os.remove(path)
        for k,v in list(result.items()):
            if isinstance(v, set):
                result[k] = list(v)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Parse error: {e}")
        if os.path.exists(path): os.remove(path)
        return jsonify({'error': str(e)}), 500

# ---------------- Home page ----------------
@app.get('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Face Recognition API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
            .method { font-weight: bold; color: #007bff; }
            .url { font-family: monospace; color: #28a745; }
            .description { color: #666; margin-top: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎭 Face Recognition API</h1>
            <p style="text-align: center; color: #666; font-size: 18px;">Welcome to the Face Recognition Backend API</p>
            
            <h2>📋 Available Endpoints:</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="url">/api/status</span>
                <div class="description">Check system status</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/take-photos</span>
                <div class="description">Capture photos for face registration</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/save-photo</span>
                <div class="description">Save photos from frontend</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/train</span>
                <div class="description">Train the face recognition model</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/recognize</span>
                <div class="description">Start face recognition</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/stop</span>
                <div class="description">Stop current process</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="url">/api/attendance/daily</span>
                <div class="description">Get daily attendance records</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="url">/api/attendance/stats</span>
                <div class="description">Get attendance statistics</div>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #666;">
                🚀 <strong>API is running successfully!</strong><br>
                Server: <code>http://localhost:5000</code>
            </p>
        </div>
    </body>
    </html>
    """

# ---------------- System status ----------------
@app.get('/api/status')
def get_status():
    return jsonify(system_status)

# ---------------- Photo capture (registration) ----------------
@app.post('/api/take-photos')
def take_photos():
    logger.info("Received photo capture request")
    global current_process, system_status

    if current_process and current_process.poll() is None:
        current_process.terminate()
        current_process = None

    data = request.get_json(force=True) or {}
    user_id = data.get('id')
    user_name = data.get('name', '')

    if not user_id:
        return jsonify({'status': 'error', 'message': 'User ID is required'}), 400

    system_status.update({
        "status": "running",
        "message": f"Taking photos for user {user_id}",
        "last_updated": time.time()
    })

    def run_process():
        global current_process, system_status
        try:
            cmd = ['python', os.path.join(BASE_DIR, 'take_photo.py'), str(user_id)]
            if user_name:
                cmd.append(user_name)
            logger.info("Executing: %s", " ".join(cmd))
            current_process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = current_process.communicate()
            if stdout: logger.info(stdout.decode(errors='ignore'))
            if stderr: logger.error(stderr.decode(errors='ignore'))

            system_status.update({
                "status": "success" if current_process.returncode == 0 else "error",
                "message": "Photo capture completed" if current_process.returncode == 0 else "Photo capture failed",
                "last_updated": time.time()
            })
        except Exception as e:
            logger.error(f"Exception during photo capture: {e}")
            system_status.update({"status": "error", "message": str(e), "last_updated": time.time()})

    threading.Thread(target=run_process, daemon=True).start()
    return jsonify({'status': 'success', 'message': f'Started photo capture for user {user_id}'})

# ---------------- Save photo from FE (optional) ----------------
@app.post('/api/save-photo')
def save_photo():
    try:
        data = request.get_json(force=True)
        user_id = data.get('userId')
        user_name = data.get('userName', '')
        photo_number = data.get('photoNumber')
        image_data = data.get('imageData')
        if not user_id or not image_data:
            return jsonify({'status': 'error', 'message': 'User ID and image data are required'}), 400

        user_dir = os.path.join(BASE_DIR, 'faces', str(user_id))
        os.makedirs(user_dir, exist_ok=True)

        import base64
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        filename = f"photo_{photo_number}_{user_id}.jpg"
        filepath = os.path.join(user_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(image_bytes)

        info_file = os.path.join(user_dir, 'info.txt')
        with open(info_file, 'w', encoding='utf-8') as f:
            f.write(f"Name: {user_name}\nID: {user_id}\nPhotos: {photo_number}\nDate: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")

        logger.info(f"Photo saved: {filepath}")
        return jsonify({'status': 'success', 'message': f'Photo {photo_number} saved', 'filepath': filepath})
    except Exception as e:
        logger.error(f"Error saving photo: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ---------------- Train model ----------------
@app.post('/api/train')
def train_model():
    logger.info("Train request")
    global current_process, system_status
    if current_process and current_process.poll() is None:
        current_process.terminate()
        current_process = None

    system_status.update({"status": "running", "message": "Training model...", "last_updated": time.time()})

    def run_training():
        global current_process, system_status
        try:
            current_process = subprocess.Popen(['python', os.path.join(BASE_DIR, 'train_model.py')])
            current_process.wait()
            system_status.update({
                "status": "success" if current_process.returncode == 0 else "error",
                "message": "Model training completed successfully" if current_process.returncode == 0 else "Model training failed",
                "last_updated": time.time()
            })
        except Exception as e:
            system_status.update({"status": "error", "message": f"Training error: {e}", "last_updated": time.time()})

    threading.Thread(target=run_training, daemon=True).start()
    return jsonify({'status': 'success', 'message': 'Started training'})

# ---------------- Start recognition ----------------
@app.post('/api/recognize')
def recognize():
    """
    Start recognition in background (không mở thêm CMD). OpenCV window vẫn hiện.
    """
    global current_process, system_status
    type_param = request.args.get('type', 'default')

    if current_process and current_process.poll() is None:
        current_process.terminate()

    # Kiểm tra model có tồn tại không
    model_path = os.path.join(BASE_DIR, "trainer", "trainer.yml")
    if not os.path.exists(model_path):
        return jsonify({
            'status': 'error',
            'message': 'Model chưa được train. Vui lòng train model trước khi nhận diện.'
        }), 400

    system_status.update({"status": "running", "message": "Face recognition is active", "last_updated": time.time()})

    def run_recognition():
        global current_process, system_status
        try:
            script_path = os.path.join(BASE_DIR, "face_recognition.py")
            DETACHED_PROCESS = 0x00000008  # hide console
            current_process = subprocess.Popen(
                [sys.executable, script_path, type_param],
                creationflags=DETACHED_PROCESS,
                close_fds=True
            )
            current_process.wait()
            system_status.update({
                "status": "success" if current_process.returncode == 0 else "error",
                "message": "Face recognition completed successfully" if current_process.returncode == 0 else "Face recognition process failed",
                "last_updated": time.time()
            })
        except Exception as e:
            system_status.update({"status": "error", "message": f"Recognition error: {e}", "last_updated": time.time()})

    threading.Thread(target=run_recognition, daemon=True).start()
    return jsonify({'status': 'success', 'message': 'Started face recognition process'})

# ---------------- Stop process ----------------
@app.post('/api/stop')
def stop_process():
    global current_process, system_status
    try:
        if current_process and current_process.poll() is None:
            current_process.terminate()
            current_process = None
            system_status.update({"status": "idle", "message": "Process stopped", "last_updated": time.time()})
            return jsonify({'status': 'success', 'message': 'Process stopped'})
        system_status.update({"status": "idle", "message": "No active process", "last_updated": time.time()})
        return jsonify({'status': 'success', 'message': 'No active process'})
    except Exception as e:
        system_status.update({"status": "error", "message": f"Stop error: {e}", "last_updated": time.time()})
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ---------------- Face-recognition notify (Python script POST về) ----------------
@app.post('/api/face-recognition/recognition-success')
def recognition_success():
    """
    Nhận notify khi nhận diện thành công. Ở đây chỉ lưu 1 log nhẹ (không ghi chấm công
    vì file attendance đã được face_recognition.py ghi).
    Có thể forward sang Java API nếu cần.
    """
    try:
        payload = request.get_json(force=True) or {}
        logs_file = os.path.join(BASE_DIR, 'logs', 'recognition_logs.json')
        os.makedirs(os.path.dirname(logs_file), exist_ok=True)
        logs = _load_json(logs_file, [])
        logs.append({"received_at": datetime.now().isoformat(timespec='seconds'), **payload})
        _save_json(logs_file, logs)
        
        # Optional: Forward sang Java API
        _call_java_api('/api/face-recognition/recognition-success', 'POST', payload)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Alias để FE cũ POST vào đây cũng được
@app.post('/api/attendance/face-recognition/recognition-success')
def recognition_success_alias():
    return recognition_success()

# ---------------- Attendance read APIs (FE đọc dữ liệu) ----------------
@app.get('/api/attendance/daily')
def attendance_daily():
    date = request.args.get('date') or _today_date()
    data = _load_json(os.path.join(ATT_DIR, f"attendance_{date}.json"), {})
    result = [
        {"id": emp_id, "name": rec.get("name"), "date": date,
         "check_in": rec.get("check_in"), "check_out": rec.get("check_out")}
        for emp_id, rec in data.items()
    ]
    return jsonify(result)

@app.get('/api/attendance/range')
def attendance_range():
    start = request.args.get('startDate')
    end   = request.args.get('endDate')
    if not start or not end:
        return jsonify([])
    s = datetime.strptime(start, "%Y-%m-%d")
    e = datetime.strptime(end, "%Y-%m-%d")
    items = []
    cur = s
    while cur <= e:
        date = cur.strftime("%Y-%m-%d")
        data = _load_json(os.path.join(ATT_DIR, f"attendance_{date}.json"), {})
        for emp_id, rec in data.items():
            items.append({"id": emp_id, "name": rec.get("name"), "date": date,
                          "check_in": rec.get("check_in"), "check_out": rec.get("check_out")})
        cur += timedelta(days=1)
    return jsonify(items)

@app.get('/api/attendance/employee/<emp_id>')
def attendance_by_employee(emp_id):
    start = request.args.get('startDate')
    end   = request.args.get('endDate')
    records = []
    def iter_dates():
        if start and end:
            s = datetime.strptime(start, "%Y-%m-%d")
            e = datetime.strptime(end, "%Y-%m-%d")
            cur = s
            while cur <= e:
                yield cur.strftime("%Y-%m-%d"); cur += timedelta(days=1)
        else:
            if not os.path.isdir(ATT_DIR): return
            for fn in sorted(os.listdir(ATT_DIR)):
                if fn.startswith("attendance_") and fn.endswith(".json"):
                    yield fn.replace("attendance_","").replace(".json","")
    for d in iter_dates():
        data = _load_json(os.path.join(ATT_DIR, f"attendance_{d}.json"), {})
        if str(emp_id) in data:
            rec = data[str(emp_id)]
            records.append({"id": emp_id, "name": rec.get("name"), "date": d,
                            "check_in": rec.get("check_in"), "check_out": rec.get("check_out")})
    return jsonify(records)

@app.get('/api/attendance/stats')
def attendance_stats():
    date = request.args.get('date') or _today_date()
    data = _load_json(os.path.join(ATT_DIR, f"attendance_{date}.json"), {})
    try:
        total_employees = len([d for d in os.listdir(DATASET_DIR) if os.path.isdir(os.path.join(DATASET_DIR, d))])
    except Exception:
        total_employees = 0
    present = sum(1 for v in data.values() if v.get("check_in"))
    checked_out = sum(1 for v in data.values() if v.get("check_out"))
    still_working = max(present - checked_out, 0)
    absent = max(total_employees - present, 0)
    return jsonify({
        "totalEmployees": total_employees,
        "present": present,
        "absent": absent,
        "checkedOut": checked_out,
        "stillWorking": still_working
    })

if __name__ == '__main__':
    # Flask phục vụ ở http://localhost:5000/api/**
    # Development mode
    app.run(debug=True, host='0.0.0.0', port=5000)
    
    # Production mode (uncomment để dùng)
    # app.run(debug=False, host='0.0.0.0', port=5000)
