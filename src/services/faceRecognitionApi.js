// // Face Recognition API Service
// const API_BASE_URL = 'http://localhost:5000/api';
// const SPRING_BOOT_API_URL = 'http://localhost:8080/api';

// class FaceRecognitionApi {

  
//   // Register new employee face
//   async registerEmployee(employeeData) {
//     try {
//       // For now, return success without calling Python API
//       // In a real implementation, this would call the Python backend
//       console.log('Registering employee:', employeeData);
      
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       return {
//         success: true,
//         message: 'Employee registered successfully',
//         employee: employeeData
//       };
//     } catch (error) {
//       console.error('Employee registration failed:', error);
//       return {
//         success: false,
//         message: 'Registration failed. Please try again.'
//       };
//     }
//   }


//   // Recognize face for attendance
//   async recognizeFace(faceImage) {
//     try {
//       // For now, return mock recognition result
//       console.log('Recognizing face from image');
      
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       return {
//         success: true,
//         employee: {
//           id: 1,
//           code: 'EMP001',
//           name: 'Nguyễn Văn A',
//           department: 'IT',
//           position: 'Developer'
//         },
//         confidence: 95.5,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('Face recognition failed:', error);
//       return {
//         success: false,
//         message: 'Face recognition failed. Please try again.'
//       };
//     }
//   }

//   // Get registered employees
//   async getRegisteredEmployees() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/employees`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load employees');
//     } catch (error) {
//       console.error('Failed to load employees:', error);
//       // Return mock data if API fails
//       return [
//         { employee_id: 1, employee_code: 'EMP001', name: 'Nguyễn Văn A', face_count: 4 },
//         { employee_id: 2, employee_code: 'EMP002', name: 'Trần Thị B', face_count: 3 },
//         { employee_id: 3, employee_code: 'EMP003', name: 'Lê Văn C', face_count: 5 }
//       ];
//     }
//   }

//   // Get today's attendance
//   async getTodayAttendance() {
//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const response = await fetch(`${SPRING_BOOT_API_URL}/attendance/daily?date=${today}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load attendance');
//     } catch (error) {
//       console.error('Failed to load attendance:', error);
//       // Return mock data as fallback
//       return [
//         { 
//           employeeId: '1', 
//           employeeName: 'Nguyễn Văn A', 
//           checkIn: '08:30:00', 
//           checkOut: '17:30:00', 
//           status: 'present' 
//         },
//         { 
//           employeeId: '2', 
//           employeeName: 'Trần Thị B', 
//           checkIn: '09:00:00', 
//           checkOut: null, 
//           status: 'present' 
//         }
//       ];
//     }
//   }

//   // Record attendance
//   async recordAttendance(employeeId, attendanceType = 'CHECK_IN') {
//     try {
//       // For now, return success without calling Python API
//       console.log('Recording attendance:', { employeeId, attendanceType });
      
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       return {
//         success: true,
//         message: 'Attendance recorded successfully',
//         employee: {
//           id: employeeId,
//           name: 'Nguyễn Văn A',
//           code: 'EMP001'
//         },
//         status: attendanceType,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('Attendance recording failed:', error);
//       return {
//         success: false,
//         message: 'Failed to record attendance. Please try again.'
//       };
//     }
//   }

//   // Save photo to server
//   async savePhotoToServer(userId, userName, photoNumber, imageData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/save-photo`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: userId,
//           userName: userName,
//           photoNumber: photoNumber,
//           imageData: imageData
//         })
//       });
      
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to save photo to server');
//     } catch (error) {
//       console.error('Error saving photo to server:', error);
//       throw error;
//     }
//   }

//   // Check in method
//   async checkIn(faceImage) {
//     try {
//       const recognitionResult = await this.recognizeFace(faceImage);
//       if (recognitionResult.success) {
//         return await this.recordAttendance(recognitionResult.employee.id, 'CHECK_IN');
//       }
//       return recognitionResult;
//     } catch (error) {
//       console.error('Check-in failed:', error);
//       return {
//         success: false,
//         message: 'Check-in failed. Please try again.'
//       };
//     }
//   }

//   // Take photos for registration
//   async takePhotos(userId, userName) {
//     try {
//       console.log('Requesting backend to start auto-capture...');
//       const response = await fetch(`${API_BASE_URL}/take-photos`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: userId, name: userName })
//       });

//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to start photo capture');
//     } catch (error) {
//       console.error('Error starting backend photo capture:', error);
//       return { status: 'error', message: 'Không thể bắt đầu chụp ảnh từ backend' };
//     }
//   }


//   // Start recognition process
//   async startRecognition(type = 'clockin') {
//     try {
//       console.log('Starting recognition for:', type);
      
//       const response = await fetch(`${API_BASE_URL}/recognize?type=${type}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (response.ok) {
//         const result = await response.json();
        
//         return result;
//       }
//       throw new Error('Failed to start recognition');
//     } catch (error) {
//       console.error('Error starting recognition:', error);
//       return {
//         status: 'error',
//         message: '❌ Chấm công thất bại. Vui lòng thử lại.'
//       };
//     }
//   }

//   // Stop current process
//   async stopProcess() {
//     try {
//       console.log('Stopping current process...');
      
//       const response = await fetch(`${API_BASE_URL}/stop`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to stop process');
//     } catch (error) {
//       console.error('Error stopping process:', error);
//       return {
//         status: 'error',
//         message: 'Failed to stop process. Please try again.'
//       };
//     }
//   }
// }

// src/services/faceRecognitionApi.js
import { PY_API, JAVA_API, http } from './config';

class FaceRecognitionApi {
  // --- Hệ thống (Flask) ---
  async checkSystemStatus() {
    try {
      const res = await http(`${PY_API}/status`, {}, 5000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('checkSystemStatus failed:', err);
      return {
        status: 'error',
        message: 'Cannot connect to face recognition system',
        last_updated: Date.now() / 1000
      };
    }
  }

  async startRecognition(type = 'clockin') {
    try {
      const res = await http(
        `${PY_API}/recognize?type=${encodeURIComponent(type)}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        15000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('startRecognition failed:', err);
      return { status: 'error', message: '❌ Chấm công thất bại. Vui lòng thử lại.' };
    }
  }

  async stopProcess() {
    try {
      const res = await http(
        `${PY_API}/stop`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        8000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('stopProcess failed:', err);
      return { status: 'error', message: 'Failed to stop process. Please try again.' };
    }
  }

  async takePhotos(userId, userName = '') {
    try {
      const res = await http(
        `${PY_API}/take-photos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, name: userName })
        },
        15000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('takePhotos failed:', err);
      return { status: 'error', message: 'Không thể bắt đầu chụp ảnh từ backend' };
    }
  }

  async savePhotoToServer(userId, userName, photoNumber, imageData) {
    try {
      const res = await http(
        `${PY_API}/save-photo`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, userName, photoNumber, imageData })
        },
        15000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('savePhotoToServer failed:', err);
      return { status: 'error', message: 'Failed to save photo to server' };
    }
  }

  // --- Dữ liệu demo/phụ trợ ---
  async getRegisteredEmployees() {
    try {
      // Flask hiện chưa có endpoint này -> trả mock
      return [
        { id: 1, code: 'EMP001', name: 'Nguyễn Văn A', department: 'IT', position: 'Developer' },
        { id: 2, code: 'EMP002', name: 'Trần Thị B', department: 'HR', position: 'Manager' },
        { id: 3, code: 'EMP003', name: 'Lê Văn C', department: 'Finance', position: 'Accountant' }
      ];
    } catch {
      return [];
    }
  }

  async getTodayAttendance() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await http(`${JAVA_API}/attendance/daily?date=${today}`, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getTodayAttendance failed:', err);
      return [];
    }
  }
}

export default new FaceRecognitionApi();
