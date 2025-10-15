// // Attendance API Service
// const SPRING_BOOT_API_URL = 'http://localhost:5000/api';

// class AttendanceApi {
  
//   // Lấy attendance theo ngày
//   async getDailyAttendance(date) {
//     try {
//       const dateStr = date || new Date().toISOString().split('T')[0];
//       const response = await fetch(`${SPRING_BOOT_API_URL}/attendance/daily?date=${dateStr}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load daily attendance');
//     } catch (error) {
//       console.error('Failed to load daily attendance:', error);
//       return [];
//     }
//   }

//   // Lấy attendance trong khoảng thời gian
//   async getAttendanceRange(startDate, endDate) {
//     try {
//       const response = await fetch(`${SPRING_BOOT_API_URL}/attendance/range?startDate=${startDate}&endDate=${endDate}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load attendance range');
//     } catch (error) {
//       console.error('Failed to load attendance range:', error);
//       return [];
//     }
//   }

//   // Lấy attendance của một nhân viên
//   async getEmployeeAttendance(employeeId, startDate = null, endDate = null) {
//     try {
//       let url = `${SPRING_BOOT_API_URL}/attendance/employee/${employeeId}`;
//       if (startDate && endDate) {
//         url += `?startDate=${startDate}&endDate=${endDate}`;
//       }
      
//       const response = await fetch(url);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load employee attendance');
//     } catch (error) {
//       console.error('Failed to load employee attendance:', error);
//       return [];
//     }
//   }

//   // Lấy thống kê attendance
//   async getAttendanceStats(date = null) {
//     try {
//       let url = `${SPRING_BOOT_API_URL}/attendance/stats`;
//       if (date) {
//         url += `?date=${date}`;
//       }
      
//       const response = await fetch(url);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load attendance stats');
//     } catch (error) {
//       console.error('Failed to load attendance stats:', error);
//       return {
//         totalEmployees: 0,
//         present: 0,
//         absent: 0,
//         checkedOut: 0,
//         stillWorking: 0
//       };
//     }
//   }

//   // Gửi dữ liệu nhận diện thành công đến Spring Boot
//   async sendRecognitionData(recognitionData) {
//     try {
//       const response = await fetch(`${SPRING_BOOT_API_URL}/attendance/face-recognition/recognition-success`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(recognitionData)
//       });
      
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to send recognition data');
//     } catch (error) {
//       console.error('Failed to send recognition data:', error);
//       return {
//         success: false,
//         message: 'Failed to send recognition data'
//       };
//     }
//   }
// }

// export default new AttendanceApi();
// src/services/attendanceApi.js
// src/services/attendanceApi.js
// src/services/attendanceApi.js
import { JAVA_API } from './config';

class AttendanceApi {
  async getDailyAttendance(date) {
    try {
      const d = date || new Date().toISOString().split('T')[0];
      const res = await fetch(`${JAVA_API}/attendance/daily?date=${d}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getDailyAttendance failed:', e);
      return [];
    }
  }

  async getAttendanceRange(startDate, endDate) {
    try {
      const res = await fetch(`${JAVA_API}/attendance/range?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getAttendanceRange failed:', e);
      return [];
    }
  }

  async getEmployeeAttendance(employeeId, startDate = null, endDate = null) {
    try {
      let url = `${JAVA_API}/attendance/employee/${employeeId}`;
      if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getEmployeeAttendance failed:', e);
      return [];
    }
  }

  async getAttendanceStats(date = null) {
    try {
      let url = `${JAVA_API}/attendance/stats`;
      if (date) url += `?date=${date}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getAttendanceStats failed:', e);
      return { totalEmployees: 0, present: 0, absent: 0, checkedOut: 0, stillWorking: 0 };
    }
  }

  // Endpoint Spring đã định nghĩa: /attendance/face-recognition/recognition-success
  async sendRecognitionData(recognitionData) {
    try {
      const res = await fetch(`${JAVA_API}/attendance/face-recognition/recognition-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recognitionData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('sendRecognitionData failed:', e);
      return { success: false, message: 'Failed to send recognition data' };
    }
  }
}

export default new AttendanceApi();
