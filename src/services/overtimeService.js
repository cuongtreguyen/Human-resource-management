// src/services/overtimeService.js
import { http, JAVA_API } from './config.js';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || ''}`,
});

/**
 * 1. Tạo yêu cầu OT mới
 * POST /api/overtimes/create
 */
export const createOTRequest = async (otData) => {
  const response = await http(`${JAVA_API}/overtimes/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      employeeId: otData.employeeId,
      otDate: otData.otDate,
      otHours: otData.otHours || otData.plannedHours,
      taskId: otData.taskId,
      reason: otData.reason,
      createdAt: otData.createdAt || new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Không thể tạo yêu cầu OT. Vui lòng thử lại!';
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      } else if (errorBody?.errorCode) {
        errorMessage = `${errorBody.errorCode}: ${errorBody.message || errorMessage}`;
      }
    } catch (e) {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * 2. Lấy danh sách OT theo status
 * GET /api/overtimes/getOvertimeByStatus?status=PENDING
 */
export const getOTByStatus = async (status) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') {
    params.append('status', status.toUpperCase());
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/overtimes/getOvertimeByStatus${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách OT'}`);
  }

  const result = await response.json();
  return Array.isArray(result) ? result : [];
};

/**
 * 3. Duyệt/Từ chối OT request
 * PUT /api/overtimes/setOvertimeStatus/{id}?status=APPROVED&managerNote=...
 */
export const setOTStatus = async (id, status, managerNote = '') => {
  const params = new URLSearchParams();
  params.append('status', status.toUpperCase());
  if (managerNote) {
    params.append('managerNote', managerNote);
  }

  const response = await http(`${JAVA_API}/overtimes/setOvertimeStatus/${id}?${params.toString()}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Không thể cập nhật trạng thái OT. Vui lòng thử lại!';
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      } else if (errorBody?.errorCode) {
        errorMessage = `${errorBody.errorCode}: ${errorBody.message || errorMessage}`;
      }
    } catch (e) {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * 4. Lấy danh sách OT requests (tất cả hoặc có filter)
 * GET /api/overtimes?employeeId=...&status=...&startDate=...&endDate=...
 */
export const getOTRequests = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.employeeId) params.append('employeeId', filters.employeeId);
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await http(`${JAVA_API}/overtimes${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách OT'}`);
  }

  const result = await response.json();
  return Array.isArray(result) ? result : (result.data || []);
};

/**
 * 5. Lấy chi tiết OT request theo ID
 * GET /api/overtimes/{id}
 */
export const getOTRequestById = async (id) => {
  const response = await http(`${JAVA_API}/overtimes/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải chi tiết OT'}`);
  }

  return await response.json();
};

/**
 * 6. Submit OT report (Employee)
 * PUT /api/overtimes/{id}/report
 */
export const submitOTReport = async (id, reportData) => {
  const response = await http(`${JAVA_API}/overtimes/${id}/report`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      actualHours: reportData.actualHours,
      completedWork: reportData.completedWork,
      progress: reportData.progress,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi nộp báo cáo OT'}`);
  }

  return await response.json();
};

/**
 * 7. Lấy OT requests của nhân viên hiện tại
 * GET /api/employee/overtimes
 */
export const getMyOTRequests = async () => {
  const response = await http(`${JAVA_API}/employee/overtimes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || 'Lỗi khi tải danh sách OT của bạn'}`);
  }

  const result = await response.json();
  return Array.isArray(result) ? result : (result.data || []);
};

export default {
  createOTRequest,
  getOTByStatus,
  setOTStatus,
  getOTRequests,
  getOTRequestById,
  submitOTReport,
  getMyOTRequests,
};

