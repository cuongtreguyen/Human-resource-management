# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import subprocess
# import threading
# import os
# import time
# import uuid
# import json
# from werkzeug.utils import secure_filename
# from logger_config import setup_logger

# from parser import ResumeParser

# logger = setup_logger('resume_api')

# os.environ['PYTHONUNBUFFERED'] = '1'

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# current_process = None
# system_status = {
#     "status": "idle",
#     "message": "System is idle",
#     "last_updated": time.time()
# }

# resume_cache = {}

# UPLOAD_FOLDER = 'uploads'
# ALLOWED_EXTENSIONS = {'pdf', 'docx'}
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs("datasets", exist_ok=True)
# os.makedirs("trainer", exist_ok=True)


# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# @app.route('/parse_resume', methods=['POST'])
# def parse_resume():
#     logger.info("Received resume parsing request")
#     if 'file' not in request.files:
#         logger.error("No file part in the request")
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['file']

#     if file.filename == '':
#         logger.error("No selected file")
#         return jsonify({'error': 'No selected file'}), 400
    
#     if file and allowed_file(file.filename):
#         original_filename = secure_filename(file.filename)
#         file_extension = original_filename.rsplit('.', 1)[1].lower()
#         unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
#         file.save(file_path)
        
#         try:
#             # Parse the resume
#             parser = ResumeParser()
#             result = parser.parse(file_path)
            
#             # Clean up the uploaded file after processing
#             os.remove(file_path)
            
#             logger.info(f"Successfully parsed resume: {original_filename}")
            
#             # Ensure all data is JSON serializable
#             for key, value in result.items():
#                 if isinstance(value, set):
#                     result[key] = list(value)
            
#             return jsonify(result)
#         except Exception as e:
#             logger.error(f"Error parsing resume: {str(e)}")
#             # Clean up on error
#             if os.path.exists(file_path):
#                 os.remove(file_path)
#             return jsonify({'error': str(e)}), 500
    
#     logger.error(f"File type not allowed: {file.filename}")
#     return jsonify({'error': 'File type not allowed'}), 400

# @app.route('/resume_cache/<cache_id>', methods=['GET'])
# def get_cached_resume(cache_id):
#     """Retrieve a previously parsed resume from cache"""
#     if cache_id in resume_cache:
#         return jsonify(resume_cache[cache_id]['parsed_data'])
#     else:
#         return jsonify({'error': 'Resume not found in cache'}), 404


# # Clean up old cache entries periodically
# def cleanup_cache():
#     """Remove cache entries older than 1 hour"""
#     current_time = time.time()
#     expired_keys = []
    
#     for key, data in resume_cache.items():
#         if current_time - data['timestamp'] > 3600:  # 1 hour
#             expired_keys.append(key)
    
#     for key in expired_keys:
#         del resume_cache[key]


# @app.route('/api/status', methods=['GET'])
# def get_status():
#     """Get the current status of the face recognition system"""
#     return jsonify(system_status)

# @app.route('/api/take-photos', methods=['POST'])
# def take_photos():
#     logger.info("Received photo capture request")
#     """Start the photo capture process for a user"""
#     global current_process, system_status

#     if current_process and current_process.poll() is None:
#         logger.info("Terminating existing process")
#         current_process.terminate()
#         current_process = None

#     try:
#         data = request.json
#         user_id = data.get('id')
#         user_name = data.get('name', '')

#         logger.info(f"Starting photo capture for user_id: {user_id}, name: {user_name.encode('ascii', 'ignore').decode()}")

#         if not user_id:
#             logger.error("Missing user ID in request")
#             return jsonify({
#                 'status': 'error',
#                 'message': 'User ID is required'
#             })

#         system_status = {
#             "status": "running",
#             "message": f"Taking photos for user {user_id}",
#             "last_updated": time.time()
#         }

#         # Start the process in a separate thread to avoid blocking
#         def run_process():
#             global current_process, system_status
#             try:
#                 cmd = ['py', 'take_photo.py', str(user_id)]
#                 if user_name:
#                     cmd.append(user_name)

#                 logger.info(f"Executing command: {' '.join(cmd).encode('ascii', 'ignore').decode()}")

#                 current_process = subprocess.Popen(cmd,
#                                                    stdout=subprocess.PIPE,
#                                                    stderr=subprocess.PIPE)
#                 stdout, stderr = current_process.communicate()

#                 logger.info(f"Process completed with return code: {current_process.returncode}")
#                 if stdout:
#                     logger.info(f"Process stdout: {stdout.decode('utf-8')}")
#                 if stderr:
#                     logger.error(f"Process stderr: {stderr.decode('utf-8')}")

#                 if current_process.returncode == 0:
#                     system_status = {
#                         "status": "success",
#                         "message": f"Photo capture completed for user {user_id}",
#                         "last_updated": time.time()
#                     }
#                 else:
#                     system_status = {
#                         "status": "error",
#                         "message": f"Photo capture failed for user {user_id}",
#                         "last_updated": time.time()
#                     }
#             except Exception as e:
#                 logger.error(f"Exception during photo capture: {str(e)}")
#                 system_status = {
#                     "status": "error",
#                     "message": f"Error: {str(e)}",
#                     "last_updated": time.time()
#                 }

#         threading.Thread(target=run_process).start()

#         return jsonify({
#             'status': 'success',
#             'message': f'Started photo capture for user {user_id}'
#         })
#     except Exception as e:
#         logger.error(f"Exception in take_photos endpoint: {str(e)}")
#         system_status = {
#             "status": "error",
#             "message": f"Error: {str(e)}",
#             "last_updated": time.time()
#         }
#         return jsonify({
#             'status': 'error',
#             'message': f'Failed to start photo capture: {str(e)}'
#         })

# @app.route('/api/save-photo', methods=['POST'])
# def save_photo():
#     """Save photo from frontend to local directory"""
#     try:
#         data = request.get_json()
#         user_id = data.get('userId')
#         user_name = data.get('userName', '')
#         photo_number = data.get('photoNumber')
#         image_data = data.get('imageData')  # Base64 encoded image
        
#         if not user_id or not image_data:
#             return jsonify({'status': 'error', 'message': 'User ID and image data are required'}), 400
        
#         # Create user directory
#         user_dir = os.path.join('faces', str(user_id))
#         os.makedirs(user_dir, exist_ok=True)
        
#         # Decode base64 image
#         import base64
#         image_data = image_data.split(',')[1]  # Remove data:image/jpeg;base64, prefix
#         image_bytes = base64.b64decode(image_data)
        
#         # Save image
#         filename = f"photo_{photo_number}_{user_id}.jpg"
#         filepath = os.path.join(user_dir, filename)
        
#         with open(filepath, 'wb') as f:
#             f.write(image_bytes)
        
#         # Update info file
#         # Update info file
#         info_file = os.path.join(user_dir, 'info.txt')
#         with open(info_file, 'w', encoding='utf-8') as f:
#             f.write(f"Name: {user_name}\n")
#             f.write(f"ID: {user_id}\n")
#             f.write(f"Photos: {photo_number}\n")
#             f.write(f"Date: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")

        
#         logger.info(f"Photo saved: {filepath}")
        
#         return jsonify({
#             'status': 'success',
#             'message': f'Photo {photo_number} saved for user {user_id}',
#             'filepath': filepath
#         })
        
#     except Exception as e:
#         logger.error(f"Error saving photo: {e}")
#         return jsonify({'status': 'error', 'message': f'Failed to save photo: {str(e)}'}), 500



# @app.route('/api/train', methods=['POST'])
# def train_model():
#     logger.info("Received resume parsing request")
#     """Train the face recognition model"""
#     global current_process, system_status

#     if current_process and current_process.poll() is None:
#         current_process.terminate()
#         current_process = None

#     try:
#         system_status = {
#             "status": "running",
#             "message": "Training face recognition model...",
#             "last_updated": time.time()
#         }

#         def run_training():
#             global current_process, system_status
#             try:
#                 current_process = subprocess.Popen(['python', 'train_model.py'])
#                 current_process.wait()

#                 if current_process.returncode == 0:
#                     system_status = {
#                         "status": "success",
#                         "message": "Model training completed successfully",
#                         "last_updated": time.time()
#                     }
#                 else:
#                     system_status = {
#                         "status": "error",
#                         "message": "Model training failed",
#                         "last_updated": time.time()
#                     }
#             except Exception as e:
#                 system_status = {
#                     "status": "error",
#                     "message": f"Training error: {str(e)}",
#                     "last_updated": time.time()
#                 }

#         threading.Thread(target=run_training).start()

#         return jsonify({
#             'status': 'success',
#             'message': 'Started model training process'
#         })

#     except Exception as e:
#         system_status = {
#             "status": "error",
#             "message": f"Error: {str(e)}",
#             "last_updated": time.time()
#         }
#         return jsonify({
#             'status': 'error',
#             'message': f'Failed to start training: {str(e)}'
#         })
# @app.route('/api/recognize', methods=['POST'])
# def recognize():
#     """
#     Start the face recognition process in background without opening a new CMD window.
#     Still shows OpenCV window for camera preview.
#     """
#     global current_process, system_status
#     type_param = request.args.get('type', 'default')

#     try:
#         # Nếu có process cũ đang chạy thì dừng lại
#         if current_process and current_process.poll() is None:
#             current_process.terminate()

#         system_status = {
#             "status": "running",
#             "message": "Face recognition is active",
#             "last_updated": time.time()
#         }

#         def run_recognition():
#             global current_process, system_status
#             try:
#                 import sys
#                 script_path = os.path.join(os.path.dirname(__file__), "face_recognition.py")

#                 # ✅ Không mở CMD mới, nhưng vẫn hiển thị OpenCV GUI
#                 python_exec = sys.executable
#                 DETACHED_PROCESS = 0x00000008

#                 current_process = subprocess.Popen(
#                     [python_exec, script_path, type_param],
#                     creationflags=DETACHED_PROCESS,
#                     close_fds=True
#                 )

#                 # Đợi process nhận diện chạy xong
#                 current_process.wait()

#                 # Cập nhật trạng thái hệ thống
#                 if current_process.returncode == 0:
#                     system_status = {
#                         "status": "success",
#                         "message": "Face recognition completed successfully",
#                         "last_updated": time.time()
#                     }
#                 else:
#                     system_status = {
#                         "status": "error",
#                         "message": "Face recognition process failed",
#                         "last_updated": time.time()
#                     }

#             except Exception as e:
#                 system_status = {
#                     "status": "error",
#                     "message": f"Recognition error: {str(e)}",
#                     "last_updated": time.time()
#                 }

#         # 🔹 Chạy ở thread riêng để Flask trả JSON ngay, không bị block
#         threading.Thread(target=run_recognition, daemon=True).start()

#         return jsonify({
#             'status': 'success',
#             'message': 'Started face recognition process'
#         })

#     except Exception as e:
#         system_status = {
#             "status": "error",
#             "message": f"Error: {str(e)}",
#             "last_updated": time.time()
#         }
#         return jsonify({
#             'status': 'error',
#             'message': f'Failed to start recognition: {str(e)}'
#         })

# # @app.route('/api/recognize', methods=['POST'])
# # def recognize():
# #     logger.info("Received resume parsing request")
# #     global current_process, system_status
# #     type_param = request.args.get('type', 'default')

# #     if current_process and current_process.poll() is None:
# #         current_process.terminate()
# #         current_process = None

# #     try:
# #         system_status = {
# #             "status": "running",
# #             "message": "Face recognition is active",
# #             "last_updated": time.time()
# #         }

# #         def run_recognition():
# #             global current_process, system_status
# #             try:
# #                 current_process = subprocess.Popen(['python', 'face_recognition.py', type_param])
# #                 current_process.wait()

# #                 if current_process.returncode == 0:
# #                     system_status = {
# #                         "status": "success",
# #                         "message": "Face recognition completed",
# #                         "last_updated": time.time()
# #                     }
# #                 else:
# #                     system_status = {
# #                         "status": "error",
# #                         "message": "Face recognition process failed",
# #                         "last_updated": time.time()
# #                     }
# #             except Exception as e:
# #                 system_status = {
# #                     "status": "error",
# #                     "message": f"Recognition error: {str(e)}",
# #                     "last_updated": time.time()
# #                 }

# #         threading.Thread(target=run_recognition).start()

# #         return jsonify({
# #             'status': 'success',
# #             'message': 'Started face recognition process'
# #         })

# #     except Exception as e:
# #         system_status = {
# #             "status": "error",
# #             "message": f"Error: {str(e)}",
# #             "last_updated": time.time()
# #         }
# #         return jsonify({
# #             'status': 'error',
# #             'message': f'Failed to start recognition: {str(e)}'
# #         })

# @app.route('/api/stop', methods=['POST'])
# def stop_process():
#     logger.info("Received resume parsing request")
#     global current_process, system_status

#     try:
#         if current_process and current_process.poll() is None:
#             current_process.terminate()
#             current_process = None

#             system_status = {
#                 "status": "idle",
#                 "message": "Process stopped successfully",
#                 "last_updated": time.time()
#             }

#             return jsonify({
#                 'status': 'success',
#                 'message': 'Process stopped successfully'
#             })
#         else:
#             system_status = {
#                 "status": "idle",
#                 "message": "No active process to stop",
#                 "last_updated": time.time()
#             }

#             return jsonify({
#                 'status': 'success',
#                 'message': 'No active process to stop'
#             })

#     except Exception as e:
#         system_status = {
#             "status": "error",
#             "message": f"Error stopping process: {str(e)}",
#             "last_updated": time.time()
#         }

#         return jsonify({
#             'status': 'error',
#             'message': f'Failed to stop process: {str(e)}'
#         })

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)
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
            cmd = ['py', os.path.join(BASE_DIR, 'take_photo.py'), str(user_id)]
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
    """
    try:
        payload = request.get_json(force=True) or {}
        logs_file = os.path.join(BASE_DIR, 'logs', 'recognition_logs.json')
        os.makedirs(os.path.dirname(logs_file), exist_ok=True)
        logs = _load_json(logs_file, [])
        logs.append({"received_at": datetime.now().isoformat(timespec='seconds'), **payload})
        _save_json(logs_file, logs)
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
    app.run(debug=True, host='0.0.0.0', port=5000)
