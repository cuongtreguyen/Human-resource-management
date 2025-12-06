// // src/services/api.js
// import { http, JAVA_API } from './config.js';

// /**
//  * Lấy hồ sơ nhân viên theo ID số (1, 2, 3...)
//  * GET /api/employees/{id}/profile
//  */
// export const getEmployeeProfile = async (employeeId) => {
//   const response = await http(`${JAVA_API}/employees/${employeeId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
//     },
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi server'}`);
//   }

//   const result = await response.json();
//   if (result.success && result.data) {
//     return result.data;
//   }
//   throw new Error(result.message || 'Dữ liệu không hợp lệ');
// };

// /**
//  * MỚI: Đổi từ mã nhân viên (EMP001) → id số thật trong DB
//  * Bạn cần yêu cầu backend tạo endpoint này (rất dễ, 5 phút)
//  * Ví dụ: GET /api/employees/code/EMP001 → trả về { data: { id: 1 } }
//  */
// export const getEmployeeIdByCode = async (employeeCode) => {
//   const response = await http(`${JAVA_API}/employees/code/${employeeCode}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
//     },
//   });

//   if (!response.ok) throw new Error('Không tìm thấy nhân viên theo mã');

//   const result = await response.json();
//   return result.data?.id || result.data?.employeeId; // tùy backend trả kiểu gì
// };






// src/services/api.js
import { http, JAVA_API } from './config.js';

/**
 * ===== HELPER FUNCTIONS =====
 */
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi server'}`);
  }

  const result = await response.json();
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  throw new Error(result.message || 'Dữ liệu không hợp lệ');
};

/**
 * ===== EMPLOYEE MANAGEMENT API =====
 */

// Lấy danh sách tất cả nhân viên
export const getEmployees = async () => {
  const response = await http(`${JAVA_API}/employees`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Lấy hồ sơ nhân viên theo ID hoặc mã (EMP001)
export const getEmployeeById = async (employeeIdOrCode) => {
  const response = await http(`${JAVA_API}/employees/${employeeIdOrCode}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ✅ Alias tương thích code cũ (EmployeePortal.jsx, Profile.jsx)
export const getEmployeeProfile = getEmployeeById;

// ✅ Đổi endpoint để gọi /employees/{code} (bỏ /code/)
export const getEmployeeIdByCode = async (employeeCode) => {
  const response = await http(`${JAVA_API}/employees/${employeeCode}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await handleResponse(response);
  return result.id || result.employeeId;
};

// Tạo nhân viên mới
export const createEmployee = async (employeeData) => {
  const response = await http(`${JAVA_API}/employees`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (employeeId, employeeData) => {
  const response = await http(`${JAVA_API}/employees/${employeeId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
};

// Xóa nhân viên
export const deleteEmployee = async (employeeId) => {
  const response = await http(`${JAVA_API}/employees/${employeeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error('Không thể xóa nhân viên');
  return true;
};

// Tìm kiếm nhân viên
export const searchEmployees = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.department && filters.department !== 'Tất cả phòng ban')
    params.append('department', filters.department);
  if (filters.position && filters.position !== 'Tất cả chức vụ')
    params.append('position', filters.position);
  if (filters.status) params.append('status', filters.status);

  const response = await http(`${JAVA_API}/employees/search?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * ===== DEPARTMENT & POSITION API =====
 */

// Lấy danh sách phòng ban
export const getDepartments = async () => {
  const response = await http(`${JAVA_API}/departments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Lấy danh sách chức vụ
export const getPositions = async () => {
  const response = await http(`${JAVA_API}/positions`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * ===== STATISTICS API =====
 */

// Lấy thống kê nhân viên
export const getEmployeeStatistics = async () => {
  const response = await http(`${JAVA_API}/employees/statistics`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * ===== EXPORT & IMPORT =====
 */

// Xuất danh sách nhân viên ra Excel
export const exportEmployees = async (format = 'xlsx') => {
  const response = await http(`${JAVA_API}/employees/export?format=${format}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error('Không thể xuất dữ liệu');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `employees_${new Date().toISOString().split('T')[0]}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  return { success: true };
};

// Import danh sách nhân viên từ Excel
export const importEmployees = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await http(`${JAVA_API}/employees/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

// Xóa nhiều nhân viên cùng lúc
export const bulkDeleteEmployees = async (employeeIds) => {
  const response = await http(`${JAVA_API}/employees/bulk-delete`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids: employeeIds }),
  });
  return handleResponse(response);
};

/**
 * ===== VALIDATION =====
 */

// Kiểm tra email đã tồn tại chưa
export const checkEmailExists = async (email) => {
  const response = await http(
    `${JAVA_API}/employees/check-email?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const result = await handleResponse(response);
  return result.exists || false;
};

// Kiểm tra mã nhân viên đã tồn tại chưa
export const checkEmployeeCodeExists = async (code) => {
  const response = await http(
    `${JAVA_API}/employees/check-code?code=${encodeURIComponent(code)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const result = await handleResponse(response);
  return result.exists || false;
};

/**
 * ===== EXPORT DEFAULT (TƯƠNG THÍCH CODE CŨ) =====
 */
export default {
  getEmployees,
  getEmployeeById,
  getEmployeeProfile, // ✅ alias để tránh lỗi import
  getEmployeeIdByCode,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getDepartments,
  getPositions,
  getEmployeeStatistics,
  exportEmployees,
  importEmployees,
  bulkDeleteEmployees,
  checkEmailExists,
  checkEmployeeCodeExists,
};
