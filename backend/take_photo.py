# NỘI DUNG HOÀN CHỈNH CỦA take_photo.py (ĐÃ SỬA)
import cv2
import os
import sys
import time
from train_model import train_model
import numpy as np # Đảm bảo đã import

def setup_paths():
    """
    Sets up necessary file paths and downloads required files if needed.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    paths = {
        "script_dir": script_dir,
        "dataset_path": os.path.join(script_dir, 'datasets'),
        "cascade_path": os.path.join(script_dir, 'haarcascade_frontalface_default.xml')
    }

    if not os.path.exists(paths["cascade_path"]):
        print(f"[INFO] Cascade file not found. Downloading...")
        import urllib.request
        url = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
        try:
            urllib.request.urlretrieve(url, paths["cascade_path"])
            print(f"[INFO] Downloaded face cascade successfully!")
        except Exception as e:
            print(f"[ERROR] Failed to download cascade: {e}")
            sys.exit(1)

    os.makedirs(paths["dataset_path"], exist_ok=True)
    return paths


def initialize_camera():
    """
    Initialize webcam, trying multiple indices and backends for better compatibility
    (Sử dụng cv2.CAP_DSHOW cho Windows để khắc phục lỗi MSMF).
    
    Returns:
        cv2.VideoCapture object or None if failure
    """
    print("[INFO] Attempting to initialize camera...")
    
    # --- Step 1: Thử camera mặc định (index 0) ---
    cam = cv2.VideoCapture(0)
    
    if not cam.isOpened():
        print("[WARN] Camera index 0 failed. Trying index 1...")
        # --- Step 2: Thử camera thứ cấp (index 1) ---
        cam = cv2.VideoCapture(1)

    # --- Step 3: Thử lại với DirectShow backend trên Windows ---
    if not cam.isOpened() and sys.platform == "win32":
        print("[WARN] Camera index 1 failed. Trying index 0 with DirectShow (CAP_DSHOW)...")
        cam = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
    if not cam.isOpened():
        print("[ERROR] Failed to open any camera device after multiple attempts. Check other apps/drivers.")
        return None
        
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)  # Width
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480) # Height
    print("[INFO] Camera initialized successfully.")
    return cam


def detect_faces(image, face_detector):
    """Detect faces in frame"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=4,
        minSize=(30, 30)
    )
    return gray, faces


def save_face_image(gray, x, y, w, h, user_path, user_id, count):
    """Save cropped face image"""
    face_roi = gray[y:y+h, x:x+w]
    file_path = os.path.join(user_path, f"User.{user_id}.{count}.jpg")
    cv2.imwrite(file_path, face_roi)
    return file_path


def create_user_info(user_path, user_id, user_name, count):
    """Create info.txt with metadata"""
    with open(os.path.join(user_path, "info.txt"), "w", encoding="utf-8") as f:
        f.write(f"Name: {user_name if user_name else 'User '+str(user_id)}\n")
        f.write(f"ID: {user_id}\n")
        f.write(f"Date: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Photos: {count}\n")


def take_photos(user_id, user_name=None):
    """
    Automatically capture photos of a user's face.
    """
    paths = setup_paths()
    face_detector = cv2.CascadeClassifier(paths["cascade_path"])

    if face_detector.empty():
        print("[ERROR] Failed to load face detector.")
        return False

    user_path = os.path.join(paths["dataset_path"], str(user_id))
    os.makedirs(user_path, exist_ok=True)

    # --- SỬA LỖI LOGIC: Gọi hàm camera và kiểm tra lỗi ---
    cam = initialize_camera()
    if cam is None:
        print("[FATAL] Camera initialization failed. Aborting photo capture.")
        return False 
    # ---------------------------------------------------
    
    print("=" * 50)
    if user_name:
        print(f"[INFO] Starting auto photo capture for User ID: {user_id} ({user_name})")
    else:
        print(f"[INFO] Starting auto photo capture for User ID: {user_id}")

    max_photos = 60
    min_face_size = 100
    delay = 0.2
    count = 0

    print(f"[INFO] Will automatically capture {max_photos} photos.")
    print("[INFO] Move your face slowly left/right for better angles.")
    print("[INFO] Starting in 3 seconds...")
    for i in range(3, 0, -1):
        print(f"{i}...")
        time.sleep(1)

    try:
        while count < max_photos:
            ret, frame = cam.read()
            if not ret:
                print("[ERROR] Failed to grab frame. Retrying...")
                time.sleep(0.5) # Chờ 0.5s rồi thử lại
                ret, frame = cam.read() # Thử đọc lại lần nữa
                if not ret:
                    print("[ERROR] Failed to grab frame again. Aborting.")
                    break # Vẫn lỗi thì thoát

            gray, faces = detect_faces(frame, face_detector)
            for (x, y, w, h) in faces:
                face_quality = "Good" if w >= min_face_size else "Too Small"
                color = (0, 255, 0) if face_quality == "Good" else (0, 0, 255)

                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, f"{face_quality}", (x, y-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

                if face_quality == "Good":
                    save_face_image(gray, x, y, w, h, user_path, user_id, count)
                    count += 1
                    print(f"[INFO] Saved image {count}/{max_photos}")
                    time.sleep(delay)
                    break  # Capture one face per frame

            cv2.putText(frame, f"Photos: {count}/{max_photos}",
                        (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.imshow("Auto Capture (ESC to exit)", frame)

            if cv2.waitKey(1) & 0xFF == 27:
                print("[INFO] Capture manually stopped (ESC pressed).")
                break

        print("[INFO] Capture completed successfully.")
    except Exception as e:
        print(f"[ERROR] Exception during capture: {str(e)}")
    finally:
        cam.release()
        cv2.destroyAllWindows()
        create_user_info(user_path, user_id, user_name, count)
        
        if count > 0:
            print("[INFO] Starting model training...")
            train_model()
        else:
            print("[WARN] No photos captured. Skipping model training.")

        print(f"[INFO] Total images captured: {count}")
        return count > 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python take_photos.py <user_id> [user_name]")
        sys.exit(1)

    user_id = sys.argv[1]
    user_name = sys.argv[2] if len(sys.argv) > 2 else None
    take_photos(user_id, user_name)