// src/services/employeeService.js
import { http, JAVA_API } from './config.js';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

/**
 * 1. API chuyên dụng cho Accountant (có thêm filter lương)
 * GET /api/employees/accountant/search
 */
export const searchEmployeesForAccountant = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.department) params.append('department', filters.department);
  if (filters.position) params.append('position', filters.position);
  if (filters.minSalary) params.append('minSalary', filters.minSalary);
  if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/employees/accountant/search${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách nhân viên'}`);
  }

  return await response.json();
};

/**
 * 2. API chung (lấy tất cả nhân viên)
 * GET /api/employees
 */
export const getAllEmployees = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.department) params.append('department', filters.department);
  if (filters.position) params.append('position', filters.position);
  if (filters.status) params.append('status', filters.status);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/employees${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách nhân viên'}`);
  }

  return await response.json();
};

/**
 * 3. Xem chi tiết 1 nhân viên
 * GET /api/employees/{id}
 */
export const getEmployeeById = async (id) => {
  const response = await http(`${JAVA_API}/employees/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải thông tin nhân viên'}`);
  }

  return await response.json();
};

/**
 * 4. Đếm tổng số nhân viên
 * GET /api/employees/total
 */
export const getTotalEmployees = async () => {
  const response = await http(`${JAVA_API}/employees/total`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi đếm nhân viên'}`);
  }

  return await response.json();
};

/**
 * 5. Thống kê nhân viên
 * GET /api/employees/stats
 */
export const getEmployeeStats = async () => {
  const response = await http(`${JAVA_API}/employees/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải thống kê'}`);
  }

  return await response.json();
};

export default {
  searchEmployeesForAccountant,
  getAllEmployees,
  getEmployeeById,
  getTotalEmployees,
  getEmployeeStats,
};
