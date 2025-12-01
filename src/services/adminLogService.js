// Admin Log Service - Lưu nhật ký khi admin sửa đổi dữ liệu
import logsApi from './logsApi';

const STORAGE_KEY = 'hrm_admin_logs';

class AdminLogService {
  constructor() {
    this.logs = this.loadFromStorage();
  }

  // Load logs from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Save logs to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  // Get current user from auth (using sessionStorage for per-tab sessions)
  getCurrentUser() {
    try {
      // Import dynamically to avoid circular dependency
      const userInfoStr = sessionStorage.getItem('hrm_user_info');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo.name || userInfo.employeeId || 'admin';
      }
      return 'admin';
    } catch {
      return 'admin';
    }
  }

  // Create a new log entry
  async log(type, action, details = '', targetId = null, targetName = null) {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: this.getCurrentUser(),
      type: type, // 'Create', 'Update', 'Delete', 'View'
      action: action,
      details: details,
      targetId: targetId,
      targetName: targetName,
      ip: '192.168.1.1', // Demo IP
      userAgent: navigator.userAgent
    };

    // Save to local storage
    this.logs.unshift(logEntry);
    // Keep only last 500 logs
    if (this.logs.length > 500) {
      this.logs = this.logs.slice(0, 500);
    }
    this.saveToStorage();

    // Try to save to API (optional)
    try {
      await logsApi.createLog(logEntry);
    } catch (error) {
      console.log('API log failed, saved locally:', error);
    }

    return logEntry;
  }

  // Log employee update
  async logEmployeeUpdate(employeeId, employeeName, changes) {
    const changesStr = Object.entries(changes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return this.log(
      'Update',
      `Cập nhật thông tin nhân viên: ${employeeName}`,
      changesStr,
      employeeId,
      employeeName
    );
  }

  // Log employee create
  async logEmployeeCreate(employeeId, employeeName) {
    return this.log(
      'Create',
      `Thêm nhân viên mới: ${employeeName}`,
      `ID: ${employeeId}`,
      employeeId,
      employeeName
    );
  }

  // Log employee delete
  async logEmployeeDelete(employeeId, employeeName) {
    return this.log(
      'Delete',
      `Xóa nhân viên: ${employeeName}`,
      `ID: ${employeeId}`,
      employeeId,
      employeeName
    );
  }

  // Log payroll update
  async logPayrollUpdate(employeeId, employeeName, month, changes) {
    return this.log(
      'Update',
      `Cập nhật lương nhân viên: ${employeeName} (${month})`,
      changes,
      employeeId,
      employeeName
    );
  }

  // Log attendance update
  async logAttendanceUpdate(employeeId, employeeName, date, changes) {
    return this.log(
      'Update',
      `Sửa chấm công: ${employeeName} (${date})`,
      changes,
      employeeId,
      employeeName
    );
  }

  // Log leave approval
  async logLeaveApproval(leaveId, employeeName, status) {
    return this.log(
      'Update',
      `${status === 'approved' ? 'Duyệt' : 'Từ chối'} đơn nghỉ phép: ${employeeName}`,
      `Trạng thái: ${status}`,
      leaveId,
      employeeName
    );
  }

  // Log OT approval
  async logOTApproval(otId, employeeName, status) {
    return this.log(
      'Update',
      `${status === 'approved' ? 'Duyệt' : 'Từ chối'} đăng ký OT: ${employeeName}`,
      `Trạng thái: ${status}`,
      otId,
      employeeName
    );
  }

  // Log settings change
  async logSettingsChange(settingName, oldValue, newValue) {
    return this.log(
      'Update',
      `Thay đổi cài đặt: ${settingName}`,
      `${oldValue} → ${newValue}`,
      null,
      settingName
    );
  }

  // Log task update
  async logTaskUpdate(taskId, taskTitle, changes) {
    return this.log(
      'Update',
      `Cập nhật task: ${taskTitle}`,
      changes,
      taskId,
      taskTitle
    );
  }

  // Log evaluation
  async logEvaluationUpdate(employeeId, employeeName, rating) {
    return this.log(
      'Update',
      `Đánh giá nhân viên: ${employeeName}`,
      `Điểm: ${rating}/5`,
      employeeId,
      employeeName
    );
  }

  // Get all logs
  getLogs(type = 'all', search = '', limit = 100) {
    let filtered = this.logs;

    if (type !== 'all') {
      filtered = filtered.filter(log => log.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        (log.targetName && log.targetName.toLowerCase().includes(searchLower))
      );
    }

    return filtered.slice(0, limit);
  }

  // Get logs by date
  getLogsByDate(date) {
    return this.logs.filter(log => log.timestamp.startsWith(date));
  }

  // Get stats
  getStats() {
    return {
      total: this.logs.length,
      create: this.logs.filter(l => l.type === 'Create').length,
      update: this.logs.filter(l => l.type === 'Update').length,
      delete: this.logs.filter(l => l.type === 'Delete').length,
      view: this.logs.filter(l => l.type === 'View').length
    };
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.saveToStorage();
  }
}

export default new AdminLogService();
