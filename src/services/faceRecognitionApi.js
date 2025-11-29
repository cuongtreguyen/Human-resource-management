// Face Recognition API Service
import { PY_API, JAVA_API, http } from './config';

class FaceRecognitionApi {
  // ============================================================
  // PYTHON API (PY_API) - Dieu khien camera, nhan dien, train model
  // ============================================================

  async checkSystemStatus() {
    try {
      const res = await http(`${PY_API}/api/status`, {}, 5000);
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
        `${PY_API}/api/recognize?type=${encodeURIComponent(type)}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        15000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('startRecognition failed:', err);
      return { status: 'error', message: 'Cham cong that bai. Vui long thu lai.' };
    }
  }

  async stopProcess() {
    try {
      const res = await http(
        `${PY_API}/api/stop`,
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
        `${PY_API}/api/take-photos`,
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
      return { status: 'error', message: 'Khong the bat dau chup anh tu backend' };
    }
  }

  async savePhotoToServer(userId, userName, photoNumber, imageData) {
    try {
      const res = await http(
        `${PY_API}/api/save-photo`,
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

  async trainModel() {
    try {
      const res = await http(
        `${PY_API}/api/train`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        60000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('trainModel failed:', err);
      return { status: 'error', message: 'Failed to train model' };
    }
  }

  // Lay danh sach nhan vien da dang ky (tu Python - doc folder datasets)
  async getRegisteredEmployees() {
    try {
      const res = await http(`${PY_API}/api/employees`, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getRegisteredEmployees failed:', err);
      return [];
    }
  }

  // Lay thong tin 1 nhan vien (tu Python)
  async getEmployee(employeeId) {
    try {
      const res = await http(`${PY_API}/api/employees/${encodeURIComponent(employeeId)}`, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getEmployee failed:', err);
      return null;
    }
  }

  // ============================================================
  // JAVA API (JAVA_API) - Doc du lieu cham cong tu Database
  // ============================================================

  async getEmployeeAttendance(employeeId, startDate = null, endDate = null) {
    if (!employeeId) {
      throw new Error('employeeId is required');
    }
    try {
      let url = `${JAVA_API}/attendance/employee/${encodeURIComponent(employeeId)}`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await http(url, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getEmployeeAttendance from Java failed, fallback to Python:', err);
      // Fallback to Python API neu Java khong chay
      return this._getEmployeeAttendanceFallback(employeeId, startDate, endDate);
    }
  }

  async _getEmployeeAttendanceFallback(employeeId, startDate, endDate) {
    try {
      let url = `${PY_API}/api/attendance/employee/${encodeURIComponent(employeeId)}`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await http(url, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getEmployeeAttendance fallback failed:', err);
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
      console.error('getTodayAttendance from Java failed, fallback to Python:', err);
      return this._getTodayAttendanceFallback();
    }
  }

  async _getTodayAttendanceFallback() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await http(`${PY_API}/api/attendance/daily?date=${today}`, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getTodayAttendance fallback failed:', err);
      return [];
    }
  }

  async getDailyAttendance(date) {
    try {
      const d = date || new Date().toISOString().split('T')[0];
      const res = await http(`${JAVA_API}/attendance/daily?date=${d}`, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getDailyAttendance from Java failed, fallback to Python:', err);
      return this._getDailyAttendanceFallback(date);
    }
  }

  async _getDailyAttendanceFallback(date) {
    try {
      const d = date || new Date().toISOString().split('T')[0];
      const res = await http(`${PY_API}/api/attendance/daily?date=${d}`, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getDailyAttendance fallback failed:', err);
      return [];
    }
  }

  async getAttendanceRange(startDate, endDate) {
    try {
      const res = await http(
        `${JAVA_API}/attendance/range?startDate=${startDate}&endDate=${endDate}`,
        {},
        15000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getAttendanceRange from Java failed, fallback to Python:', err);
      return this._getAttendanceRangeFallback(startDate, endDate);
    }
  }

  async _getAttendanceRangeFallback(startDate, endDate) {
    try {
      const res = await http(
        `${PY_API}/api/attendance/range?startDate=${startDate}&endDate=${endDate}`,
        {},
        15000
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getAttendanceRange fallback failed:', err);
      return [];
    }
  }

  async getAttendanceStats(date = null) {
    try {
      let url = `${JAVA_API}/attendance/stats`;
      if (date) url += `?date=${date}`;
      const res = await http(url, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getAttendanceStats from Java failed, fallback to Python:', err);
      return this._getAttendanceStatsFallback(date);
    }
  }

  async _getAttendanceStatsFallback(date) {
    try {
      let url = `${PY_API}/api/attendance/stats`;
      if (date) url += `?date=${date}`;
      const res = await http(url, {}, 10000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getAttendanceStats fallback failed:', err);
      return { totalEmployees: 0, present: 0, absent: 0, checkedOut: 0, stillWorking: 0 };
    }
  }

  async getMonthlyStats(employeeId, month = null) {
    try {
      let url = `${PY_API}/api/attendance/monthly-stats/${encodeURIComponent(employeeId)}`;
      if (month) url += `?month=${month}`;
      const res = await http(url, {}, 15000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getMonthlyStats failed:', err);
      return { stats: {}, records: [] };
    }
  }
}

export default new FaceRecognitionApi();
