// Face Recognition Portal API Service
// Connects to Python Flask backend

const API_BASE_URL = 'http://127.0.0.1:5000/';

class FaceRecognitionPortalApi {
  // Check system status
  async checkSystemStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking system status:', error);
      return {
        status: 'error',
        message: 'Cannot connect to face recognition system',
        last_updated: Date.now() / 1000
      };
    }
  }

  // Start photo capture for a user
  async takePhotos(userId, userName) {
    try {
      const response = await fetch(`${API_BASE_URL}api/take-photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          name: userName
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting photo capture:', error);
      return {
        status: 'error',
        message: 'Failed to start photo capture. Please try again.'
      };
    }
  }


  // Start face recognition
  async startRecognition(type = 'check_in') {
    try {
      const response = await fetch(`${API_BASE_URL}api/recognize?type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting recognition:', error);
      return {
        status: 'error',
        message: 'Failed to start recognition. Please try again.'
      };
    }
  }

  // Stop current process
  async stopProcess() {
    try {
      const response = await fetch(`${API_BASE_URL}api/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error stopping process:', error);
      return {
        status: 'error',
        message: 'Failed to stop process. Please try again.'
      };
    }
  }

  // Get registered employees (mock data for now)
  async getRegisteredEmployees() {
    // This would typically come from the Python backend
    // For now, return mock data
    return [
      { id: 1, code: 'EMP001', name: 'Nguyễn Văn A', department: 'IT', position: 'Developer' },
      { id: 2, code: 'EMP002', name: 'Trần Thị B', department: 'HR', position: 'Manager' },
      { id: 3, code: 'EMP003', name: 'Lê Văn C', department: 'Finance', position: 'Accountant' }
    ];
  }

  // Get today's attendance (mock data for now)
  async getTodayAttendance() {
    // This would typically come from the Python backend
    // For now, return mock data
    return [
      { 
        id: 1, 
        employeeCode: 'EMP001', 
        employeeName: 'Nguyễn Văn A', 
        checkIn: '08:30', 
        checkOut: '17:30', 
        status: 'present' 
      },
      { 
        id: 2, 
        employeeCode: 'EMP002', 
        employeeName: 'Trần Thị B', 
        checkIn: '09:00', 
        checkOut: null, 
        status: 'present' 
      }
    ];
  }

  // Register employee (mock implementation)
  async registerEmployee(employeeData) {
    // This would typically send data to Python backend
    // For now, return success
    return {
      success: true,
      message: 'Employee registered successfully'
    };
  }

  // Recognize face (mock implementation)
  async recognizeFace(imageFile) {
    // This would typically send image to Python backend
    // For now, return mock recognition result
    return {
      success: true,
      employee: {
        id: 1,
        code: 'EMP001',
        name: 'Nguyễn Văn A',
        department: 'IT',
        position: 'Developer'
      },
      confidence: 95.5,
      timestamp: new Date().toISOString()
    };
  }

  // Record attendance (mock implementation)
  async recordAttendance(employeeId) {
    // This would typically send data to Python backend
    // For now, return success
    return {
      success: true,
      message: 'Attendance recorded successfully'
    };
  }

  // Train model
  async trainModel() {
    try {
      const response = await fetch(`${API_BASE_URL}api/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Train model failed:', error);
      return {
        status: 'error',
        message: 'Failed to train model'
      };
    }
  }
}

// Create and export a singleton instance
const faceRecognitionPortalApi = new FaceRecognitionPortalApi();
export default faceRecognitionPortalApi;
