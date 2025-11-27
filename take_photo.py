import cv2
import os
import sys
import time
from s3_helper import upload_face_image_to_s3, S3_TRAIN_IMAGES_PREFIX


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
        urllib.request.urlretrieve(url, paths["cascade_path"])
        print(f"[INFO] Downloaded face cascade successfully!")

    os.makedirs(paths["dataset_path"], exist_ok=True)
    return paths


def initialize_camera():
    """
    Initialize webcam
    Thử nhiều backend và index để tìm camera
    """
    import os
    # Suppress OpenCV warnings
    os.environ['OPENCV_LOG_LEVEL'] = 'SILENT'
    cv2.setLogLevel(0)
    
    # Thử các backend theo thứ tự ưu tiên
    backends = [
        (cv2.CAP_MSMF, "MSMF"),
        (cv2.CAP_ANY, "Default"),
        (cv2.CAP_DSHOW, "DirectShow"),
    ]
    
    for backend, name in backends:
        for index in range(3):  # Thử index 0, 1, 2
            try:
                cam = cv2.VideoCapture(index, backend)
                if cam.isOpened():
                    # Test đọc frame
                    ret, frame = cam.read()
                    if ret and frame is not None and frame.size > 0:
                        cam.set(3, 640)  # Width
                        cam.set(4, 480)  # Height
                        return cam
                    cam.release()
            except Exception:
                pass
    
    # Nếu không tìm thấy, trả về camera index 0 (sẽ báo lỗi sau)
    return cv2.VideoCapture(0)


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


def save_face_image_to_s3(gray, x, y, w, h, user_id, count):
    """
    Save cropped face image directly to AWS S3 (không lưu local)
    Upload tự động khi chụp ảnh
    """
    face_roi = gray[y:y+h, x:x+w]
    
    # Upload trực tiếp lên S3
    success = upload_face_image_to_s3(face_roi, user_id, count)
    
    if success:
        s3_key = f"{S3_TRAIN_IMAGES_PREFIX}{user_id}/User.{user_id}.{count}.jpg"
        return s3_key
    return None


def create_user_info(user_path, user_id, user_name, count):
    """Create info.txt with metadata"""
    with open(os.path.join(user_path, "info.txt"), "w", encoding="utf-8") as f:
        f.write(f"Name: {user_name if user_name else 'User '+str(user_id)}\n")
        f.write(f"ID: {user_id}\n")
        f.write(f"Date: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Photos: {count}\n")


def take_photos(user_id, user_name=None):
    """
    Automatically capture 50 photos of a user's face
    without needing to press any key.
    Upload ảnh trực tiếp lên AWS S3 (không lưu local)
    """
    paths = setup_paths()
    face_detector = cv2.CascadeClassifier(paths["cascade_path"])

    if face_detector.empty():
        print("[ERROR] Failed to load face detector.")
        return False

    # Không tạo folder local nữa, upload trực tiếp lên S3
    print(f"[INFO] Images will be uploaded to AWS S3: {S3_TRAIN_IMAGES_PREFIX}{user_id}/")

    cam = initialize_camera()
    print("=" * 50)
    if user_name:
        print(f"[INFO] Starting auto photo capture for User ID: {user_id} ({user_name})")
    else:
        print(f"[INFO] Starting auto photo capture for User ID: {user_id}")

    max_photos = 50
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
                print("[ERROR] Failed to grab frame.")
                break

            gray, faces = detect_faces(frame, face_detector)
            for (x, y, w, h) in faces:
                face_quality = "Good" if w >= min_face_size else "Too Small"
                color = (0, 255, 0) if face_quality == "Good" else (0, 0, 255)

                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, f"{face_quality}", (x, y-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

                if face_quality == "Good":
                    # Upload trực tiếp lên S3 (không lưu local)
                    s3_key = save_face_image_to_s3(gray, x, y, w, h, user_id, count)
                    if s3_key:
                        count += 1
                        print(f"[INFO] Uploaded to S3: {s3_key} ({count}/{max_photos})")
                    else:
                        print(f"[ERROR] Failed to upload image {count} to S3")
                    time.sleep(delay)
                    break  # Capture one face per frame

            # Show progress on frame
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
        # Không tạo info.txt local nữa, có thể lưu metadata lên S3 nếu cần
        print(f"[INFO] Total images uploaded to AWS S3: {count}")
        if count > 0:
            print(f"[INFO] All images saved to: {S3_TRAIN_IMAGES_PREFIX}{user_id}/")
            print(f"[INFO] View in AWS S3: {S3_TRAIN_IMAGES_PREFIX}{user_id}/")
        return count > 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python take_photos.py <user_id> [user_name]")
        sys.exit(1)

    user_id = sys.argv[1]
    user_name = sys.argv[2] if len(sys.argv) > 2 else None
    take_photos(user_id, user_name)
