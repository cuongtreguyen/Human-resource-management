// Field-Level Permissions Utilities
// Kiểm tra quyền truy cập từng field dựa trên role và attributes

import { getRole, getUserInfo } from './auth';

/**
 * Kiểm tra xem user có quyền xem salary không
 * @param {string} userRole - Role của user hiện tại
 * @param {string} employeeDepartment - Phòng ban của nhân viên
 * @param {string} userDepartment - Phòng ban của user (nếu có)
 * @returns {boolean}
 */
export const canViewSalary = (userRole, employeeDepartment = null, userDepartment = null) => {
  // Admin: xem được tất cả
  if (userRole === 'admin') return true;
  
  // Accountant: cần xem để tính lương
  if (userRole === 'accountant') return true;
  
  // Manager: chỉ xem nhân viên trong phòng ban của mình (nếu có thông tin)
  if (userRole === 'manager') {
    if (userDepartment && employeeDepartment) {
      return userDepartment === employeeDepartment;
    }
    // Nếu không có thông tin department, deny by default (an toàn hơn)
    return false;
  }
  
  // Employee: chỉ xem salary của chính mình (được xử lý ở component level)
  if (userRole === 'employee') return false;
  
  return false;
};

/**
 * Kiểm tra xem user có quyền xem personal information không
 * Personal info: ID card, address, phone, dateOfBirth, gender, maritalStatus
 * @param {string} userRole - Role của user hiện tại
 * @returns {boolean}
 */
export const canViewPersonalInfo = (userRole) => {
  // Chỉ Admin và Manager được xem personal info
  return userRole === 'admin' || userRole === 'manager';
};

/**
 * Kiểm tra xem user có quyền xem emergency contact không
 * @param {string} userRole - Role của user hiện tại
 * @returns {boolean}
 */
export const canViewEmergencyContact = (userRole) => {
  // Chỉ Admin và Manager được xem emergency contact
  return userRole === 'admin' || userRole === 'manager';
};

/**
 * Kiểm tra xem user có quyền xem bank information không
 * @param {string} userRole - Role của user hiện tại
 * @returns {boolean}
 */
export const canViewBankInfo = (userRole) => {
  // Chỉ Admin và Accountant được xem bank info (cần cho payroll)
  return userRole === 'admin' || userRole === 'accountant';
};

/**
 * Kiểm tra xem user có quyền edit employee không
 * @param {string} userRole - Role của user hiện tại
 * @returns {boolean}
 */
export const canEditEmployee = (userRole) => {
  // Chỉ Admin được edit
  return userRole === 'admin';
};

/**
 * Kiểm tra xem user có quyền delete employee không
 * @param {string} userRole - Role của user hiện tại
 * @returns {boolean}
 */
export const canDeleteEmployee = (userRole) => {
  // Chỉ Admin được delete
  return userRole === 'admin';
};

/**
 * Mask sensitive data - Ẩn một phần thông tin nhạy cảm
 * @param {string} value - Giá trị cần mask
 * @param {number} visibleChars - Số ký tự hiển thị ở cuối
 * @returns {string}
 */
export const maskSensitiveData = (value, visibleChars = 4) => {
  if (!value || value.length <= visibleChars) return '***';
  const masked = '*'.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
};

/**
 * Lấy role hiện tại từ auth
 * @returns {string|null}
 */
export const getCurrentRole = () => {
  return getRole();
};

/**
 * Lấy department của user hiện tại (nếu có)
 * @returns {string|null}
 */
export const getCurrentUserDepartment = () => {
  const userInfo = getUserInfo();
  return userInfo?.department || null;
};

