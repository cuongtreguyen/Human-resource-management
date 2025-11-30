/**
 * System Logger - Lưu nhật ký hệ thống vào localStorage
 * Ghi lại tất cả các hành động quan trọng như thêm/sửa/xóa nhân viên, duyệt đơn, v.v.
 */

import { getRole, getUserInfo } from './auth';

const STORAGE_KEY = 'hr_system_logs';
const MAX_LOGS = 1000; // Giới hạn số lượng logs

/**
 * Lấy tất cả logs từ localStorage
 */
export const getAllLogs = () => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error reading logs:', error);
    return [];
  }
};

/**
 * Lưu logs vào localStorage
 */
const saveLogs = (logs) => {
  try {
    // Giới hạn số lượng logs, giữ lại logs mới nhất
    const limitedLogs = logs.slice(-MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedLogs));
  } catch (error) {
    console.error('Error saving logs:', error);
    // Nếu localStorage đầy, xóa logs cũ nhất
    if (error.name === 'QuotaExceededError') {
      const limitedLogs = logs.slice(-Math.floor(MAX_LOGS / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedLogs));
    }
  }
};

/**
 * Tạo log entry mới
 */
const createLogEntry = (type, action, details = {}, resource = null) => {
  const userInfo = getUserInfo();
  const userRole = getRole();
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    user: userInfo?.name || userInfo?.email || 'Unknown',
    userRole: userRole || 'unknown',
    type: type, // Create, Update, Delete, Approve, Reject, View
    action: action,
    details: details,
    resource: resource, // employee, leave, payroll, etc.
    ip: 'N/A', // Có thể thêm IP tracking sau
    userAgent: navigator.userAgent
  };
};

/**
 * Log các hành động
 */
export const logAction = (type, action, details = {}, resource = null) => {
  try {
    const logs = getAllLogs();
    const newLog = createLogEntry(type, action, details, resource);
    logs.push(newLog);
    saveLogs(logs);
    
    // Cũng có thể gửi lên server nếu cần
    // logToServer(newLog);
    
    return newLog;
  } catch (error) {
    console.error('Error logging action:', error);
    return null;
  }
};

/**
 * Log tạo mới nhân viên
 */
export const logCreateEmployee = (employeeId, employeeName) => {
  return logAction(
    'Create',
    `Tạo mới nhân viên: ${employeeName}`,
    { employeeId, employeeName },
    'employee'
  );
};

/**
 * Log cập nhật nhân viên
 */
export const logUpdateEmployee = (employeeId, employeeName, changes = {}) => {
  return logAction(
    'Update',
    `Cập nhật thông tin nhân viên: ${employeeName}`,
    { employeeId, employeeName, changes },
    'employee'
  );
};

/**
 * Log xóa nhân viên
 */
export const logDeleteEmployee = (employeeId, employeeName) => {
  return logAction(
    'Delete',
    `Xóa nhân viên: ${employeeName}`,
    { employeeId, employeeName },
    'employee'
  );
};

/**
 * Log duyệt đơn nghỉ phép
 */
export const logApproveLeave = (leaveId, employeeName, leaveDays) => {
  return logAction(
    'Approve',
    `Duyệt đơn nghỉ phép của: ${employeeName} (${leaveDays} ngày)`,
    { leaveId, employeeName, leaveDays },
    'leave'
  );
};

/**
 * Log từ chối đơn nghỉ phép
 */
export const logRejectLeave = (leaveId, employeeName, reason) => {
  return logAction(
    'Reject',
    `Từ chối đơn nghỉ phép của: ${employeeName}`,
    { leaveId, employeeName, rejectReason: reason },
    'leave'
  );
};

/**
 * Log tạo đơn nghỉ phép
 */
export const logCreateLeave = (leaveId, employeeName, leaveDays) => {
  return logAction(
    'Create',
    `Tạo đơn nghỉ phép: ${employeeName} (${leaveDays} ngày)`,
    { leaveId, employeeName, leaveDays },
    'leave'
  );
};

/**
 * Log thay đổi lương
 */
export const logUpdateSalary = (employeeId, employeeName, oldSalary, newSalary) => {
  return logAction(
    'Update',
    `Thay đổi lương của nhân viên: ${employeeName}`,
    { 
      employeeId, 
      employeeName, 
      oldSalary, 
      newSalary,
      change: newSalary - oldSalary
    },
    'payroll'
  );
};

/**
 * Log xem chi tiết
 */
export const logViewDetail = (resource, resourceId, resourceName) => {
  return logAction(
    'View',
    `Xem chi tiết ${resource}: ${resourceName}`,
    { resourceId, resourceName },
    resource
  );
};

/**
 * Xóa logs cũ (giữ lại logs trong N ngày)
 */
export const cleanOldLogs = (daysToKeep = 30) => {
  try {
    const logs = getAllLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const filteredLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= cutoffDate;
    });
    
    saveLogs(filteredLogs);
    return filteredLogs.length;
  } catch (error) {
    console.error('Error cleaning old logs:', error);
    return 0;
  }
};

/**
 * Xóa tất cả logs
 */
export const clearAllLogs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing logs:', error);
    return false;
  }
};

/**
 * Lấy logs với filter
 */
export const getFilteredLogs = (searchTerm = '', typeFilter = 'all', dateFilter = '') => {
  let logs = getAllLogs();
  
  // Filter theo type
  if (typeFilter && typeFilter !== 'all') {
    logs = logs.filter(log => log.type === typeFilter);
  }
  
  // Filter theo date
  if (dateFilter) {
    logs = logs.filter(log => {
      const logDate = new Date(log.timestamp).toLocaleDateString('vi-VN');
      const filterDate = new Date(dateFilter).toLocaleDateString('vi-VN');
      return logDate === filterDate;
    });
  }
  
  // Filter theo search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    logs = logs.filter(log => 
      log.user.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
    );
  }
  
  // Sắp xếp theo thời gian mới nhất trước
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export default {
  logAction,
  logCreateEmployee,
  logUpdateEmployee,
  logDeleteEmployee,
  logApproveLeave,
  logRejectLeave,
  logCreateLeave,
  logUpdateSalary,
  logViewDetail,
  getAllLogs,
  getFilteredLogs,
  cleanOldLogs,
  clearAllLogs
};

