// src/services/leaveService.js
import { http, JAVA_API } from './config.js';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

/**
 * 1. Lấy số ngày phép còn lại của nhân viên
 * GET /api/leaves/balance/{employeeId}
 */
export const getLeaveBalance = async (employeeId) => {
  const response = await http(`${JAVA_API}/leaves/balance/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải số ngày phép'}`);
  }

  return await response.json();
};

/**
 * 2. Lấy lịch sử nghỉ phép của nhân viên
 * GET /api/leaves/history/{employeeId}?year=2024
 */
export const getLeaveHistory = async (employeeId, year) => {
  const params = new URLSearchParams();
  if (year) params.append('year', year);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/leaves/history/${employeeId}${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải lịch sử nghỉ phép'}`);
  }

  return await response.json();
};

/**
 * 3. Lấy danh sách đơn nghỉ phép (có filter)
 * GET /api/leaves?status=PENDING&employeeId=1&startDate=2024-01-01&endDate=2024-12-31
 */
export const getLeaveRequests = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.employeeId) params.append('employeeId', filters.employeeId);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/leaves${queryString}`, {
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
 * 4. Tạo đơn nghỉ phép mới
 * POST /api/leaves/create
 */
export const createLeaveRequest = async (leaveData) => {
  const response = await http(`${JAVA_API}/leaves/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(leaveData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tạo đơn nghỉ phép'}`);
  }

  return await response.json();
};

/**
 * 5. Duyệt đơn nghỉ phép
 * PUT /api/leaves/{leaveId}/status
 */
export const approveLeaveRequest = async (leaveId) => {
  const response = await http(`${JAVA_API}/leaves/${leaveId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: 'APPROVED' }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi duyệt đơn nghỉ phép'}`);
  }

  return await response.json();
};

/**
 * 6. Từ chối đơn nghỉ phép
 * PUT /api/leaves/{leaveId}/status
 */
export const rejectLeaveRequest = async (leaveId, reason) => {
  const response = await http(`${JAVA_API}/leaves/${leaveId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: 'REJECTED', reason }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi từ chối đơn nghỉ phép'}`);
  }

  return await response.json();
};

/**
 * 7. Hủy đơn nghỉ phép
 * PUT /api/leaves/{leaveId}/cancel
 */
export const cancelLeaveRequest = async (leaveId) => {
  const response = await http(`${JAVA_API}/leaves/${leaveId}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi hủy đơn nghỉ phép'}`);
  }

  return await response.json();
};

export default {
  getLeaveBalance,
  getLeaveHistory,
  getLeaveRequests,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
};
