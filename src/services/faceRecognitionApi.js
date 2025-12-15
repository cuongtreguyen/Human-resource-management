// Face Recognition API Service
import { PY_API, JAVA_API, http } from './config';

class FaceRecognitionApi {
  // --- Hệ thống (Flask) ---
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
      return { status: 'error', message: '❌ Chấm công thất bại. Vui lòng thử lại.' };
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
      return { status: 'error', message: 'Không thể bắt đầu chụp ảnh từ backend' };
    }
  }

  async trainModel() {
    try {
      const res = await http(
        `${PY_API}/api/train`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        60000 // Train model có thể mất thời gian lâu
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('trainModel failed:', err);
      return { status: 'error', message: 'Không thể train model. Vui lòng thử lại.' };
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

  async getEmployeeAttendance(employeeId) {
    if (!employeeId) {
      throw new Error('employeeId is required');
    }

    // Ưu tiên gọi Python API (realtime từ S3/file JSON) - giống Admin
    // Fallback sang Java API nếu Python không available
    try {
      const res = await http(
        `${PY_API}/api/attendance/employee/${encodeURIComponent(employeeId)}`,
        {},
        10000
      );
      if (res.ok) {
        const data = await res.json();
        // Transform Python format sang format chuẩn
        return data.map(item => ({
          id: item.id,
          date: item.date,
          checkIn: item.check_in || item.checkIn,
          checkOut: item.check_out || item.checkOut,
          check_in: item.check_in,
          check_out: item.check_out,
          employeeName: item.name || item.employeeName
        }));
      }
    } catch (err) {
      console.warn('Python API failed, falling back to Java API:', err.message);
    }

    // Fallback: Gọi Java API
    const res = await http(
      `${JAVA_API}/attendance/employee/${encodeURIComponent(employeeId)}`,
      {},
      10000
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
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