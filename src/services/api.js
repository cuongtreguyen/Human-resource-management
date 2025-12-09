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






// // src/services/api.js
// import { http, JAVA_API } from './config.js';

// /**
//  * ===== HELPER FUNCTIONS =====
//  */
// const getAuthHeaders = () => ({
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
// });

// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi server'}`);
//   }

//   const result = await response.json();
//   if (result.success && result.data !== undefined) {
//     return result.data;
//   }
//   throw new Error(result.message || 'Dữ liệu không hợp lệ');
// };

// /**
//  * ===== EMPLOYEE MANAGEMENT API =====
//  */

// // Lấy danh sách tất cả nhân viên
// export const getEmployees = async () => {
//   const response = await http(`${JAVA_API}/employees`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(response);
// };

// // Lấy hồ sơ nhân viên theo ID hoặc mã (EMP001)
// export const getEmployeeById = async (employeeIdOrCode) => {
//   const response = await http(`${JAVA_API}/employees/${employeeIdOrCode}`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(response);
// };

// // ✅ Alias tương thích code cũ (EmployeePortal.jsx, Profile.jsx)
// export const getEmployeeProfile = getEmployeeById;

// // ✅ Đổi endpoint để gọi /employees/{code} (bỏ /code/)
// export const getEmployeeIdByCode = async (employeeCode) => {
//   const response = await http(`${JAVA_API}/employees/${employeeCode}`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });

//   const result = await handleResponse(response);
//   return result.id || result.employeeId;
// };

// // Tạo nhân viên mới
// export const createEmployee = async (employeeData) => {
//   const response = await http(`${JAVA_API}/employees`, {
//     method: 'POST',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(employeeData),
//   });
//   return handleResponse(response);
// };

// // Cập nhật thông tin nhân viên
// export const updateEmployee = async (employeeId, employeeData) => {
//   const response = await http(`${JAVA_API}/employees/${employeeId}`, {
//     method: 'PUT',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(employeeData),
//   });
//   return handleResponse(response);
// };

// // Xóa nhân viên
// export const deleteEmployee = async (employeeId) => {
//   const response = await http(`${JAVA_API}/employees/${employeeId}`, {
//     method: 'DELETE',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) throw new Error('Không thể xóa nhân viên');
//   return true;
// };

// // Tìm kiếm nhân viên
// export const searchEmployees = async (filters = {}) => {
//   const params = new URLSearchParams();

//   if (filters.keyword) params.append('keyword', filters.keyword);
//   if (filters.department && filters.department !== 'Tất cả phòng ban')
//     params.append('department', filters.department);
//   if (filters.position && filters.position !== 'Tất cả chức vụ')
//     params.append('position', filters.position);
//   if (filters.status) params.append('status', filters.status);

//   const response = await http(`${JAVA_API}/employees/search?${params}`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(response);
// };

// /**
//  * ===== DEPARTMENT & POSITION API =====
//  */

// // Lấy danh sách phòng ban
// export const getDepartments = async () => {
//   const response = await http(`${JAVA_API}/departments`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(response);
// };

// // Lấy danh sách chức vụ
// export const getPositions = async () => {
//   const response = await http(`${JAVA_API}/positions`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(response);
// };

// /**
//  * ===== STATISTICS API =====
//  */

// // Lấy thống kê nhân viên
// export const getEmployeeStatistics = async () => {
//   const response = await http(`${JAVA_API}/employees/statistics`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });
//   return handleResponse(response);
// };

// /**
//  * ===== EXPORT & IMPORT =====
//  */

// // Xuất danh sách nhân viên ra Excel
// export const exportEmployees = async (format = 'xlsx') => {
//   const response = await http(`${JAVA_API}/employees/export?format=${format}`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) throw new Error('Không thể xuất dữ liệu');

//   const blob = await response.blob();
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `employees_${new Date().toISOString().split('T')[0]}.${format}`;
//   document.body.appendChild(a);
//   a.click();
//   window.URL.revokeObjectURL(url);
//   document.body.removeChild(a);

//   return { success: true };
// };

// // Import danh sách nhân viên từ Excel
// export const importEmployees = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);

//   const response = await http(`${JAVA_API}/employees/import`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
//     },
//     body: formData,
//   });

//   return handleResponse(response);
// };

// // Xóa nhiều nhân viên cùng lúc
// export const bulkDeleteEmployees = async (employeeIds) => {
//   const response = await http(`${JAVA_API}/employees/bulk-delete`, {
//     method: 'DELETE',
//     headers: getAuthHeaders(),
//     body: JSON.stringify({ ids: employeeIds }),
//   });
//   return handleResponse(response);
// };

// /**
//  * ===== VALIDATION =====
//  */

// // Kiểm tra email đã tồn tại chưa
// export const checkEmailExists = async (email) => {
//   const response = await http(
//     `${JAVA_API}/employees/check-email?email=${encodeURIComponent(email)}`,
//     {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     }
//   );

//   const result = await handleResponse(response);
//   return result.exists || false;
// };

// // Kiểm tra mã nhân viên đã tồn tại chưa
// export const checkEmployeeCodeExists = async (code) => {
//   const response = await http(
//     `${JAVA_API}/employees/check-code?code=${encodeURIComponent(code)}`,
//     {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     }
//   );

//   const result = await handleResponse(response);
//   return result.exists || false;
// };

// /**
//  * ===== EXPORT DEFAULT (TƯƠNG THÍCH CODE CŨ) =====
//  */
// export default {
//   getEmployees,
//   getEmployeeById,
//   getEmployeeProfile, // ✅ alias để tránh lỗi import
//   getEmployeeIdByCode,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
//   searchEmployees,
//   getDepartments,
//   getPositions,
//   getEmployeeStatistics,
//   exportEmployees,
//   importEmployees,
//   bulkDeleteEmployees,
//   checkEmailExists,
//   checkEmployeeCodeExists,
// };

















// src/services/api.js
import { http, JAVA_API } from './config.js';

/* ===== HELPER ===== */
const getToken = () =>
  sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || '';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi server'}`);
  }

  const result = await response.json().catch(() => ({}));
  if (result.success && result.data !== undefined) return result.data;
  if (Array.isArray(result)) return result;
  if (result.data) return result.data;
  return result;
};

/* ===== EMPLOYEE MANAGEMENT ===== */
export const getEmployees = async () => {
  const response = await http(`${JAVA_API}/employees`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getEmployeeById = async (idOrCode) => {
  const response = await http(`${JAVA_API}/employees/${idOrCode}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getEmployeeProfile = getEmployeeById;

export const getEmployeeIdByCode = async (employeeCode) => {
  const response = await http(`${JAVA_API}/employees/${employeeCode}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const result = await handleResponse(response);
  return result.id || result.employeeId;
};

export const createEmployee = async (data) => {
  const response = await http(`${JAVA_API}/employees`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateEmployee = async (id, data) => {
  const response = await http(`${JAVA_API}/employees/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteEmployee = async (id) => {
  const response = await http(`${JAVA_API}/employees/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Không thể xóa nhân viên');
  return true;
};

/* ===== LEAVE MANAGEMENT ===== */

// ✅ Lấy danh sách đơn nghỉ phép
export const getLeaveRequests = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.employeeId) params.append('employeeId', filters.employeeId);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const response = await http(`${JAVA_API}/leaves?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await handleResponse(response);
  return Array.isArray(result) ? result : (result.data || []);
};

// ✅ Lấy chi tiết đơn nghỉ phép theo ID
export const getLeaveRequestById = async (id) => {
  const response = await http(`${JAVA_API}/leaves/getLeaveReqByID/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ✅ Duyệt đơn nghỉ phép
export const approveLeaveRequest = async (id) => {
  const response = await http(`${JAVA_API}/leaves/setLeaveStatus/${id}?status=APPROVED`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return response.ok;
};

// ✅ Từ chối đơn nghỉ phép
export const rejectLeaveRequest = async (id, reason) => {
  const response = await http(`${JAVA_API}/leaves/setLeaveStatus/${id}?status=REJECTED`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  return response.ok;
};

/* ===== DEPARTMENTS & POSITIONS ===== */
export const getDepartments = async () => {
  const response = await http(`${JAVA_API}/departments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getPositions = async () => {
  const response = await http(`${JAVA_API}/positions`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/* ===== STATS ===== */
export const getEmployeeStatistics = async () => {
  const response = await http(`${JAVA_API}/employees/statistics`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/* ===== EXPORT / IMPORT ===== */
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

export const importEmployees = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await http(`${JAVA_API}/employees/import`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData,
  });

  return handleResponse(response);
};

export const bulkDeleteEmployees = async (ids) => {
  const response = await http(`${JAVA_API}/employees/bulk-delete`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });
  return handleResponse(response);
};

/* ===== VALIDATION ===== */
export const checkEmailExists = async (email) => {
  const response = await http(`${JAVA_API}/employees/check-email?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const result = await handleResponse(response);
  return result.exists || false;
};

export const checkEmployeeCodeExists = async (code) => {
  const response = await http(`${JAVA_API}/employees/check-code?code=${encodeURIComponent(code)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const result = await handleResponse(response);
  return result.exists || false;
};
/* ===== NOTIFICATIONS ===== */
export const getNotifications = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.read !== undefined) params.append('read', filters.read);
  if (filters.type) params.append('type', filters.type);

  const response = await http(`${JAVA_API}/notifications?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await handleResponse(response);
  return Array.isArray(result) ? result : (result.data || []);
};

// ✅ Đánh dấu 1 thông báo đã đọc
export const markNotificationRead = async (id) => {
  const response = await http(`${JAVA_API}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ✅ Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsRead = async () => {
  const response = await http(`${JAVA_API}/notifications/read-all`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};





export const getEvaluations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.department) params.append('department', filters.department);

  const response = await http(`${JAVA_API}/evaluations?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse(response); // ← Đây là danh sách EVALUATIONS, không phải employees
};


// Lấy chi tiết 1 evaluation theo ID (nếu cần sau này)
export const getEvaluationById = async (id) => {
  const response = await http(`${JAVA_API}/evaluations/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Tạo evaluation mới
export const createEvaluation = async (data) => {
  const response = await http(`${JAVA_API}/evaluations`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return handleResponse(response);
};


// ===== ADMIN DASHBOARD STATISTICS =====
export const getAdminStatistics = async () => {
  const response = await http(`${JAVA_API}/admin-statistics`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getWeeklyAttendanceStats = async () => {
  const response = await http(`${JAVA_API}/admin-statistics/weekly-attendance`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getEmployeesByDepartment = async () => {
  const response = await http(`${JAVA_API}/admin-statistics/employees-by-department`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};


// trong src/services/api.js (ở phần LEAVE MANAGEMENT)

export const getLeaveBalance = async (employeeId) => {
  const response = await http(`${JAVA_API}/leaves/balance/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  // handleResponse sẽ trả về object balance hoặc bọc data
  return handleResponse(response);
};

export const getLeaveHistory = async (employeeId, year) => {
  // lấy từ 1 Jan đến 31 Dec của year
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const response = await http(`${JAVA_API}/leaves?employeeId=${encodeURIComponent(employeeId)}&startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const result = await handleResponse(response);
  // backend có thể trả {data: [...] } hoặc [...] -> bình thường hóa
  return Array.isArray(result) ? result : (result.data || []);
};

export const createLeaveForEmployee = async (payload) => {
  // payload phải theo schema backend (employeeId, type, startDate, endDate, reason, days, ...)
  const response = await http(`${JAVA_API}/leaves/createForEmployee`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// Lấy summary ngày phép của CHÍNH nhân viên hiện tại
export const getMyLeaveSummary = async () => {
  const response = await http(`${JAVA_API}/employee/leave/summary`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  // Swagger trả: { "remaining": 12, "used": 0, "pending": 0 }
  return handleResponse(response);
};

// Lấy lịch sử nghỉ phép của CHÍNH nhân viên hiện tại
export const getMyLeaveHistory = async () => {
  const response = await http(`${JAVA_API}/employee/leave/history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const result = await handleResponse(response);
  // Swagger trả về 1 array
  return Array.isArray(result) ? result : (result.data || []);
};



/* ===== SALARY / PAYROLL ===== */

// Get my latest salary
export const getMyLatestSalary = async () => {
  const response = await http(`${JAVA_API}/employee/salary/api/my-latest`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get my average salary
export const getMyAverageSalary = async () => {
  const response = await http(`${JAVA_API}/employee/salary/api/my-average`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get my total income
export const getMyTotalIncome = async () => {
  const response = await http(`${JAVA_API}/employee/salary/api/my-total-income`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get my salary summary (may return aggregated numbers or an object)
export const getMySalarySummary = async () => {
  const response = await http(`${JAVA_API}/employee/salary/api/my-summary`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Optional: history / records (if backend provides)
export const getPayrollRecords = async (params = {}) => {
  // params: { page, size, year } -> build query string if needed
  const qs = new URLSearchParams(params).toString();
  const url = `${JAVA_API}/employee/salary/history${qs ? `?${qs}` : ''}`; // adjust path if backend uses another
  const response = await http(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};


/* ===== EXPORT DEFAULT ===== */
export default {
  getEmployees,
  getEmployeeById,
  getEmployeeProfile,
  getEmployeeIdByCode,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getLeaveRequests,
  getLeaveRequestById,
  approveLeaveRequest,
  rejectLeaveRequest,
  getDepartments,
  getPositions,
  getEmployeeStatistics,
  exportEmployees,
  importEmployees,
  bulkDeleteEmployees,
  checkEmailExists,
  checkEmployeeCodeExists,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getEvaluations,
  createEvaluation,
  getEvaluationById,
  getAdminStatistics,
  getWeeklyAttendanceStats,
  getEmployeesByDepartment,
  getLeaveBalance,
  getLeaveHistory,
  createLeaveForEmployee,
  getMyLatestSalary,
  getMyAverageSalary,
  getMyTotalIncome,
  getMySalarySummary,
  getPayrollRecords,
  getMyLeaveSummary,
  getMyLeaveHistory,
};
