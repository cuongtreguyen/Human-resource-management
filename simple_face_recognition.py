import cv2
import os
import json
import time
from datetime import datetime


class SimpleFaceRecognition:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
        self.known_faces = {}
        self.load_known_faces()

    def load_known_faces(self):
        """Load known faces from JSON file"""
        try:
            if os.path.exists('known_faces.json'):
                with open('known_faces.json', 'r') as f:
                    self.known_faces = json.load(f)
                print(f"Loaded {len(self.known_faces)} known faces")
        except Exception as e:
            print(f"Error loading known faces: {e}")
            self.known_faces = {}

    def save_known_faces(self):
        """Save known faces to JSON file"""
        try:
            with open('known_faces.json', 'w') as f:
                json.dump(self.known_faces, f, indent=2)
            print("Known faces saved")
        except Exception as e:
            print(f"Error saving known faces: {e}")

    def detect_faces(self, frame):
        """Detect faces in frame"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        return faces

    def register_face(self, employee_id, employee_name):
        """Register a new face"""
        print(f"Registering face for {employee_name} (ID: {employee_id})")

        # Create directory for employee
        face_dir = f"faces/{employee_id}"
        os.makedirs(face_dir, exist_ok=True)

        # Initialize camera
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open camera")
            return False

        photo_count = 0
        max_photos = 4

        print("Press 's' to take a photo, 'q' to quit")

        while photo_count < max_photos:
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame")
                break

            faces = self.detect_faces(frame)

            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(frame, f"Capturing {photo_count + 1}/{max_photos}",
                            (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

                if len(faces) > 0:
                    photo_path = os.path.join(face_dir, f"photo_{photo_count + 1}.jpg")
                    cv2.imwrite(photo_path, frame)

                    face_data = {
                        "employee_id": employee_id,
                        "employee_name": employee_name,
                        "photo_path": photo_path,
                        "timestamp": datetime.now().isoformat(),
                        "face_count": len(faces)
                    }

                    self.known_faces[f"{employee_id}_{photo_count + 1}"] = face_data
                    photo_count += 1
                    print(f"[AUTO] Photo {photo_count}/{max_photos} captured")
                    time.sleep(1.0)  # delay 1 second before next shot
                    break  # capture one face per frame

            cv2.imshow('Auto Face Registration', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

        # Save known faces
        self.save_known_faces()

        print(f"Registration completed. {photo_count} photos saved.")
        return photo_count > 0

    def recognize_face(self, frame):
        """Simple face recognition based on face detection"""
        faces = self.detect_faces(frame)

        if len(faces) > 0:
            # For simplicity, return the first registered employee
            # In a real system, you would compare face features
            if self.known_faces:
                first_face = list(self.known_faces.values())[0]
                return {
                    "recognized": True,
                    "employee_id": first_face["employee_id"],
                    "employee_name": first_face["employee_name"],
                    "confidence": 0.95
                }

        return {"recognized": False}

    def start_attendance(self, attendance_type="clockin"):
        """Start attendance recognition"""
        print(f"Starting attendance recognition for {attendance_type}")

        # Initialize camera
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open camera")
            return False

        print("Face recognition active. Press 'q' to quit.")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame")
                break

            # Recognize faces
            result = self.recognize_face(frame)

            # Draw results
            faces = self.detect_faces(frame)
            for (x, y, w, h) in faces:
                if result["recognized"]:
                    color = (0, 255, 0)  # Green for recognized
                    label = f"{result['employee_name']} - {attendance_type}"
                else:
                    color = (0, 0, 255)  # Red for unknown
                    label = "Unknown"

                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

            # Display frame
            cv2.imshow('Face Recognition - Attendance', frame)

            # Check for quit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        return True


def main():
    fr = SimpleFaceRecognition()

    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "register":
            if len(sys.argv) >= 3:
                employee_id = sys.argv[2]
                employee_name = sys.argv[3] if len(sys.argv) > 3 else f"Employee_{employee_id}"
                fr.register_face(employee_id, employee_name)
            else:
                print("Usage: python simple_face_recognition.py register <employee_id> [employee_name]")

        elif command == "recognize":
            attendance_type = sys.argv[2] if len(sys.argv) > 2 else "clockin"
            fr.start_attendance(attendance_type)

        else:
            print("Usage: python simple_face_recognition.py [register|recognize] [options]")
    else:
        print("Usage: python simple_face_recognition.py [register|recognize] [options]")


if __name__ == "__main__":
    main()
