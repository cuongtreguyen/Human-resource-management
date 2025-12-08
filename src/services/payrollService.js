// src/services/payrollService.js
import { http, JAVA_API } from './config.js';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

/**
 * 1. Lấy bảng lương hàng tháng (Accountant)
 * GET /api/payroll/accountant/monthly?month=2024-01
 */
export const getMonthlyPayroll = async (month) => {
  const queryParams = month ? `?month=${month}` : '';
  const response = await http(`${JAVA_API}/payroll/accountant/monthly${queryParams}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải bảng lương'}`);
  }

  return await response.json();
};

/**
 * 2. Tính toán Payroll
 * POST /api/payroll/accountant/calculate
 */
export const calculatePayroll = async (payrollData) => {
  const response = await http(`${JAVA_API}/payroll/accountant/calculate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payrollData),
  });

  if (!response.ok) {
    let errorMessage = 'Lỗi khi tính lương';
    
    try {
      // Thử parse JSON error response từ backend
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errorCode) {
        errorMessage = `${errorData.errorCode}: ${errorData.message || errorMessage}`;
      }
    } catch (e) {
      // Nếu không parse được JSON, dùng text
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    
    const error = new Error(errorMessage);
    error.response = response; // Lưu response để có thể parse thêm nếu cần
    throw error;
  }

  return await response.json();
};

/**
 * 3. Xem chi tiết Payroll Calculation
 * GET /api/payroll/accountant/calculation/{employeeId}
 */
export const getPayrollCalculation = async (employeeId) => {
  const response = await http(`${JAVA_API}/payroll/accountant/calculation/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải chi tiết lương'}`);
  }

  return await response.json();
};

/**
 * 4. Lấy tất cả payroll (có filter)
 * GET /api/payroll?month=2024-01&employeeId=1&status=PENDING
 */
export const getAllPayrolls = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.month) params.append('month', filters.month);
  if (filters.employeeId) params.append('employeeId', filters.employeeId);
  if (filters.status) params.append('status', filters.status);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/payroll${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách payroll'}`);
  }

  return await response.json();
};

/**
 * 5. Lấy payroll theo ID
 * GET /api/payroll/{id}
 */
export const getPayrollById = async (id) => {
  const response = await http(`${JAVA_API}/payroll/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải payroll'}`);
  }

  return await response.json();
};

/**
 * 6. Tạo mới payroll
 * POST /api/payroll
 */
export const createPayroll = async (payrollData) => {
  const response = await http(`${JAVA_API}/payroll`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payrollData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tạo payroll'}`);
  }

  return await response.json();
};

/**
 * 7. Cập nhật payroll
 * PUT /api/payroll/{id}
 */
export const updatePayroll = async (id, payrollData) => {
  const response = await http(`${JAVA_API}/payroll/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payrollData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật payroll'}`);
  }

  return await response.json();
};

/**
 * 8. Duyệt payroll
 * POST /api/payroll/{id}/approve
 */
export const approvePayroll = async (id) => {
  const response = await http(`${JAVA_API}/payroll/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi duyệt payroll'}`);
  }

  return await response.json();
};

/**
 * 9. Đánh dấu đã thanh toán
 * POST /api/payroll/{id}/pay
 */
export const payPayroll = async (id) => {
  const response = await http(`${JAVA_API}/payroll/${id}/pay`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi thanh toán payroll'}`);
  }

  // ⚠️ FIX: Backend trả về void (empty response), không phải JSON
  // Kiểm tra xem có content không trước khi parse JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  }
  
  // Nếu không có content hoặc không phải JSON, trả về success
  return { success: true };
};

/**
 * 10. Hủy payroll
 * POST /api/payroll/{id}/cancel
 */
export const cancelPayroll = async (id) => {
  const response = await http(`${JAVA_API}/payroll/${id}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi hủy payroll'}`);
  }

  // ⚠️ FIX: Backend trả về void (empty response), không phải JSON
  // Kiểm tra xem có content không trước khi parse JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  }
  
  // Nếu không có content hoặc không phải JSON, trả về success
  return { success: true };
};

/**
 * 11. Cập nhật status
 * PUT /api/payroll/{id}/status
 */
export const updatePayrollStatus = async (id, status) => {
  const response = await http(`${JAVA_API}/payroll/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật trạng thái'}`);
  }

  return await response.json();
};

/**
 * 12. Lấy thống kê dashboard
 * GET /api/payroll-statistics/dashboard
 */
export const getPayrollDashboard = async () => {
  const response = await http(`${JAVA_API}/payroll-statistics/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải dashboard'}`);
  }

  return await response.json();
};

/**
 * 13. Lấy tổng hợp thống kê
 * GET /api/payroll-statistics/summary
 */
export const getPayrollSummary = async () => {
  const response = await http(`${JAVA_API}/payroll-statistics/summary`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải tổng hợp'}`);
  }

  return await response.json();
};

/**
 * 14. Lấy filter options
 * GET /api/payroll-statistics/filter-options
 */
export const getFilterOptions = async () => {
  const response = await http(`${JAVA_API}/payroll-statistics/filter-options`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải filter options'}`);
  }

  return await response.json();
};

/**
 * 15. Lấy danh sách policies
 * GET /api/policies
 */
export const getPolicies = async () => {
  const response = await http(`${JAVA_API}/policies`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách policies'}`);
  }

  return await response.json();
};

/**
 * 16. Tạo policy mới
 * POST /api/policies
 */
export const createPolicy = async (policyData) => {
  const response = await http(`${JAVA_API}/policies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(policyData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tạo policy'}`);
  }

  return await response.json();
};

/**
 * 17. Lấy danh sách đơn nghỉ phép (Accountant)
 * GET /api/on-leave/accountant/applications?employeeId=1
 */
export const getLeaveApplications = async (employeeId) => {
  const params = new URLSearchParams();
  if (employeeId) params.append('employeeId', employeeId);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/on-leave/accountant/applications${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách đơn nghỉ phép'}`);
  }

  return await response.json();
};

/**
 * 18. Xem chi tiết đơn nghỉ phép (Accountant)
 * GET /api/on-leave/accountant/applications/{leaveId}
 */
export const getLeaveApplicationById = async (leaveId) => {
  const response = await http(`${JAVA_API}/on-leave/accountant/applications/${leaveId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải chi tiết đơn nghỉ phép'}`);
  }

  return await response.json();
};

/**
 * 19. Tạo bản ghi lương cho nhân viên
 * POST /salary/record
 */
export const createSalaryRecord = async (salaryData) => {
  const response = await http(`${JAVA_API}/salary/record`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(salaryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi lưu bảng lương'}`);
  }

  return await response.json();
};

/**
 * 20. Cập nhật bản ghi lương
 * PUT /salary/record/{id}
 */
export const updateSalaryRecord = async (id, salaryData) => {
  const response = await http(`${JAVA_API}/salary/record/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(salaryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi cập nhật bảng lương'}`);
  }

  return await response.json();
};

export default {
  getMonthlyPayroll,
  calculatePayroll,
  getPayrollCalculation,
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  approvePayroll,
  payPayroll,
  cancelPayroll,
  updatePayrollStatus,
  getPayrollDashboard,
  getPayrollSummary,
  getFilterOptions,
  getPolicies,
  createPolicy,
  getLeaveApplications,
  getLeaveApplicationById,
  createSalaryRecord,
  updateSalaryRecord,
};
