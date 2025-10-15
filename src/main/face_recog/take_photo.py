import cv2
import os
import sys
import time
from train_model import train_model

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
    """Initialize webcam"""
    cam = cv2.VideoCapture(0)
    cam.set(3, 640)  # Width
    cam.set(4, 480)  # Height
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
    Automatically capture 50 photos of a user's face
    without needing to press any key.
    """
    paths = setup_paths()
    face_detector = cv2.CascadeClassifier(paths["cascade_path"])

    if face_detector.empty():
        print("[ERROR] Failed to load face detector.")
        return False

    user_path = os.path.join(paths["dataset_path"], str(user_id))
    os.makedirs(user_path, exist_ok=True)

    cam = initialize_camera()
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
                    save_face_image(gray, x, y, w, h, user_path, user_id, count)
                    count += 1
                    print(f"[INFO] Saved image {count}/{max_photos}")
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
        create_user_info(user_path, user_id, user_name, count)
        train_model()
        print(f"[INFO] Total images captured: {count}")
        return count > 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python take_photos.py <user_id> [user_name]")
        sys.exit(1)

    user_id = sys.argv[1]
    user_name = sys.argv[2] if len(sys.argv) > 2 else None
    take_photos(user_id, user_name)
