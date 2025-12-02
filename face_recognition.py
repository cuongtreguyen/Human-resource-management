import cv2
import numpy as np
import os
import sys
import time
import json
import requests
from datetime import datetime
from collections import Counter
import io
from s3_helper import (
    download_bytes_from_s3,
    upload_image_to_s3,
    upload_bytes_to_s3,
    list_files_in_s3,
    S3_MODELS_PREFIX,
    S3_RECOGNITION_IMAGES_PREFIX,
    S3_METADATA_PREFIX
)
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Java API URL
JAVA_API_URL = os.getenv('JAVA_API_URL', 'http://localhost:8085')

def set_camera_resolution(cam, preferred_resolutions=None):
    """
    Tự động set độ phân giải cao nhất mà camera hỗ trợ.
    
    Args:
        cam: cv2.VideoCapture object
        preferred_resolutions: List of (width, height) tuples, mặc định thử các độ phân giải phổ biến
    
    Returns:
        tuple: (width, height) của độ phân giải đã set thành công
    """
    if preferred_resolutions is None:
        # Thử các độ phân giải từ cao xuống thấp
        preferred_resolutions = [
            (1920, 1080),  # Full HD
            (1280, 720),   # HD
            (1024, 768),   # XGA
            (800, 600),    # SVGA
            (640, 480),    # VGA (fallback)
        ]
    
    for width, height in preferred_resolutions:
        try:
            # Set độ phân giải
            cam.set(cv2.CAP_PROP_FRAME_WIDTH, width)
            cam.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
            
            # Đọc lại để kiểm tra
            ret, frame = cam.read()
            if ret and frame is not None:
                actual_width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
                actual_height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
                
                # Kiểm tra xem camera có chấp nhận độ phân giải không
                if actual_width >= width * 0.9 and actual_height >= height * 0.9:
                    print(f"[CAMERA] Set resolution: {actual_width}x{actual_height}")
                    return (actual_width, actual_height)
        except Exception as e:
            continue
    
    # Fallback: lấy độ phân giải mặc định
    actual_width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
    actual_height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"[CAMERA] Using default resolution: {actual_width}x{actual_height}")
    return (actual_width, actual_height)


def setup_paths():
    """
    Gets all the important file paths needed for the program.

    Returns:
        dict: Dictionary containing all necessary paths
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))

    paths = {
        "script_dir": script_dir,
        "trainer_path": os.path.join(script_dir, 'trainer'),
        "dataset_path": os.path.join(script_dir, 'datasets'),
        "model_path": os.path.join(script_dir, 'trainer', 'trainer.yml'),
        "cascade_path": os.path.join(script_dir, 'haarcascade_frontalface_default.xml'),
        "attendance_path": os.path.join(script_dir, 'attendance')
    }

    return paths

# Global model cache (RAM cache) - dict: {user_id: model_bytes}
_model_cache = {}

def load_all_models_from_s3():
    """
    Load TẤT CẢ models từ S3 vào RAM cache (mỗi user 1 model riêng)
    
    Returns:
        dict: {user_id: model_bytes} hoặc {} nếu không có model nào
    """
    global _model_cache
    
    # Nếu đã cache trong RAM, return luôn
    if len(_model_cache) > 0:
        print(f"[INFO] Using cached models from RAM ({len(_model_cache)} models)")
        return _model_cache
    
    # List tất cả models trong S3
    print(f"[INFO] Loading all models from AWS S3: {S3_MODELS_PREFIX}")
    all_files = list_files_in_s3(S3_MODELS_PREFIX)
    
    # Filter chỉ lấy file user_*.yml
    model_files = [f for f in all_files if f.startswith(f"{S3_MODELS_PREFIX}user_") and f.endswith('.yml')]
    
    if len(model_files) == 0:
        print(f"[ERROR] No user models found in S3. Please train models first.")
        return {}
    
    print(f"[INFO] Found {len(model_files)} user models in S3")
    
    # Download từng model
    for s3_key in model_files:
        try:
            # Extract user_id: models/user_1.yml
            parts = s3_key.split('/')
            filename = parts[-1]  # user_1.yml
            if filename.startswith('user_') and filename.endswith('.yml'):
                user_id_str = filename.replace('user_', '').replace('.yml', '')
                try:
                    user_id = int(user_id_str)
                    model_bytes = download_bytes_from_s3(s3_key)
                    if model_bytes:
                        _model_cache[user_id] = model_bytes
                        print(f"[INFO] ✅ Loaded model for user {user_id} ({len(model_bytes)} bytes)")
                    else:
                        print(f"[WARNING] Failed to load model: {s3_key}")
                except ValueError:
                    print(f"[WARNING] Invalid user_id in filename: {filename}")
        except Exception as e:
            print(f"[ERROR] Error loading {s3_key}: {e}")
    
    print(f"[INFO] Loaded {len(_model_cache)} models from S3 and cached in RAM")
    return _model_cache

def check_files(paths):
    """
    Checks if necessary files exist and downloads them if needed.
    Load TẤT CẢ models (mỗi user 1 model riêng) và save tạm local.
    Lưu ý: File tạm sẽ được xóa sau khi sử dụng (không lưu vĩnh viễn).

    Args:
        paths (dict): Dictionary of file paths

    Returns:
        dict: {user_id: model_path} hoặc {} nếu không có model nào
    """
    # Load tất cả models từ S3
    models_cache = load_all_models_from_s3()
    if len(models_cache) == 0:
        print("Error: No user models found in S3. Please train models first.")
        return {}
    
    # Save từng model tạm thời vào local để recognizer.read() có thể đọc
    # (OpenCV LBPHFaceRecognizer cần file path, không thể load từ bytes trực tiếp)
    # Lưu ý: File tạm sẽ được xóa sau khi sử dụng (không lưu vĩnh viễn)
    os.makedirs(paths["trainer_path"], exist_ok=True)
    model_paths = {}
    
    for user_id, model_bytes in models_cache.items():
        temp_model_path = os.path.join(paths["trainer_path"], f'user_{user_id}.yml')
        with open(temp_model_path, 'wb') as f:
            f.write(model_bytes)
        model_paths[user_id] = temp_model_path
    
    print(f"[INFO] Saved {len(model_paths)} models temporarily to: {paths['trainer_path']} (will be cleaned up after use)")

    if not os.path.exists(paths["cascade_path"]):
        print(f"Error: Face detection file not found. Downloading it now...")
        import urllib.request
        url = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
        urllib.request.urlretrieve(url, paths["cascade_path"])
        print(f"Downloaded face detection file successfully!")

    return model_paths

def load_user_names(dataset_path):
    """
    Loads the names of all users from their info files (local dataset).
    Nếu không có local dataset, return empty dict (sẽ dùng "User {id}" làm fallback).
    
    Args:
        dataset_path (str): Path to the datasets folder

    Returns:
        dict: Dictionary mapping user IDs to their names
    """
    user_names = {}
    
    # Kiểm tra xem có local dataset không
    if not os.path.exists(dataset_path):
        print(f"[INFO] No local dataset found at {dataset_path}. Using default names (User {{id}}).")
        return user_names
    
    try:
        for user_id_str in os.listdir(dataset_path):
            user_path = os.path.join(dataset_path, user_id_str)
            if os.path.isdir(user_path):
                # Chỉ xử lý nếu user_id là số
                try:
                    user_id = int(user_id_str)
                except ValueError:
                    # Bỏ qua folder không phải số (như "Hoang Van E")
                    continue
                
                info_path = os.path.join(user_path, "info.txt")
                if os.path.exists(info_path):
                    try:
                        with open(info_path, 'r', encoding='utf-8') as info_file:
                            for line in info_file:
                                if line.startswith("Name:"):
                                    user_names[user_id] = line.replace("Name:", "").strip()
                                    break
                    except Exception as e:
                        print(f"[WARN] Error reading info.txt for user {user_id}: {e}")
                        continue
    except Exception as e:
        print(f"[WARN] Error loading user names from local dataset: {e}")
    
    if len(user_names) > 0:
        print(f"[INFO] Loaded {len(user_names)} user names from local dataset")
    else:
        print(f"[INFO] No user names found in local dataset. Will use 'User {{id}}' as default.")
    
    return user_names

def setup_attendance(paths):
    """
    Tạo thư mục + file attendance theo ngày, và trả về (attendance_file, attendance_data).
    Luôn bảo đảm có file rỗng nếu chưa tồn tại.
    """
    os.makedirs(paths["attendance_path"], exist_ok=True)

    current_date = datetime.now().strftime("%Y-%m-%d")
    attendance_file = os.path.join(paths["attendance_path"], f"attendance_{current_date}.json")

    # Nếu chưa có file -> tạo rỗng
    if not os.path.exists(attendance_file):
        with open(attendance_file, 'w', encoding='utf-8') as f:
            json.dump({}, f, ensure_ascii=False, indent=4)
        print(f"[ATTENDANCE] Created new empty file: {attendance_file}")

    # Đọc dữ liệu hiện có (nếu lỗi JSON -> dùng rỗng)
    try:
        with open(attendance_file, 'r', encoding='utf-8') as f:
            attendance_data = json.load(f)
    except Exception as e:
        print(f"[ATTENDANCE] Cannot read JSON; using empty dict. Error: {e}")
        attendance_data = {}

    print(f"[ATTENDANCE] Using file: {os.path.abspath(attendance_file)}")
    return attendance_file, attendance_data


def detect_faces(gray_image, cascade_path):
    """
    Detects faces in the grayscale image.

    Args:
        gray_image (numpy.ndarray): Grayscale image
        cascade_path (str): Path to the face detection cascade file

    Returns:
        list: List of face locations (x, y, width, height)
    """
    face_detector = cv2.CascadeClassifier(cascade_path)

    faces = face_detector.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=4,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    return faces

def preprocess_face(gray_image, x, y, w, h):
    """
    Prepares a face image for better recognition.

    Args:
        gray_image (numpy.ndarray): Grayscale image
        x, y, w, h: Face coordinates and dimensions

    Returns:
        numpy.ndarray: Processed face image
    """
    face_roi = gray_image[y:y+h, x:x+w]
    face_roi = cv2.GaussianBlur(face_roi, (5, 5), 0)
    return face_roi

def recognize_face_multi_models(recognizers_dict, face_roi, recent_predictions, face_key, prediction_window):
    """
    Recognizes a face using TẤT CẢ models (mỗi user 1 model riêng).
    Thử tất cả models và chọn model có confidence tốt nhất.

    Args:
        recognizers_dict: Dictionary {user_id: recognizer}
        face_roi (numpy.ndarray): Face image
        recent_predictions (dict): Dictionary of recent predictions
        face_key (str): Key for this face
        prediction_window (int): Number of frames to average

    Returns:
        tuple: User ID, confidence, and confidence text
    """
    try:
        if len(recognizers_dict) == 0:
            return None, None, "0%"
        
        # Thử tất cả models và tìm model có confidence tốt nhất (confidence thấp = tốt hơn)
        best_user_id = None
        best_confidence = float('inf')
        
        for user_id, recognizer in recognizers_dict.items():
            try:
                id, confidence = recognizer.predict(face_roi)
                
                # LBPH: confidence thấp = tốt hơn
                if np.isfinite(confidence) and confidence < best_confidence:
                    best_confidence = confidence
                    best_user_id = user_id
            except Exception as e:
                continue
        
        if best_user_id is None:
            return None, None, "0%"
        
        # Lưu vào recent_predictions
        if face_key not in recent_predictions:
            recent_predictions[face_key] = []

        if np.isfinite(best_confidence):
            recent_predictions[face_key].append((best_user_id, best_confidence))
            if len(recent_predictions[face_key]) > prediction_window:
                recent_predictions[face_key].pop(0)

        if recent_predictions[face_key]:
            ids = [pred[0] for pred in recent_predictions[face_key]]
            confidences = [pred[1] for pred in recent_predictions[face_key]]

            most_common_id = Counter(ids).most_common(1)[0][0]
            avg_confidence = sum(confidences) / len(confidences)

            id = most_common_id
            confidence = avg_confidence

            if not np.isfinite(confidence):
                confidence = 100

            confidence_value = max(0, min(100, 100 - confidence))
            confidence_text = f"{int(confidence_value)}%"

            return id, confidence, confidence_text
        else:
            return None, None, "0%"

    except Exception as e:
        print(f"Error during recognition: {str(e)}")
        return None, None, "Error"

def update_attendance(id, name, attendance_data, attendance_file, recognized_users,
                      confidence_text, recognition_type, confidence_value=None, s3_recognition_key=None):
    """
    Cập nhật vào JSON và bắn về Spring Boot khi nhận diện thành công lần đầu trong phiên.
    Trả về: (recognized_users, api_success, recognized_name)
    
    Args:
        id: User ID
        name: User name
        attendance_data: Dictionary chứa dữ liệu attendance
        attendance_file: Đường dẫn file JSON attendance
        recognized_users: Set các user đã nhận diện trong phiên
        confidence_text: Confidence dạng string (ví dụ: "85%")
        recognition_type: Loại nhận diện ("check_in" hoặc "check_out")
        confidence_value: Confidence dạng float (0-100), nếu None sẽ tính từ confidence_text
    """
    api_success = False
    recognized_name = None

    # Chỉ ghi/lưu lần đầu nhận diện user trong phiên (tránh spam)
    if id not in recognized_users:
        timestamp = datetime.now().strftime("%H:%M:%S")
        date_str = datetime.now().strftime("%Y-%m-%d")

        # Ghi check in/out đơn giản (nếu đã tồn tại -> coi như check_out)
        if str(id) not in attendance_data:
            attendance_data[str(id)] = {
                "name": name,
                "check_in": timestamp,
                "check_out": None
            }
            action = "check_in"
        else:
            attendance_data[str(id)]["check_out"] = timestamp
            action = "check_out"

        # GHI FILE AN TOÀN
        try:
            with open(attendance_file, 'w', encoding='utf-8') as f:
                json.dump(attendance_data, f, ensure_ascii=False, indent=4)
                f.flush()
                os.fsync(f.fileno())
            print(f"[ATTENDANCE] Wrote {action} for ID={id}, name={name} at {date_str} {timestamp}")
            print(f"[ATTENDANCE] File saved: {os.path.abspath(attendance_file)}")
        except Exception as e:
            print(f"[ATTENDANCE] ERROR writing JSON: {e}")

        recognized_users.add(id)
        recognized_name = name

        # BẮN SANG SPRING BOOT - Format theo Java DTO
        try:
            # Tính confidence_value nếu chưa có
            if confidence_value is None:
                # Extract số từ confidence_text (ví dụ: "85%" -> 85.0)
                try:
                    confidence_value = float(confidence_text.replace('%', '').strip())
                except (ValueError, AttributeError):
                    confidence_value = 0.0
            
            # Java yêu cầu confidence >= 20.0 (threshold)
            CONFIDENCE_THRESHOLD = 20.0
            if confidence_value < CONFIDENCE_THRESHOLD:
                print(f"[ATTENDANCE] ⚠️ Confidence too low: {confidence_value}% < {CONFIDENCE_THRESHOLD}% (Java threshold). Skipping API call.")
                return recognized_users, False, recognized_name
            
            # Convert timestamp sang ISO 8601 format
            # Format: "YYYY-MM-DDTHH:MM:SSZ" (UTC)
            iso_timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            # Format theo Java FaceRecognitionRequestDTO
            recognition_data = {
                "employeeId": str(id),           # Java cần "employeeId" không phải "id"
                "employeeName": name,           # Java cần "employeeName" không phải "name"
                "timestamp": iso_timestamp,      # ISO 8601 format
                "confidence": float(confidence_value)  # Double (0-100), threshold >= 20.0
                # Note: Java không cần field "type", Java tự động xác định check-in/check-out
                # Note: Field "image" (Base64) là optional, có thể thêm sau nếu cần
            }
            print(f"[ATTENDANCE] Sending to Java API (confidence: {confidence_value}% >= {CONFIDENCE_THRESHOLD}%): {recognition_data}")

            # Gửi request với retry và timeout dài hơn
            max_retries = 3
            retry_delay = 1  # seconds
            resp = None
            
            for attempt in range(max_retries):
                try:
                    resp = requests.post(
                        f"{JAVA_API_URL}/api/attendance/face-recognition/recognition-success",
                        json=recognition_data,
                        timeout=15,  # Tăng timeout lên 15s
                        headers={'Content-Type': 'application/json'}
                    )
                    break  # Thành công, thoát khỏi retry loop
                except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, 
                        requests.exceptions.RequestException) as e:
                    if attempt < max_retries - 1:
                        print(f"[ATTENDANCE] ⚠️ Connection error (attempt {attempt + 1}/{max_retries}): {e}")
                        print(f"[ATTENDANCE] Retrying in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                    else:
                        print(f"[ATTENDANCE] ❌ Failed after {max_retries} attempts: {e}")
                        raise
            
            if resp is None:
                print(f"[ATTENDANCE] ❌ No response received after {max_retries} attempts")
                return recognized_users, False, recognized_name
            print(f"[ATTENDANCE] Java API status={resp.status_code} body={resp.text[:200]}")
            
            # Parse response theo FaceRecognitionResponseDTO
            try:
                response_data = resp.json()
                
                # Parse tất cả fields theo spec
                success = response_data.get('success', False)
                message = response_data.get('message', '')
                attendance_id = response_data.get('attendanceId')
                check_in_time = response_data.get('checkInTime')
                check_out_time = response_data.get('checkOutTime')
                status = response_data.get('status')
                confidence_response = response_data.get('confidence')  # Optional, for error response
                
                # Check success từ response (không chỉ dựa vào status_code)
                api_success = (resp.status_code == 200) and success
                
                if api_success:
                    print(f"[ATTENDANCE] ✅ Success: {message}")
                    if attendance_id:
                        print(f"[ATTENDANCE] Attendance ID: {attendance_id}")
                    if check_in_time:
                        print(f"[ATTENDANCE] Check-in time: {check_in_time}")
                    if check_out_time:
                        print(f"[ATTENDANCE] Check-out time: {check_out_time}")
                    if status:
                        print(f"[ATTENDANCE] Status: {status}")
                    
                    # Upload metadata JSON lên S3
                    try:
                        metadata = {
                            "employeeId": str(id),
                            "employeeName": name,
                            "timestamp": iso_timestamp,
                            "confidence": float(confidence_value),
                            "attendanceId": attendance_id,
                            "checkInTime": check_in_time,
                            "checkOutTime": check_out_time,
                            "status": status,
                            "recognitionImageS3Key": s3_recognition_key,
                            "apiSuccess": True,
                            "message": message
                        }
                        
                        # Tạo S3 key cho metadata: metadata/{user_id}/{date}/metadata_{timestamp}.json
                        date_folder = datetime.now().strftime("%Y-%m-%d")
                        timestamp_meta = datetime.now().strftime("%Y%m%d_%H%M%S")
                        s3_metadata_key = f"{S3_METADATA_PREFIX}{id}/{date_folder}/metadata_{timestamp_meta}.json"
                        
                        # Convert metadata thành JSON bytes
                        metadata_json = json.dumps(metadata, indent=2, ensure_ascii=False)
                        metadata_bytes = metadata_json.encode('utf-8')
                        
                        # Upload metadata lên S3
                        if upload_bytes_to_s3(metadata_bytes, s3_metadata_key, 'application/json'):
                            print(f"[INFO] ✅ Metadata uploaded to S3: {s3_metadata_key}")
                        else:
                            print(f"[WARN] Failed to upload metadata to S3")
                    except Exception as e:
                        print(f"[WARN] Error uploading metadata: {e}")
                else:
                    # Handle error response
                    print(f"[ATTENDANCE] ⚠️ Error: {message}")
                    if confidence_response is not None:
                        print(f"[ATTENDANCE] Confidence in response: {confidence_response}")
                    if resp.status_code != 200:
                        print(f"[ATTENDANCE] HTTP Status: {resp.status_code}")
                    
                    # Vẫn upload metadata ngay cả khi API error (để log)
                    try:
                        metadata = {
                            "employeeId": str(id),
                            "employeeName": name,
                            "timestamp": iso_timestamp,
                            "confidence": float(confidence_value),
                            "attendanceId": attendance_id,
                            "checkInTime": check_in_time,
                            "checkOutTime": check_out_time,
                            "status": status,
                            "recognitionImageS3Key": s3_recognition_key,
                            "apiSuccess": False,
                            "message": message,
                            "httpStatus": resp.status_code,
                            "confidenceInResponse": confidence_response
                        }
                        
                        date_folder = datetime.now().strftime("%Y-%m-%d")
                        timestamp_meta = datetime.now().strftime("%Y%m%d_%H%M%S")
                        s3_metadata_key = f"{S3_METADATA_PREFIX}{id}/{date_folder}/metadata_{timestamp_meta}.json"
                        
                        metadata_json = json.dumps(metadata, indent=2, ensure_ascii=False)
                        metadata_bytes = metadata_json.encode('utf-8')
                        
                        if upload_bytes_to_s3(metadata_bytes, s3_metadata_key, 'application/json'):
                            print(f"[INFO] ✅ Metadata (error) uploaded to S3: {s3_metadata_key}")
                    except Exception as e:
                        print(f"[WARN] Error uploading error metadata: {e}")
                        
            except Exception as e:
                print(f"[ATTENDANCE] Could not parse response: {e}")
                print(f"[ATTENDANCE] Raw response: {resp.text[:300]}")
                api_success = (resp.status_code == 200)
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            print(f"[ATTENDANCE] ❌ Connection error: {e}")
            print(f"[ATTENDANCE] 💡 Có thể Java API server đang bận hoặc bị restart")
            print(f"[ATTENDANCE] 💡 Kiểm tra Java API có đang chạy không: {JAVA_API_URL}")
            api_success = False
        except requests.exceptions.RequestException as e:
            print(f"[ATTENDANCE] ❌ Request error: {e}")
            api_success = False
        except Exception as e:
            print(f"[ATTENDANCE] ❌ ERROR calling Java API: {e}")
            print(f"[ATTENDANCE] 💡 Error type: {type(e).__name__}")
            api_success = False

    return recognized_users, api_success, recognized_name

def recognize_faces():
    """
    Main function that runs the face recognition system.
    This program:
    1. Opens your camera
    2. Looks for faces
    3. Tries to recognize who each face belongs to
    4. Records when people arrive and leave
    5. Shows a success message when recognition is successful
    6. Automatically stops after 3 seconds of successful recognition

    Returns:
        bool: True if recognition completed successfully
    """

    recognition_type = "default"
    if len(sys.argv) > 1:
        recognition_type = sys.argv[1]
    paths = setup_paths()

    # Load TẤT CẢ models từ S3 (vào RAM cache, sau đó save tạm local để recognizer đọc)
    model_paths = check_files(paths)
    if len(model_paths) == 0:
        return False
    
    # Load tất cả recognizers
    recognizers_dict = {}
    for user_id, model_path in model_paths.items():
        try:
            recognizer = cv2.face.LBPHFaceRecognizer_create()
            recognizer.read(model_path)
            recognizers_dict[user_id] = recognizer
            print(f"[INFO] Loaded recognizer for user {user_id}")
        except Exception as e:
            print(f"[ERROR] Failed to load model for user {user_id}: {e}")
    
    if len(recognizers_dict) == 0:
        print("[ERROR] No recognizers loaded")
        return False
    
    print(f"[INFO] Loaded {len(recognizers_dict)} recognizers: {sorted(recognizers_dict.keys())}")

    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        print("Error: Cannot open camera")
        return
    
    # Tự động set độ phân giải cao nhất
    resolution = set_camera_resolution(cam)
    print(f"[CAMERA] Resolution: {resolution[0]}x{resolution[1]}")

    min_confidence = 60

    font = cv2.FONT_HERSHEY_SIMPLEX

    user_names = load_user_names(paths["dataset_path"])

    attendance_file, attendance_data = setup_attendance(paths)

    recognized_users = set()
    recent_predictions = {}
    prediction_window = 10

    api_success = False
    recognized_name = None
    success_time = None

    print("Starting face recognition...")
    print("Press 'q' to quit or wait for successful recognition")

    ret, img = cam.read()
    if ret:
        cv2.imshow('Face Recognition', img)
        cv2.waitKey(1)
        time.sleep(0.5)

    last_id = None
    stable_count = 0
    stable_required = 1  # Số frame liên tiếp cần nhận diện đúng (giảm từ 10 xuống 3 để nhanh hơn)

    while True:
        ret, img = cam.read()
        if not ret:
            print("Failed to grab frame")
            break

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)

        display_img = img.copy()

        if api_success:
            elapsed = time.time() - success_time
            remaining = max(0, 5 - elapsed)

            overlay = display_img.copy()
            cv2.rectangle(overlay, (0, 0), (display_img.shape[1], display_img.shape[0]), (0, 0, 0), -1)

            success_text = f"Attendance recorded: {recognized_name}"
            closing_text = f"Close after {int(remaining)}s"

            text_size = cv2.getTextSize(success_text, font, 1, 2)[0]
            text_x = (display_img.shape[1] - text_size[0]) // 2
            text_y = (display_img.shape[0] + text_size[1]) // 2 - 30

            close_size = cv2.getTextSize(closing_text, font, 0.7, 1)[0]
            close_x = (display_img.shape[1] - close_size[0]) // 2
            close_y = text_y + 40

            cv2.putText(overlay, success_text, (text_x, text_y), font, 1, (0, 255, 0), 2)
            cv2.putText(overlay, closing_text, (close_x, close_y), font, 0.7, (255, 255, 255), 1)

            alpha = 0.7
            cv2.addWeighted(overlay, alpha, display_img, 1 - alpha, 0, display_img)

            cv2.imshow('Face Recognition', display_img)

            if elapsed >= 5:
                print("Closing after successful recognition")
                break
        else:
            faces = detect_faces(gray, paths["cascade_path"])

            for (x, y, w, h) in faces:
                cv2.rectangle(display_img, (x, y), (x+w, y+h), (0, 255, 0), 2)

                face_roi = preprocess_face(gray, x, y, w, h)

                face_key = f"{x}_{y}_{w}_{h}"
                id, confidence, confidence_text = recognize_face_multi_models(recognizers_dict, face_roi, recent_predictions, face_key, prediction_window)

                min_confidence_percent = 30  # 30% là thành công

                if id is not None and confidence is not None:
                    confidence_value = max(0, min(100, 100 - confidence))
                    confidence_text = f"{int(confidence_value)}%"

                    if confidence_value >= min_confidence_percent:
                        if last_id == id:
                            stable_count += 1
                        else:
                            last_id = id
                            stable_count = 1
                        name = user_names.get(id, f"User {id}")
                        current_confidence_value = confidence_value  # Lưu để truyền vào update_attendance
                    else:
                        last_id = None
                        stable_count = 0
                        name = "Unknown"
                        current_confidence_value = None
                else:
                    last_id = None
                    stable_count = 0
                    name = "Unknown"
                    current_confidence_value = None

                cv2.putText(display_img, name, (x+5, y-5), font, 1, (255, 255, 255), 2)
                cv2.putText(display_img, confidence_text, (x+5, y+h-5), font, 1, (255, 255, 0), 1)

                # Chỉ ghi nhận khi đủ số frame liên tiếp
                if stable_count >= stable_required and last_id is not None:
                    # Upload ảnh nhận diện lên S3 (chia folder theo user_id)
                    s3_recognition_key = None
                    try:
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        date_folder = datetime.now().strftime("%Y-%m-%d")
                        s3_recognition_key = f"{S3_RECOGNITION_IMAGES_PREFIX}{last_id}/{date_folder}/recognition_{timestamp}.jpg"
                        
                        # Crop ảnh khuôn mặt
                        face_img = img[y:y+h, x:x+w]
                        
                        if upload_image_to_s3(face_img, s3_recognition_key):
                            print(f"[INFO] Recognition image uploaded to S3: {s3_recognition_key}")
                        else:
                            print(f"[WARN] Failed to upload recognition image to S3")
                    except Exception as e:
                        print(f"[WARN] Error uploading recognition image: {e}")
                    
                    # Truyền s3_recognition_key vào update_attendance để lưu vào metadata
                    recognized_users, current_api_success, current_name = update_attendance(
                        last_id, name, attendance_data, attendance_file,
                        recognized_users, confidence_text, recognition_type, current_confidence_value, s3_recognition_key
                    )
                    api_success = True
                    recognized_name = current_name
                    success_time = time.time()
                    print(f"[INFO] ✅ Recognized {name} ({confidence_text})")

            cv2.imshow('Face Recognition', display_img)

        k = cv2.waitKey(10) & 0xff
        if k == ord('q'):
            print("Recognition stopped by user")
            break

    cam.release()
    cv2.destroyAllWindows()
    
    # Xóa các file model tạm local sau khi sử dụng
    try:
        if 'model_paths' in locals():
            for user_id, temp_model_path in model_paths.items():
                if os.path.exists(temp_model_path):
                    os.remove(temp_model_path)
                    print(f"[INFO] Cleaned up temporary model file: {temp_model_path}")
    except Exception as e:
        print(f"[WARN] Error cleaning up temporary model files: {e}")

    return True

if __name__ == "__main__":
    recognize_faces()
