#!/usr/bin/env python3
"""
Setup script for Face Recognition Environment
This script will install all required dependencies and setup the environment
"""

import subprocess
import sys
import os
import urllib.request
import bz2

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False

def download_dlib_wheel():
    """Download and install dlib wheel for Windows"""
    if sys.platform == "win32":
        print("Downloading dlib wheel for Windows...")
        try:
            # Try to install dlib using pip first
            subprocess.check_call([sys.executable, "-m", "pip", "install", "dlib"])
            print("✅ dlib installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dlib. Please install manually:")
            print("   pip install dlib")
            return False
    return True

def download_required_files():
    """Download required model files"""
    print("Downloading required model files...")
    
    # Download Haar cascade
    cascade_path = "haarcascade_frontalface_default.xml"
    if not os.path.exists(cascade_path):
        print("Downloading Haar cascade...")
        try:
            urllib.request.urlretrieve(
                "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml",
                cascade_path
            )
            print("✅ Haar cascade downloaded!")
        except Exception as e:
            print(f"❌ Error downloading Haar cascade: {e}")
    
    # Download shape predictor
    shape_predictor_path = "shape_predictor_68_face_landmarks.dat"
    if not os.path.exists(shape_predictor_path):
        print("Downloading shape predictor...")
        try:
            urllib.request.urlretrieve(
                "http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2",
                shape_predictor_path + ".bz2"
            )
            
            # Extract bz2 file
            with bz2.BZ2File(shape_predictor_path + ".bz2", 'rb') as f_in:
                with open(shape_predictor_path, 'wb') as f_out:
                    f_out.write(f_in.read())
            
            # Remove bz2 file
            os.remove(shape_predictor_path + ".bz2")
            print("Shape predictor downloaded!")
        except Exception as e:
            print(f"Error downloading shape predictor: {e}")

def create_directories():
    """Create necessary directories"""
    print("Creating directories...")
    directories = ["datasets", "trainer", "attendance", "Classifiers"]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def test_installation():
    """Test if all components are working"""
    print("Testing installation...")
    
    try:
        import cv2
        print("✅ OpenCV imported successfully")
    except ImportError:
        print("❌ OpenCV import failed")
        return False
    
    try:
        import dlib
        print("✅ dlib imported successfully")
    except ImportError:
        print("❌ dlib import failed")
        return False
    
    try:
        import face_recognition
        print("✅ face_recognition imported successfully")
    except ImportError:
        print("❌ face_recognition import failed")
        return False
    
    try:
        import tensorflow as tf
        print("✅ TensorFlow imported successfully")
    except ImportError:
        print("❌ TensorFlow import failed")
        return False
    
    # Test camera
    try:
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print("✅ Camera is accessible")
            cap.release()
        else:
            print("⚠️  Camera not accessible (may not be available)")
    except Exception as e:
        print(f"⚠️  Camera test failed: {e}")
    
    return True

def main():
    """Main setup function"""
    print("Setting up Face Recognition Environment...")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Install requirements
    if not install_requirements():
        print("Setup failed at requirements installation")
        return False
    
    # Download dlib wheel for Windows
    if not download_dlib_wheel():
        print("Setup failed at dlib installation")
        return False
    
    # Download required files
    download_required_files()
    
    # Test installation
    if test_installation():
        print("\nSetup completed successfully!")
        print("You can now run the face recognition system.")
        print("\nTo start:")
        print("1. Run: python face_recognition_api.py (for API server)")
        print("2. Or run: python advanced_face_recognition.py (for direct recognition)")
        return True
    else:
        print("\nSetup completed with some issues.")
        print("Please check the error messages above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
