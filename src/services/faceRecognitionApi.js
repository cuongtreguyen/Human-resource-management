// Face Recognition API Service
const API_BASE_URL = 'http://localhost:5000/api';

class FaceRecognitionApi {
  // Check system status
  async checkSystemStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/face-recognition/status`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to check system status');
    } catch (error) {
      console.error('System status check failed:', error);
      throw error;
    }
  }

  // Register new employee face
  async registerEmployee(employeeData, faceImage) {
    try {
      const formData = new FormData();
      formData.append('employeeCode', employeeData.employeeCode);
      formData.append('fullName', employeeData.fullName);
      formData.append('department', employeeData.department);
      formData.append('position', employeeData.position);
      formData.append('faceImage', faceImage);

      const response = await fetch(`${API_BASE_URL}/face-recognition/register`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to register employee');
    } catch (error) {
      console.error('Employee registration failed:', error);
      throw error;
    }
  }

  // Train recognition model
  async trainModel() {
    try {
      const response = await fetch(`${API_BASE_URL}/face-recognition/train`, {
        method: 'POST',
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to train model');
    } catch (error) {
      console.error('Model training failed:', error);
      throw error;
    }
  }

  // Recognize face for attendance
  async recognizeFace(faceImage) {
    try {
      const formData = new FormData();
      formData.append('faceImage', faceImage);

      const response = await fetch(`${API_BASE_URL}/face-recognition/recognize`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to recognize face');
    } catch (error) {
      console.error('Face recognition failed:', error);
      throw error;
    }
  }

  // Get registered employees
  async getRegisteredEmployees() {
    try {
      const response = await fetch(`${API_BASE_URL}/face-recognition/employees`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to get employees');
    } catch (error) {
      console.error('Failed to load employees:', error);
      throw error;
    }
  }

  // Get today's attendance
  async getTodayAttendance() {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/today`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to get attendance');
    } catch (error) {
      console.error('Failed to load attendance:', error);
      throw error;
    }
  }

  // Record attendance
  async recordAttendance(employeeId, attendanceType = 'CHECK_IN') {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          attendanceType,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to record attendance');
    } catch (error) {
      console.error('Attendance recording failed:', error);
      throw error;
    }
  }
}

export default new FaceRecognitionApi();
