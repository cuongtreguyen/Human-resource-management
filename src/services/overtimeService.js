// src/services/overtimeService.js
// Service để gọi API Overtime từ Backend

import { JAVA_API, http } from './config';

// Helper lấy headers với token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

/**
 * Tạo yêu cầu OT mới
 * POST /api/overtimes/create
 * @param {Object} data - { employeeId, otDate, otHours, boardId?, reason, department }
 */
export const createOvertimeRequest = async (data) => {
  const response = await http(`${JAVA_API}/overtimes/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể tạo yêu cầu OT`);
  }

  return await response.json();
};

/**
 * Lấy danh sách OT theo status
 * GET /api/overtimes/getOvertimeByStatus?status=PENDING
 * @param {string} status - PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED (optional)
 */
export const getOvertimeByStatus = async (status = null) => {
  const url = status
    ? `${JAVA_API}/overtimes/getOvertimeByStatus?status=${status}`
    : `${JAVA_API}/overtimes/getOvertimeByStatus`;

  const response = await http(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể lấy danh sách OT`);
  }

  return await response.json();
};

/**
 * Lấy chi tiết OT theo ID
 * GET /api/overtimes/getOvertimeDetails/{id}
 * @param {number} id - ID của OT request
 */
export const getOvertimeDetails = async (id) => {
  const response = await http(`${JAVA_API}/overtimes/getOvertimeDetails/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể lấy chi tiết OT`);
  }

  return await response.json();
};

/**
 * Cập nhật trạng thái OT (Duyệt/Từ chối/Hoàn thành/Hủy)
 * PUT /api/overtimes/setOvertimeStatus/{id}?status=APPROVED&managerNote=...
 * @param {number} id - ID của OT request
 * @param {string} status - APPROVED, REJECTED, COMPLETED, CANCELLED
 * @param {string} managerNote - Ghi chú của manager (optional)
 */
export const setOvertimeStatus = async (id, status, managerNote = '') => {
  const params = new URLSearchParams({ status });
  if (managerNote) {
    params.append('managerNote', managerNote);
  }

  const response = await http(`${JAVA_API}/overtimes/setOvertimeStatus/${id}?${params}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể cập nhật trạng thái OT`);
  }

  return await response.json();
};

/**
 * Đếm số lượng OT theo status
 * GET /api/overtimes/countOvertimeByStatus/{status}?status=PENDING
 * @param {string} status - PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED (optional)
 */
export const countOvertimeByStatus = async (status = null) => {
  const url = status
    ? `${JAVA_API}/overtimes/countOvertimeByStatus/${status}?status=${status}`
    : `${JAVA_API}/overtimes/countOvertimeByStatus/all`;

  const response = await http(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể đếm OT`);
  }

  return await response.json();
};

/**
 * Lấy tổng số giờ OT
 * GET /api/overtimes/countAllOTTime
 */
export const getTotalOvertimeHours = async () => {
  const response = await http(`${JAVA_API}/overtimes/countAllOTTime`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể lấy tổng giờ OT`);
  }

  return await response.json();
};

/**
 * Tìm kiếm OT theo tên nhân viên hoặc tiêu đề
 * GET /api/overtimes/getOvertimeByTitleOrEmpName?keyword=...
 * @param {string} keyword - Từ khóa tìm kiếm
 */
export const searchOvertime = async (keyword) => {
  const response = await http(`${JAVA_API}/overtimes/getOvertimeByTitleOrEmpName?keyword=${encodeURIComponent(keyword)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể tìm kiếm OT`);
  }

  return await response.json();
};

/**
 * Lấy lịch sử OT của nhân viên theo employeeId
 * GET /api/overtimes/history/employee/{employeeId}
 * @param {number} employeeId - ID của nhân viên
 */
export const getOvertimeHistoryByEmployee = async (employeeId) => {
  const response = await http(`${JAVA_API}/overtimes/history/employee/${employeeId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể lấy lịch sử OT`);
  }

  return await response.json();
};

/**
 * Lấy lịch sử OT của user đang đăng nhập
 * GET /api/overtimes/history/my-history
 */
export const getMyOvertimeHistory = async () => {
  const response = await http(`${JAVA_API}/overtimes/history/my-history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}: Không thể lấy lịch sử OT của bạn`);
  }

  return await response.json();
};

/**
 * Format OT history response từ Backend
 */
export const formatOTHistoryResponse = (backendList) => {
  return backendList.map(item => ({
    id: item.id,
    employeeId: item.employeeId,
    employeeName: item.employeeFullName,
    otHours: item.otHours,
    reason: item.reason,
    boardName: item.boardName,
    status: mapOTStatus(item.overtimeStatus),
    otDate: item.otDate,
    department: item.department,
  }));
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Map status từ Backend sang Frontend display
 */
export const mapOTStatus = (backendStatus) => {
  const statusMap = {
    'PENDING': 'pending',
    'APPROVED': 'approved',
    'REJECTED': 'rejected',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
  };
  return statusMap[backendStatus] || backendStatus?.toLowerCase();
};

/**
 * Map status từ Frontend sang Backend
 */
export const mapOTStatusToBackend = (frontendStatus) => {
  const statusMap = {
    'pending': 'PENDING',
    'approved': 'APPROVED',
    'rejected': 'REJECTED',
    'completed': 'COMPLETED',
    'cancelled': 'CANCELLED',
  };
  return statusMap[frontendStatus] || frontendStatus?.toUpperCase();
};

/**
 * Format OT response từ Backend sang format Frontend cần
 */
export const formatOTResponse = (backendData) => {
  return {
    id: backendData.id,
    employeeId: backendData.employeeId,
    employeeName: backendData.employeeName,
    department: backendData.department,
    boardId: backendData.boardId,
    boardName: backendData.boardName,
    otDate: backendData.otDate,
    otHours: backendData.otHours,
    plannedHours: backendData.otHours, // Alias
    reason: backendData.reason,
    status: mapOTStatus(backendData.overtimeStatus),
    managerNote: backendData.managerNote,
    approvedBy: backendData.approvedBy,
    createdAt: backendData.createdAt,
    submittedAt: backendData.createdAt, // Alias
  };
};

/**
 * Format danh sách OT từ Backend
 * Backend trả về: { id, employeeId, employeeName, department, boardId, boardName,
 *                   otDate, otHours, reason, overtimeStatus, managerNote, createdAt }
 */
export const formatOTListResponse = (backendList) => {
  return backendList.map(item => ({
    id: item.id,
    employeeId: item.employeeId,
    employeeName: item.employeeName,
    department: item.department,
    boardId: item.boardId,
    boardName: item.boardName,
    taskTitle: item.boardName || item.title, // Ưu tiên boardName, fallback title
    taskDeadline: item.deadline,
    otDate: item.otDate,
    otHours: item.otHours,
    plannedHours: item.otHours,
    reason: item.reason,
    status: mapOTStatus(item.overtimeStatus),
    managerNote: item.managerNote,
    approvedBy: item.approvedBy,
    createdAt: item.createdAt,
    submittedAt: item.createdAt,
  }));
};

export default {
  createOvertimeRequest,
  getOvertimeByStatus,
  getOvertimeDetails,
  setOvertimeStatus,
  countOvertimeByStatus,
  getTotalOvertimeHours,
  searchOvertime,
  getOvertimeHistoryByEmployee,
  getMyOvertimeHistory,
  mapOTStatus,
  mapOTStatusToBackend,
  formatOTResponse,
  formatOTListResponse,
  formatOTHistoryResponse,
};
