// // Logs API Service
// const SPRING_BOOT_API_URL = 'http://localhost:8080/api';

// class LogsApi {
  
//   // Lấy tất cả logs với filter
//   async getLogs(search = '', type = 'all', date = '') {
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append('search', search);
//       if (type && type !== 'all') params.append('type', type);
//       if (date) params.append('date', date);
      
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs?${params.toString()}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load logs');
//     } catch (error) {
//       console.error('Failed to load logs:', error);
//       return [];
//     }
//   }

//   // Lấy logs theo trang
//   async getLogsPaginated(search = '', type = 'all', date = '', page = 0, size = 10) {
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append('search', search);
//       if (type && type !== 'all') params.append('type', type);
//       if (date) params.append('date', date);
//       params.append('page', page);
//       params.append('size', size);
      
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs/paginated?${params.toString()}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load paginated logs');
//     } catch (error) {
//       console.error('Failed to load paginated logs:', error);
//       return {
//         logs: [],
//         total: 0,
//         page: 0,
//         size: size,
//         totalPages: 0
//       };
//     }
//   }

//   // Lấy thống kê logs
//   async getLogStats(search = '', type = 'all', date = '') {
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append('search', search);
//       if (type && type !== 'all') params.append('type', type);
//       if (date) params.append('date', date);
      
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs/stats?${params.toString()}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load log stats');
//     } catch (error) {
//       console.error('Failed to load log stats:', error);
//       return {
//         total: 0,
//         view: 0,
//         navigate: 0,
//         update: 0,
//         create: 0,
//         delete: 0,
//         error: 0,
//         attendance: 0
//       };
//     }
//   }

//   // Lấy logs theo employee
//   async getLogsByEmployee(employeeId) {
//     try {
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs/employee/${employeeId}`);
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to load employee logs');
//     } catch (error) {
//       console.error('Failed to load employee logs:', error);
//       return [];
//     }
//   }

//   // Tạo log mới
//   async createLog(logData) {
//     try {
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(logData)
//       });
      
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to create log');
//     } catch (error) {
//       console.error('Failed to create log:', error);
//       return {
//         success: false,
//         message: 'Failed to create log'
//       };
//     }
//   }

//   // Khởi tạo logs mẫu
//   async initializeSampleLogs() {
//     try {
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs/initialize`, {
//         method: 'POST'
//       });
      
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to initialize sample logs');
//     } catch (error) {
//       console.error('Failed to initialize sample logs:', error);
//       return {
//         success: false,
//         message: 'Failed to initialize sample logs'
//       };
//     }
//   }

//   // Xóa logs cũ
//   async cleanOldLogs(daysToKeep = 30) {
//     try {
//       const response = await fetch(`${SPRING_BOOT_API_URL}/logs/cleanup?daysToKeep=${daysToKeep}`, {
//         method: 'DELETE'
//       });
      
//       if (response.ok) {
//         return await response.json();
//       }
//       throw new Error('Failed to clean old logs');
//     } catch (error) {
//       console.error('Failed to clean old logs:', error);
//       return {
//         success: false,
//         message: 'Failed to clean old logs'
//       };
//     }
//   }
// }

// export default new LogsApi();

// src/services/logsApi.js
// src/services/logsApi.js
// src/services/logsApi.js
import { JAVA_API } from './config';

class LogsApi {
  async getLogs(search = '', type = 'all', date = '') {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type && type !== 'all') params.append('type', type);
      if (date) params.append('date', date);

      const res = await fetch(`${JAVA_API}/logs?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getLogs failed:', e);
      return [];
    }
  }

  async getLogsPaginated(search = '', type = 'all', date = '', page = 0, size = 10) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type && type !== 'all') params.append('type', type);
      if (date) params.append('date', date);
      params.append('page', page);
      params.append('size', size);

      const res = await fetch(`${JAVA_API}/logs/paginated?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getLogsPaginated failed:', e);
      return { logs: [], total: 0, page: 0, size, totalPages: 0 };
    }
  }

  async getLogStats(search = '', type = 'all', date = '') {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (type && type !== 'all') params.append('type', type);
      if (date) params.append('date', date);

      const res = await fetch(`${JAVA_API}/logs/stats?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getLogStats failed:', e);
      return { total: 0, view: 0, navigate: 0, update: 0, create: 0, delete: 0, error: 0, attendance: 0 };
    }
  }

  async getLogsByEmployee(employeeId) {
    try {
      const res = await fetch(`${JAVA_API}/logs/employee/${employeeId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('getLogsByEmployee failed:', e);
      return [];
    }
  }

  async createLog(logData) {
    try {
      const res = await fetch(`${JAVA_API}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('createLog failed:', e);
      return { success: false, message: 'Failed to create log' };
    }
  }

  async initializeSampleLogs() {
    try {
      const res = await fetch(`${JAVA_API}/logs/initialize`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('initializeSampleLogs failed:', e);
      return { success: false, message: 'Failed to initialize sample logs' };
    }
  }

  async cleanOldLogs(daysToKeep = 30) {
    try {
      const res = await fetch(`${JAVA_API}/logs/cleanup?daysToKeep=${daysToKeep}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('cleanOldLogs failed:', e);
      return { success: false, message: 'Failed to clean old logs' };
    }
  }
}

export default new LogsApi();
