// src/services/notificationService.js
import { http, JAVA_API } from './config.js';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

// ============================================
// NOTIFICATION APIs
// ============================================

/**
 * 1. Lấy danh sách notifications
 * GET /api/notifications
 * Query Parameters:
 *   - read: Boolean (optional) - Filter theo trạng thái đọc (true/false)
 *   - type: String (optional) - Filter theo loại (reminder/alert/info/success/warning/error)
 */
export const getNotifications = async (read = null, type = null) => {
  const params = new URLSearchParams();
  if (read !== null && read !== undefined) {
    params.append('read', read.toString());
  }
  if (type) {
    params.append('type', type);
  }

  const queryString = params.toString();
  const url = `${JAVA_API}/notifications${queryString ? `?${queryString}` : ''}`;

  // Debug: Kiểm tra token
  const token = localStorage.getItem('accessToken');
  console.log('🔐 Notification API Debug:', {
    url,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
    userRole: localStorage.getItem('hrm_user_role') || 'UNKNOWN',
  });

  const response = await http(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Lỗi khi tải danh sách thông báo';
    let errorText = '';
    try {
      errorText = await response.text();
      if (errorText) {
        // Cố gắng parse JSON error response từ backend
        try {
          const errorObj = JSON.parse(errorText);
          errorMessage = errorObj.message || errorObj.error || errorMessage;
        } catch {
          // Nếu không phải JSON, dùng text gốc
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    // Xử lý lỗi 403 Forbidden
    if (response.status === 403) {
      errorMessage = 'Không có quyền truy cập. Vui lòng kiểm tra:\n1. Token có hợp lệ không?\n2. Role có quyền truy cập endpoint này không?\n3. Backend có cho phép role của bạn truy cập không?';
    }
    
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.message = errorMessage;
    throw error;
  }

  return await response.json();
};

/**
 * 2. Đánh dấu 1 notification đã đọc
 * PUT /api/notifications/{id}/read
 */
export const markAsRead = async (id) => {
  console.log('📝 Marking notification as read:', { id, url: `${JAVA_API}/notifications/${id}/read` });
  
  const response = await http(`${JAVA_API}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Lỗi khi đánh dấu thông báo đã đọc';
    let errorText = '';
    try {
      errorText = await response.text();
      if (errorText) {
        try {
          const errorObj = JSON.parse(errorText);
          errorMessage = errorObj.message || errorObj.error || errorMessage;
        } catch {
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    // Xử lý lỗi 403 Forbidden
    if (response.status === 403) {
      errorMessage = 'Không có quyền đánh dấu thông báo đã đọc. Vui lòng kiểm tra quyền truy cập.';
    }
    
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.message = errorMessage;
    throw error;
  }

  const result = await response.json();
  console.log('✅ Marked notification as read:', result);
  return result;
};

/**
 * 3. Đánh dấu tất cả notifications đã đọc
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async () => {
  console.log('📝 Marking all notifications as read:', { url: `${JAVA_API}/notifications/read-all` });
  
  const response = await http(`${JAVA_API}/notifications/read-all`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'Lỗi khi đánh dấu tất cả thông báo đã đọc';
    let errorText = '';
    try {
      errorText = await response.text();
      if (errorText) {
        try {
          const errorObj = JSON.parse(errorText);
          errorMessage = errorObj.message || errorObj.error || errorMessage;
        } catch {
          errorMessage = errorText;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    // Xử lý lỗi 403 Forbidden
    if (response.status === 403) {
      errorMessage = 'Không có quyền đánh dấu tất cả thông báo đã đọc. Vui lòng kiểm tra quyền truy cập.';
    }
    
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.message = errorMessage;
    throw error;
  }

  const result = await response.json();
  console.log('✅ Marked all notifications as read:', result);
  return result;
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
};


