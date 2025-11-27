"""
S3 Helper Functions - S3 + RAM Cache Implementation
Hỗ trợ upload/download files từ S3 mà không cần lưu local
"""
import os
import boto3
import io
import cv2
import numpy as np
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# AWS S3 Configuration
S3_ENDPOINT_URL = os.getenv('S3_ENDPOINT_URL', 'https://s3.ap-southeast-1.amazonaws.com')  # AWS S3 endpoint
S3_ACCESS_KEY_ID = os.getenv('S3_ACCESS_KEY_ID')  # AWS Access Key ID (required)
S3_SECRET_ACCESS_KEY = os.getenv('S3_SECRET_ACCESS_KEY')  # AWS Secret Access Key (required)
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'face-recognition-backend')
S3_REGION = os.getenv('S3_REGION', 'ap-southeast-1')  # AWS S3 region (required)

# S3 Folder Prefixes
S3_TRAIN_IMAGES_PREFIX = 'train-images/'
S3_MODELS_PREFIX = 'models/'
S3_RECOGNITION_IMAGES_PREFIX = 'recognition-images/'
S3_METADATA_PREFIX = 'metadata/'

# Global S3 client (singleton)
_s3_client = None

def get_s3_client():
    """Get or create AWS S3 client (singleton pattern)"""
    global _s3_client
    if _s3_client is None:
        try:
            # Validate required credentials
            if not S3_ACCESS_KEY_ID or not S3_SECRET_ACCESS_KEY:
                print("[S3 ERROR] S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are required")
                return None
            
            if not S3_REGION:
                print("[S3 ERROR] S3_REGION is required")
                return None
            
            # Config cho AWS S3 client
            config = boto3.session.Config(
                signature_version='s3v4',
                region_name=S3_REGION
            )
            
            # Tạo AWS S3 client
            client_params = {
                'aws_access_key_id': S3_ACCESS_KEY_ID,
                'aws_secret_access_key': S3_SECRET_ACCESS_KEY,
                'config': config
            }
            
            # Luôn dùng endpoint_url để đảm bảo dùng đúng region
            # Nếu không set, tự động tạo endpoint theo region
            if S3_ENDPOINT_URL:
                endpoint_url = S3_ENDPOINT_URL
            else:
                # Tự động tạo endpoint theo region
                endpoint_url = f"https://s3.{S3_REGION}.amazonaws.com"
            
            client_params['endpoint_url'] = endpoint_url
            _s3_client = boto3.client('s3', **client_params)
            
            # Log configuration
            print(f"[S3] AWS S3 client initialized")
            print(f"[S3] Endpoint: {endpoint_url}")
            print(f"[S3] Region: {S3_REGION}")
            print(f"[S3] Bucket: {S3_BUCKET_NAME}")
            
            _ensure_bucket_exists()
        except Exception as e:
            print(f"[S3 ERROR] Failed to create AWS S3 client: {e}")
            return None
    return _s3_client

def _ensure_bucket_exists():
    """Ensure the S3 bucket exists, creating it if necessary"""
    s3 = get_s3_client()
    if not s3:
        return False
    
    try:
        s3.head_bucket(Bucket=S3_BUCKET_NAME)
        print(f"[S3] Bucket '{S3_BUCKET_NAME}' already exists.")
        return True
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            try:
                s3.create_bucket(Bucket=S3_BUCKET_NAME)
                print(f"[S3] Bucket '{S3_BUCKET_NAME}' created successfully.")
                return True
            except ClientError as create_error:
                print(f"[S3 ERROR] Could not create bucket '{S3_BUCKET_NAME}': {create_error}")
                return False
        else:
            print(f"[S3 ERROR] Error checking bucket '{S3_BUCKET_NAME}': {e}")
            return False
    except Exception as e:
        print(f"[S3 ERROR] Unexpected error during bucket check: {e}")
        return False

# ========== Upload Functions ==========

def upload_bytes_to_s3(data_bytes, s3_key, content_type='application/octet-stream'):
    """
    Upload bytes directly to S3 (không cần lưu file local)
    
    Args:
        data_bytes: Bytes data to upload
        s3_key: S3 object key (path)
        content_type: Content type (e.g., 'image/jpeg', 'application/x-yaml')
    
    Returns:
        bool: True if successful, False otherwise
    """
    s3 = get_s3_client()
    if not s3:
        return False
    
    try:
        s3.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=data_bytes,
            ContentType=content_type
        )
        print(f"[S3] Uploaded {s3_key} ({len(data_bytes)} bytes)")
        return True
    except ClientError as e:
        print(f"[S3 ERROR] Failed to upload {s3_key}: {e}")
        return False
    except Exception as e:
        print(f"[S3 ERROR] Unexpected error during upload: {e}")
        return False

def upload_image_to_s3(image_array, s3_key, format='.jpg', quality=95):
    """
    Upload OpenCV image (numpy array) to S3 (không cần lưu file local)
    
    Args:
        image_array: NumPy array (OpenCV image)
        s3_key: S3 object key
        format: Image format ('.jpg', '.png')
        quality: JPEG quality (1-100)
    
    Returns:
        bool: True if successful
    """
    try:
        # Encode image to bytes
        encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality] if format == '.jpg' else []
        success, buffer = cv2.imencode(format, image_array, encode_params)
        
        if not success:
            print(f"[S3 ERROR] Failed to encode image")
            return False
        
        image_bytes = buffer.tobytes()
        content_type = 'image/jpeg' if format == '.jpg' else 'image/png'
        
        return upload_bytes_to_s3(image_bytes, s3_key, content_type)
    except Exception as e:
        print(f"[S3 ERROR] Failed to upload image: {e}")
        return False

def upload_face_image_to_s3(face_roi, user_id, count):
    """
    Upload face image to S3 (tự động tạo S3 key)
    
    Args:
        face_roi: NumPy array (cropped face image)
        user_id: User ID
        count: Photo count (0, 1, 2, ...)
    
    Returns:
        bool: True if successful
    """
    s3_key = f"{S3_TRAIN_IMAGES_PREFIX}{user_id}/User.{user_id}.{count}.jpg"
    return upload_image_to_s3(face_roi, s3_key, format='.jpg', quality=95)

# ========== Download Functions ==========

def download_bytes_from_s3(s3_key):
    """
    Download file from S3 as bytes (vào RAM, không lưu local)
    
    Args:
        s3_key: S3 object key
    
    Returns:
        bytes: File content as bytes, or None if error
    """
    s3 = get_s3_client()
    if not s3:
        return None
    
    try:
        response = s3.get_object(Bucket=S3_BUCKET_NAME, Key=s3_key)
        data = response['Body'].read()
        print(f"[S3] Downloaded {s3_key} ({len(data)} bytes)")
        return data
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'NoSuchKey':
            print(f"[S3] File not found: {s3_key}")
        else:
            print(f"[S3 ERROR] Failed to download {s3_key}: {e}")
        return None
    except Exception as e:
        print(f"[S3 ERROR] Unexpected error during download: {e}")
        return None

def download_image_from_s3(s3_key):
    """
    Download image from S3 and convert to OpenCV format (vào RAM)
    
    Args:
        s3_key: S3 object key
    
    Returns:
        numpy.ndarray: OpenCV image (BGR), or None if error
    """
    try:
        data = download_bytes_from_s3(s3_key)
        if not data:
            return None
        
        # Convert bytes to numpy array
        nparr = np.frombuffer(data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            print(f"[S3 ERROR] Failed to decode image from {s3_key}")
            return None
        
        return img
    except Exception as e:
        print(f"[S3 ERROR] Failed to download image: {e}")
        return None

# ========== List Functions ==========

def list_files_in_s3(prefix='', max_keys=1000):
    """
    List all files in S3 with given prefix
    
    Args:
        prefix: Folder prefix (e.g., 'train-images/')
        max_keys: Maximum number of keys to return
    
    Returns:
        list: List of S3 keys (paths)
    """
    s3 = get_s3_client()
    if not s3:
        return []
    
    try:
        keys = []
        paginator = s3.get_paginator('list_objects_v2')
        
        for page in paginator.paginate(Bucket=S3_BUCKET_NAME, Prefix=prefix, MaxKeys=max_keys):
            if 'Contents' in page:
                for obj in page['Contents']:
                    keys.append(obj['Key'])
        
        return keys
    except ClientError as e:
        print(f"[S3 ERROR] Failed to list objects with prefix '{prefix}': {e}")
        return []
    except Exception as e:
        print(f"[S3 ERROR] Unexpected error during listing: {e}")
        return []

def list_user_images(user_id, prefix=S3_TRAIN_IMAGES_PREFIX):
    """
    List all images for a specific user
    
    Args:
        user_id: User ID
        prefix: S3 prefix (default: train-images/)
    
    Returns:
        list: List of S3 keys for user images
    """
    user_prefix = f"{prefix}{user_id}/"
    return list_files_in_s3(user_prefix)

# ========== Check Functions ==========

def file_exists_in_s3(s3_key):
    """
    Check if a file exists in S3
    
    Args:
        s3_key: S3 object key
    
    Returns:
        bool: True if file exists
    """
    s3 = get_s3_client()
    if not s3:
        return False
    
    try:
        s3.head_object(Bucket=S3_BUCKET_NAME, Key=s3_key)
        return True
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            return False
        print(f"[S3 ERROR] Error checking file {s3_key}: {e}")
        return False
    except Exception as e:
        print(f"[S3 ERROR] Unexpected error: {e}")
        return False

# ========== Test Functions ==========

if __name__ == "__main__":
    """Test S3 connection and list existing folders"""
    print("=" * 50)
    print("Testing AWS S3 Connection...")
    print("=" * 50)
    
    # Test connection
    s3 = get_s3_client()
    if not s3:
        print("❌ Failed to initialize S3 client")
        exit(1)
    
    print("✅ S3 client initialized")
    
    # List existing folders (prefixes)
    print("\n[Test] Listing existing folders in S3...")
    folders = {
        'train-images': S3_TRAIN_IMAGES_PREFIX,
        'models': S3_MODELS_PREFIX,
        'recognition-images': S3_RECOGNITION_IMAGES_PREFIX,
        'metadata': S3_METADATA_PREFIX
    }
    
    for folder_name, prefix in folders.items():
        files = list_files_in_s3(prefix)
        print(f"  {folder_name}/: {len(files)} files")
        if len(files) > 0:
            # Show first 3 files as example
            for f in files[:3]:
                print(f"    - {f}")
            if len(files) > 3:
                print(f"    ... and {len(files) - 3} more files")
    
    print("\n" + "=" * 50)
    print("✅ S3 Connection Test Complete!")
    print("=" * 50)
    print("\nNote: Using existing folders:")
    print(f"  - {S3_TRAIN_IMAGES_PREFIX}")
    print(f"  - {S3_MODELS_PREFIX}")
    print(f"  - {S3_RECOGNITION_IMAGES_PREFIX}")
    print(f"  - {S3_METADATA_PREFIX}")

