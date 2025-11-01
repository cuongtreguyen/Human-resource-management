import cv2
import numpy as np
import os
import sys
import time
import json
import requests
from datetime import datetime
from collections import Counter
import dlib
import face_recognition
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array


class AdvancedFaceRecognition:
    def __init__(self):
        self.setup_paths()
        self.load_models()
        self.setup_emotion_model()

    def setup_paths(self):
        """Setup all necessary file paths"""
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.paths = {
            "script_dir": self.script_dir,
            "trainer_path": os.path.join(self.script_dir, 'trainer'),
            "dataset_path": os.path.join(self.script_dir, 'datasets'),
            "model_path": os.path.join(self.script_dir, 'trainer', 'trainer.yml'),
            "cascade_path": os.path.join(self.script_dir, 'haarcascade_frontalface_default.xml'),
            "attendance_path": os.path.join(self.script_dir, 'attendance'),
            "emotion_model_path": os.path.join(self.script_dir, 'emotion_model.h5'),
            "shape_predictor_path": os.path.join(self.script_dir, 'shape_predictor_68_face_landmarks.dat')
        }

        # Create directories
        for path in [self.paths["trainer_path"], self.paths["dataset_path"], self.paths["attendance_path"]]:
            os.makedirs(path, exist_ok=True)

        # Download required files if not exist
        self.download_required_files()

    def download_required_files(self):
        """Download required model files"""
        import urllib.request

        # Download Haar cascade if not exists
        if not os.path.exists(self.paths["cascade_path"]):
            print("Downloading Haar cascade...")
            url = "https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml"
            urllib.request.urlretrieve(url, self.paths["cascade_path"])

        # Download shape predictor if not exists
        if not os.path.exists(self.paths["shape_predictor_path"]):
            print("Downloading shape predictor...")
            url = "http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2"
            urllib.request.urlretrieve(url, self.paths["shape_predictor_path"] + ".bz2")
            import bz2
            with bz2.BZ2File(self.paths["shape_predictor_path"] + ".bz2", 'rb') as f_in:
                with open(self.paths["shape_predictor_path"], 'wb') as f_out:
                    f_out.write(f_in.read())
            os.remove(self.paths["shape_predictor_path"] + ".bz2")

    def load_models(self):
        """Load face recognition models"""
        try:
            # Load OpenCV face recognizer
            if os.path.exists(self.paths["model_path"]):
                self.recognizer = cv2.face.LBPHFaceRecognizer_create()
                self.recognizer.read(self.paths["model_path"])
            else:
                self.recognizer = None

            # Load dlib face detector and shape predictor
            self.detector = dlib.get_frontal_face_detector()
            self.predictor = dlib.shape_predictor(self.paths["shape_predictor_path"])

            # Load OpenCV cascade
            self.face_cascade = cv2.CascadeClassifier(self.paths["cascade_path"])

        except Exception as e:
            print(f"Error loading models: {e}")

    def setup_emotion_model(self):
        """Setup emotion recognition model"""
        try:
            if os.path.exists(self.paths["emotion_model_path"]):
                self.emotion_model = load_model(self.paths["emotion_model_path"])
            else:
                # Create a simple emotion model if not exists
                self.create_simple_emotion_model()

            self.emotion_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprised']

        except Exception as e:
            print(f"Error setting up emotion model: {e}")
            self.emotion_model = None

    def create_simple_emotion_model(self):
        """Create a simple emotion recognition model"""
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D

        model = Sequential([
            Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
            Conv2D(32, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),

            Conv2D(64, (3, 3), activation='relu'),
            Conv2D(64, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),

            Flatten(),
            Dense(256, activation='relu'),
            Dropout(0.5),
            Dense(7, activation='softmax')
        ])

        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        model.save(self.paths["emotion_model_path"])
        self.emotion_model = model

    def detect_faces_dlib(self, gray):
        """Detect faces using dlib (more accurate)"""
        faces = self.detector(gray)
        return faces

    def get_facial_landmarks(self, gray, face):
        """Get facial landmarks for a face"""
        landmarks = self.predictor(gray, face)
        return landmarks

    def draw_landmarks(self, img, landmarks):
        """Draw facial landmarks on image"""
        for i in range(68):
            x = landmarks.part(i).x
            y = landmarks.part(i).y
            cv2.circle(img, (x, y), 1, (255, 0, 255), -1)  # Pink dots

        # Draw jawline
        jaw_points = list(range(0, 17))
        for i in range(len(jaw_points) - 1):
            pt1 = (landmarks.part(jaw_points[i]).x, landmarks.part(jaw_points[i]).y)
            pt2 = (landmarks.part(jaw_points[i + 1]).x, landmarks.part(jaw_points[i + 1]).y)
            cv2.line(img, pt1, pt2, (0, 255, 0), 1)  # Green line

    def predict_emotion(self, face_roi):
        """Predict emotion from face region"""
        if self.emotion_model is None:
            return "neutral", 0.75

        try:
            # Resize and preprocess
            face_roi = cv2.resize(face_roi, (48, 48))
            face_roi = face_roi.astype("float") / 255.0
            face_roi = img_to_array(face_roi)
            face_roi = np.expand_dims(face_roi, axis=0)

            # Predict
            predictions = self.emotion_model.predict(face_roi)[0]
            emotion_idx = np.argmax(predictions)
            confidence = predictions[emotion_idx]

            return self.emotion_labels[emotion_idx], confidence

        except Exception as e:
            print(f"Error predicting emotion: {e}")
            return "neutral", 0.75

    def recognize_face_opencv(self, face_roi):
        """Recognize face using OpenCV LBPH"""
        if self.recognizer is None:
            return None, None

        try:
            id, confidence = self.recognizer.predict(face_roi)
            confidence_value = max(0, min(100, 100 - confidence))
            return id, confidence_value
        except:
            return None, None

    def load_user_names(self):
        """Load user names from dataset"""
        user_names = {}
        if not os.path.exists(self.paths["dataset_path"]):
            return user_names

        for user_id in os.listdir(self.paths["dataset_path"]):
            user_path = os.path.join(self.paths["dataset_path"], user_id)
            if os.path.isdir(user_path):
                info_path = os.path.join(user_path, "info.txt")
                if os.path.exists(info_path):
                    with open(info_path, 'r') as info_file:
                        for line in info_file:
                            if line.startswith("Name:"):
                                user_names[int(user_id)] = line.replace("Name:", "").strip()
                                break
        return user_names

    def send_recognition_data(self, user_id, name, emotion, confidence, recognition_type):
        """Send recognition data to Spring Boot API"""
        try:
            recognition_data = {
                "id": str(user_id),
                "name": name,
                "emotion": emotion,
                "confidence": f"{confidence:.2f}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "type": recognition_type
            }

            response = requests.post(
                "http://localhost:8080/api/face-recognition/recognition-success",
                json=recognition_data,
                timeout=1
            )

            return response.status_code == 200

        except Exception as e:
            print(f"Error sending data: {e}")
            return False

    def run_recognition(self, recognition_type="default"):
        """Main recognition loop with advanced features"""
        if self.recognizer is None:
            print("Error: No trained model found. Please train the model first.")
            return False

        cam = cv2.VideoCapture(0)
        cam.set(3, 640)
        cam.set(4, 480)

        user_names = self.load_user_names()
        recognized_users = set()
        recent_predictions = {}
        prediction_window = 10

        print("Starting advanced face recognition...")
        print("Features: Face detection, landmarks, emotion recognition")
        print("Press 'q' to quit")

        while True:
            ret, img = cam.read()
            if not ret:
                break

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)

            # Detect faces using dlib (more accurate)
            faces = self.detect_faces_dlib(gray)

            for face in faces:
                # Get face coordinates
                x, y, w, h = face.left(), face.top(), face.width(), face.height()

                # Draw blue bounding box
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)

                # Get facial landmarks
                landmarks = self.get_facial_landmarks(gray, face)
                self.draw_landmarks(img, landmarks)

                # Extract face ROI for recognition
                face_roi = gray[y:y + h, x:x + w]

                # Face recognition
                user_id, confidence = self.recognize_face_opencv(face_roi)

                # Emotion recognition
                emotion, emotion_confidence = self.predict_emotion(face_roi)

                # Display results
                if user_id is not None and confidence > 50:
                    name = user_names.get(user_id, f"User {user_id}")

                    # Display name and confidence
                    cv2.putText(img, name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                    cv2.putText(img, f"{confidence:.0f}%", (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (255, 255, 0), 1)

                    # Display emotion
                    emotion_text = f"{emotion} ({emotion_confidence:.2f})"
                    cv2.putText(img, emotion_text, (x, y + h + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

                    # Send to API if not already recognized
                    if user_id not in recognized_users:
                        success = self.send_recognition_data(user_id, name, emotion, confidence, recognition_type)
                        if success:
                            recognized_users.add(user_id)
                            print(f"Recognized: {name} - {emotion} ({emotion_confidence:.2f})")
                else:
                    cv2.putText(img, "Unknown", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            cv2.imshow('Advanced Face Recognition', img)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cam.release()
        cv2.destroyAllWindows()
        return True


def main():
    if len(sys.argv) > 1:
        recognition_type = sys.argv[1]
    else:
        recognition_type = "default"

    recognizer = AdvancedFaceRecognition()
    recognizer.run_recognition(recognition_type)


if __name__ == "__main__":
    main()
