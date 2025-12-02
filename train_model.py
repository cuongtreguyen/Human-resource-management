import cv2
import numpy as np
from PIL import Image
import os
import sys
import io
from s3_helper import (
    list_files_in_s3,
    download_image_from_s3,
    upload_bytes_to_s3,
    S3_TRAIN_IMAGES_PREFIX,
    S3_MODELS_PREFIX
)

def setup_paths():
    """
    Sets up necessary file paths and directories.

    Returns:
        dict: Dictionary containing all the important paths
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))

    paths = {
        "script_dir": script_dir,
        "dataset_path": os.path.join(script_dir, 'datasets'),
        "trainer_path": os.path.join(script_dir, 'trainer'),
        "cascade_path": os.path.join(script_dir, 'haarcascade_frontalface_default.xml')
    }

    os.makedirs(paths["trainer_path"], exist_ok=True)

    if not os.path.exists(paths["dataset_path"]):
        print(f"Error: Dataset directory not found at {paths['dataset_path']}")
        return None

    if not os.path.exists(paths["cascade_path"]):
        print(f"Error: Cascade file not found. Downloading it now...")
        import urllib.request
        url = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
        urllib.request.urlretrieve(url, paths["cascade_path"])
        print(f"Downloaded face detection file successfully!")

    return paths

def preprocess_image(img_numpy):
    """
    Applies preprocessing to improve image quality for training.

    Args:
        img_numpy: NumPy array of the image

    Returns:
        numpy.ndarray: Processed image
    """
    return cv2.equalizeHist(img_numpy)

def preprocess_face(face_roi):
    """
    Applies preprocessing to improve face quality for training.

    Args:
        face_roi: Face region of interest

    Returns:
        numpy.ndarray: Processed face
    """
    return cv2.GaussianBlur(face_roi, (5, 5), 0)

def get_user_images_from_s3(user_id, detector):
    """
    Load ảnh của 1 user cụ thể từ S3 vào RAM
    
    Args:
        user_id: ID của user cần train
        detector: Face detector
    
    Returns:
        tuple: Lists of face samples and their IDs (IDs sẽ là 0 cho tất cả vì chỉ có 1 user)
    """
    face_samples = []
    ids = []
    
    # List files của user cụ thể
    user_prefix = f"{S3_TRAIN_IMAGES_PREFIX}{user_id}/"
    user_files = list_files_in_s3(user_prefix)
    
    if len(user_files) == 0:
        print(f"[WARNING] No images found for user {user_id} in S3")
        return face_samples, ids
    
    print(f"[INFO] Processing user {user_id}: {len(user_files)} images")
    
    # Download và process từng ảnh (vào RAM)
    for s3_key in user_files:
        try:
            # Download từ S3 về bytes (vào RAM)
            img = download_image_from_s3(s3_key)
            if img is None:
                continue
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Preprocess
            gray = preprocess_image(gray)
            
            # Detect face
            faces = detector.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=4,
                minSize=(30, 30)
            )
            
            for (x, y, w, h) in faces:
                face_roi = gray[y:y+h, x:x+w]
                face_roi = preprocess_face(face_roi)
                
                face_samples.append(face_roi)
                ids.append(0)  # Tất cả faces của user này có ID=0 trong model riêng
                
        except Exception as e:
            print(f"[ERROR] Error processing {s3_key}: {e}")
    
    return face_samples, ids

def get_images_and_labels_from_s3(detector):
    """
    Load ảnh từ S3 vào RAM, không lưu local (DEPRECATED - dùng cho train chung)
    
    Args:
        detector: Face detector
    
    Returns:
        tuple: Lists of face samples and their IDs
    """
    face_samples = []
    ids = []
    
    # List tất cả files trong S3
    print("[INFO] Loading images from AWS S3...")
    all_files = list_files_in_s3(S3_TRAIN_IMAGES_PREFIX)
    
    if len(all_files) == 0:
        print("[ERROR] No images found in S3. Please capture photos first.")
        return face_samples, ids
    
    # Group theo user_id
    user_files = {}
    for s3_key in all_files:
        # Extract user_id: train-images/1/User.1.0.jpg
        parts = s3_key.split('/')
        if len(parts) >= 3 and parts[1].isdigit():
            user_id = int(parts[1])
            if user_id not in user_files:
                user_files[user_id] = []
            user_files[user_id].append(s3_key)
    
    print(f"[INFO] Found {len(user_files)} users with {len(all_files)} images in S3")
    
    # Download và process từng ảnh (vào RAM)
    for user_id, files in user_files.items():
        print(f"[INFO] Processing user {user_id}: {len(files)} images")
        for s3_key in files:
            try:
                # Download từ S3 về bytes (vào RAM)
                img = download_image_from_s3(s3_key)
                if img is None:
                    continue
                
                # Convert to grayscale
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                
                # Preprocess
                gray = preprocess_image(gray)
                
                # Detect face
                faces = detector.detectMultiScale(
                    gray,
                    scaleFactor=1.1,
                    minNeighbors=4,
                    minSize=(30, 30)
                )
                
                for (x, y, w, h) in faces:
                    face_roi = gray[y:y+h, x:x+w]
                    face_roi = preprocess_face(face_roi)
                    
                    face_samples.append(face_roi)
                    ids.append(user_id)
                    
            except Exception as e:
                print(f"[ERROR] Error processing {s3_key}: {e}")
    
    return face_samples, ids

def get_images_and_labels(dataset_path, detector):
    """
    Gets face images and their corresponding labels from the dataset (local - deprecated).
    Use get_images_and_labels_from_s3() instead.

    Args:
        dataset_path: Path to the dataset directory
        detector: Face detector

    Returns:
        tuple: Lists of face samples and their IDs
    """
    image_paths = []

    for user_id in os.listdir(dataset_path):
        user_path = os.path.join(dataset_path, user_id)
        if os.path.isdir(user_path):
            for img_file in os.listdir(user_path):
                if img_file.endswith('.jpg') or img_file.endswith('.png'):
                    image_paths.append(os.path.join(user_path, img_file))

    face_samples = []
    ids = []

    for image_path in image_paths:
        try:
            pil_img = Image.open(image_path).convert('L')
            img_numpy = np.array(pil_img, 'uint8')

            img_numpy = preprocess_image(img_numpy)

            user_id = int(os.path.split(image_path)[0].split(os.path.sep)[-1])

            faces = detector.detectMultiScale(
                img_numpy,
                scaleFactor=1.1,
                minNeighbors=4,
                minSize=(30, 30)
            )

            for (x, y, w, h) in faces:
                face_roi = img_numpy[y:y+h, x:x+w]
                face_roi = preprocess_face(face_roi)

                face_samples.append(face_roi)
                ids.append(user_id)

        except Exception as e:
            print(f"Error processing image {image_path}: {str(e)}")

    return face_samples, ids

def save_user_details(trainer_path, dataset_path, users, face_count):
    """
    Saves details about the trained users to a file.

    Args:
        trainer_path: Path to save the details
        dataset_path: Path to the dataset
        users: Set of user IDs
        face_count: Number of face samples
    """
    with open(os.path.join(trainer_path, 'users.txt'), 'w') as f:
        f.write(f"Total users: {len(users)}\n")
        f.write(f"Total samples: {face_count}\n")
        f.write("User IDs: " + ", ".join(map(str, sorted(users))) + "\n")

        f.write("\nUser Details:\n")
        for user_id in sorted(users):
            user_path = os.path.join(dataset_path, str(user_id))
            info_path = os.path.join(user_path, "info.txt")
            if os.path.exists(info_path):
                with open(info_path, 'r') as info_file:
                    f.write(f"User {user_id}:\n")
                    for line in info_file:
                        f.write(f"  {line.strip()}\n")
            else:
                f.write(f"User {user_id}: No additional information\n")

def train_user_model(user_id, paths, detector):
    """
    Train model riêng cho 1 user cụ thể
    
    Args:
        user_id: ID của user cần train
        paths: Dictionary chứa các paths
        detector: Face detector
    
    Returns:
        bool: True nếu train thành công
    """
    try:
        recognizer = cv2.face.LBPHFaceRecognizer_create(
            radius=2,
            neighbors=8,
            grid_x=8,
            grid_y=8,
            threshold=100
        )

        # Load ảnh của user này từ S3
        faces, ids = get_user_images_from_s3(user_id, detector)

        if len(faces) == 0 or len(ids) == 0:
            print(f"[ERROR] No face samples found for user {user_id}")
            return False

        print(f"[INFO] Training user {user_id} with {len(faces)} face samples")

        # Train trong RAM (tất cả faces có ID=0 vì chỉ có 1 user)
        recognizer.train(faces, np.array(ids))

        # Save model tạm thời vào local để convert thành bytes
        # (OpenCV LBPHFaceRecognizer.write() cần file path, không thể save trực tiếp thành bytes)
        model_filename = f'user_{user_id}.yml'
        model_path = os.path.join(paths["trainer_path"], model_filename)
        recognizer.write(model_path)

        # Đọc model thành bytes
        with open(model_path, 'rb') as f:
            model_bytes = f.read()

        # Upload model lên S3
        s3_model_key = f"{S3_MODELS_PREFIX}user_{user_id}.yml"
        print(f"[INFO] Uploading model to AWS S3: {s3_model_key}")
        upload_success = upload_bytes_to_s3(model_bytes, s3_model_key, 'application/x-yaml')
        
        # Xóa file tạm local ngay sau khi upload
        try:
            if os.path.exists(model_path):
                os.remove(model_path)
                print(f"[INFO] Cleaned up temporary model file: {model_path}")
        except Exception as e:
            print(f"[WARN] Error cleaning up temporary model file: {e}")
        
        if upload_success:
            print(f"[INFO] ✅ Model uploaded successfully: {s3_model_key}")
            return True
        else:
            print(f"[ERROR] Failed to upload model to S3")
            return False

    except Exception as e:
        print(f"[ERROR] Error training user {user_id}: {str(e)}")
        return False

def train_model(user_id=None):
    """
    Trains face recognition models - CHIA RIÊNG TỪNG USER
    
    Nếu user_id=None: Train tất cả users (mỗi user 1 model riêng)
    Nếu user_id được chỉ định: Chỉ train user đó

    This function:
    1. Finds all users or specific user
    2. Trains a separate model for each user
    3. Saves each model as models/user_{id}.yml

    Args:
        user_id: Optional. Nếu None thì train tất cả, nếu có thì chỉ train user đó

    Returns:
        bool: True if training was successful, False otherwise
    """
    # Setup paths and check required files
    paths = setup_paths()
    if paths is None:
        return False

    try:
        detector = cv2.CascadeClassifier(paths["cascade_path"])

        if user_id is not None:
            # Train 1 user cụ thể
            print(f"[INFO] Training model for user {user_id}...")
            return train_user_model(user_id, paths, detector)
        else:
            # Train tất cả users
            print("=" * 70)
            print("Training face recognition models (CHIA RIÊNG TỪNG USER)...")
            print("Loading images from AWS S3...")
            print("=" * 70)

            # List tất cả users có ảnh trong S3
            all_files = list_files_in_s3(S3_TRAIN_IMAGES_PREFIX)
            
            if len(all_files) == 0:
                print("[ERROR] No images found in S3. Please capture photos first.")
                return False

            # Group theo user_id
            user_files = {}
            for s3_key in all_files:
                parts = s3_key.split('/')
                if len(parts) >= 3 and parts[1].isdigit():
                    uid = int(parts[1])
                    if uid not in user_files:
                        user_files[uid] = []
                    user_files[uid].append(s3_key)

            if len(user_files) == 0:
                print("[ERROR] No users found in S3")
                return False

            print(f"[INFO] Found {len(user_files)} users: {sorted(user_files.keys())}")
            print("")

            # Train từng user riêng
            success_count = 0
            failed_users = []

            for uid in sorted(user_files.keys()):
                print(f"[INFO] Training user {uid}...")
                if train_user_model(uid, paths, detector):
                    success_count += 1
                    print(f"[INFO] ✅ User {uid} trained successfully\n")
                else:
                    failed_users.append(uid)
                    print(f"[INFO] ❌ User {uid} training failed\n")

            print("=" * 70)
            print(f"[INFO] Training completed:")
            print(f"  ✅ Success: {success_count}/{len(user_files)} users")
            if failed_users:
                print(f"  ❌ Failed: {failed_users}")
            print("=" * 70)

            return success_count > 0

    except Exception as e:
        print(f"[ERROR] Error during training: {str(e)}")
        return False

if __name__ == "__main__":
    import sys
    # Cho phép train 1 user cụ thể: python train_model.py <user_id>
    # Hoặc train tất cả: python train_model.py
    user_id = None
    if len(sys.argv) > 1:
        try:
            user_id = int(sys.argv[1])
            print(f"[INFO] Training only user {user_id}")
        except ValueError:
            print(f"[ERROR] Invalid user_id: {sys.argv[1]}. Must be a number.")
            sys.exit(1)
    
    train_model(user_id)
