# NỘI DUNG HOÀN CHỈNH CỦA face_recognition.py (ĐÃ SỬA)
import cv2
import numpy as np
import os
import sys
import time
import json
import requests
from datetime import datetime
from collections import Counter

def setup_paths():
    """Gets all the important file paths needed for the program."""
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

def check_files(paths):
    """Checks if necessary files exist and downloads them if needed."""
    if not os.path.exists(paths["model_path"]):
        print("Error: Model file not found. Please train the model first.")
        return False
    if not os.path.exists(paths["cascade_path"]):
        print(f"Error: Face detection file not found. Downloading it now...")
        import urllib.request
        url = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
        try:
            urllib.request.urlretrieve(url, paths["cascade_path"])
            print(f"Downloaded face detection file successfully!")
        except Exception as e:
            print(f"[ERROR] Failed to download cascade: {e}")
            return False
    return True

def load_user_names(dataset_path):
    """Loads the names of all users from their info files."""
    user_names = {}
    if not os.path.isdir(dataset_path):
        return user_names
        
    for user_id in os.listdir(dataset_path):
        user_path = os.path.join(dataset_path, user_id)
        if os.path.isdir(user_path):
            info_path = os.path.join(user_path, "info.txt")
            if os.path.exists(info_path):
                try:
                    with open(info_path, 'r', encoding='utf-8') as info_file:
                        for line in info_file:
                            if line.startswith("Name:"):
                                user_names[int(user_id)] = line.replace("Name:", "").strip()
                                break
                except Exception as e:
                    print(f"[WARN] Could not read info file for user {user_id}: {e}")
    return user_names

def setup_attendance(paths):
    """Tạo thư mục + file attendance theo ngày, và trả về (attendance_file, attendance_data)."""
    os.makedirs(paths["attendance_path"], exist_ok=True)
    current_date = datetime.now().strftime("%Y-%m-%d")
    attendance_file = os.path.join(paths["attendance_path"], f"attendance_{current_date}.json")
    
    if not os.path.exists(attendance_file):
        with open(attendance_file, 'w', encoding='utf-8') as f:
            json.dump({}, f, ensure_ascii=False, indent=4)
        print(f"[ATTENDANCE] Created new empty file: {attendance_file}")

    try:
        with open(attendance_file, 'r', encoding='utf-8') as f:
            attendance_data = json.load(f)
    except Exception as e:
        print(f"[ATTENDANCE] Cannot read JSON; using empty dict. Error: {e}")
        attendance_data = {}

    print(f"[ATTENDANCE] Using file: {os.path.abspath(attendance_file)}")
    return attendance_file, attendance_data


def detect_faces(gray_image, cascade_path):
    """Detects faces in the grayscale image."""
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
    """Prepares a face image for better recognition."""
    face_roi = gray_image[y:y+h, x:x+w]
    face_roi = cv2.GaussianBlur(face_roi, (5, 5), 0)
    return face_roi

def recognize_face(recognizer, face_roi, recent_predictions, face_key, prediction_window):
    """Recognizes a face using the trained model."""
    try:
        id, confidence = recognizer.predict(face_roi)

        if face_key not in recent_predictions:
            recent_predictions[face_key] = []

        if np.isfinite(confidence):
            recent_predictions[face_key].append((id, confidence))
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
                      confidence_text, recognition_type):
    """
    Cập nhật vào JSON và bắn về Spring Boot khi nhận diện thành công lần đầu trong phiên.
    """
    api_success = False
    recognized_name = None

    if id not in recognized_users:
        timestamp = datetime.now().strftime("%H:%M:%S")
        date_str = datetime.now().strftime("%Y-%m-%d")

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

        try:
            with open(attendance_file, 'w', encoding='utf-8') as f:
                json.dump(attendance_data, f, ensure_ascii=False, indent=4)
                f.flush()
                os.fsync(f.fileno())
            print(f"[ATTENDANCE] Wrote {action} for ID={id}, name={name} at {date_str} {timestamp}")
        except Exception as e:
            print(f"[ATTENDANCE] ERROR writing JSON: {e}")

        recognized_users.add(id)
        recognized_name = name

        try:
            recognition_data = {
                "id": str(id),
                "name": name,
                "timestamp": f"{date_str} {timestamp}",
                "confidence": confidence_text,
                "type": recognition_type
            }
            print(f"[ATTENDANCE] Sending to Java API: {recognition_data}")

            resp = requests.post(
                "http://localhost:8080/api/attendance/face-recognition/recognition-success",
                json=recognition_data,
                timeout=8
            )
            print(f"[ATTENDANCE] Java API status={resp.status_code} body={resp.text[:200]}")
            api_success = (resp.status_code == 200)
        except Exception as e:
            print(f"[ATTENDANCE] ERROR calling Java API: {e}")

    return recognized_users, api_success, recognized_name

def initialize_camera_for_recognition():
    """
    Initialize webcam, trying multiple indices and backends for better compatibility.
    (Sử dụng cv2.CAP_DSHOW cho Windows để khắc phục lỗi MSMF).
    """
    print("[INFO] Initializing camera for recognition...")
    
    cam = cv2.VideoCapture(0)
    
    if not cam.isOpened():
        print("[WARN] Camera index 0 failed. Trying index 1...")
        cam = cv2.VideoCapture(1)

    if not cam.isOpened() and sys.platform == "win32":
        print("[WARN] Camera index 1 failed. Trying index 0 with DirectShow (CAP_DSHOW)...")
        cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
    if not cam.isOpened():
        print("[ERROR] Failed to open any camera device. Aborting recognition.")
        return None
        
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    print("[INFO] Camera initialized successfully.")
    return cam

def recognize_faces():
    """Main function that runs the face recognition system."""
    recognition_type = "default"
    if len(sys.argv) > 1:
        recognition_type = sys.argv[1]
    paths = setup_paths()

    if not check_files(paths):
        return False

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(paths["model_path"])

    # --- SỬA LỖI LOGIC: Gọi hàm camera và kiểm tra lỗi ---
    cam = initialize_camera_for_recognition()
    if cam is None:
        return False
    # ---------------------------------------------------

    min_confidence_percent = 30
    font = cv2.FONT_HERSHEY_SIMPLEX
    user_names = load_user_names(paths["dataset_path"])
    attendance_file, attendance_data = setup_attendance(paths)
    recognized_users = set()
    recent_predictions = {}
    prediction_window = 10
    api_success = False
    recognized_name = None
    success_time = None
    last_id = None
    stable_count = 0
    stable_required = 10  # Số frame liên tiếp cần nhận diện đúng

    print("Starting face recognition...")
    print("Press 'q' to quit or wait for successful recognition")

    while True:
        ret, img = cam.read()
        if not ret:
            print("[ERROR] Failed to grab frame. Retrying...")
            time.sleep(0.5)
            ret, img = cam.read()
            if not ret:
                print("[ERROR] Failed to grab frame again. Aborting.")
                break

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        display_img = img.copy()

        if api_success:
            # Logic hiển thị màn hình 'Success'
            elapsed = time.time() - success_time
            remaining = max(0, 5 - elapsed) 
            
            overlay = display_img.copy()
            cv2.rectangle(overlay, (0, 0), (display_img.shape[1], display_img.shape[0]), (0, 0, 0), -1)

            success_text = f"Attendance recorded: {recognized_name}"
            closing_text = f"Closing in {int(remaining)}s"

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
                print("Closing after successful recognition timeout.")
                break
        
        else:
            # Logic nhận diện khuôn mặt
            faces = detect_faces(gray, paths["cascade_path"])
            name = "Unknown" # Mặc định
            
            for (x, y, w, h) in faces:
                cv2.rectangle(display_img, (x, y), (x+w, y+h), (0, 255, 0), 2)
                face_roi = preprocess_face(gray, x, y, w, h)
                face_key = f"{x}_{y}_{w}_{h}"
                id, confidence, confidence_text = recognize_face(recognizer, face_roi, recent_predictions, face_key, prediction_window)
                
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
                    else:
                        last_id = None
                        stable_count = 0
                        name = "Unknown"
                else:
                    last_id = None
                    stable_count = 0
                    name = "Unknown"

                cv2.putText(display_img, name, (x+5, y-5), font, 1, (255, 255, 255), 2)
                cv2.putText(display_img, confidence_text, (x+5, y+h-5), font, 1, (255, 255, 0), 1)

                if stable_count >= stable_required and last_id is not None:
                    recognized_users, current_api_success, current_name = update_attendance(
                        last_id, name, attendance_data, attendance_file,
                        recognized_users, confidence_text, recognition_type
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
    return True

if __name__ == "__main__":
    recognize_faces()