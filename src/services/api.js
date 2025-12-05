// src/services/api.js
import { http, JAVA_API } from './config.js';

/**
 * Lấy hồ sơ nhân viên theo ID số (1, 2, 3...)
 * GET /api/employees/{id}/profile
 */
export const getEmployeeProfile = async (employeeId) => {
  const response = await http(`${JAVA_API}/employees/${employeeId}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi server'}`);
  }

  const result = await response.json();
  if (result.success && result.data) {
    return result.data;
  }
  throw new Error(result.message || 'Dữ liệu không hợp lệ');
};

/**
 * MỚI: Đổi từ mã nhân viên (EMP001) → id số thật trong DB
 * Bạn cần yêu cầu backend tạo endpoint này (rất dễ, 5 phút)
 * Ví dụ: GET /api/employees/code/EMP001 → trả về { data: { id: 1 } }
 */
export const getEmployeeIdByCode = async (employeeCode) => {
  const response = await http(`${JAVA_API}/employees/code/${employeeCode}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    },
  });

  if (!response.ok) throw new Error('Không tìm thấy nhân viên theo mã');

  const result = await response.json();
  return result.data?.id || result.data?.employeeId; // tùy backend trả kiểu gì
};