// Auth utility functions - Simple Authentication Module
// Sử dụng sessionStorage để mỗi tab có session riêng biệt
// Cho phép đăng nhập nhiều roles cùng lúc trên các tabs khác nhau

const getStorage = () => (typeof window !== 'undefined' ? window : undefined);

// Keys for storage
const KEYS = {
  USER_ROLE: 'hrm_user_role',
  USER_INFO: 'hrm_user_info',
};

/**
 * Lấy role của user hiện tại
 */
export const getRole = () => {
  const win = getStorage();
  if (!win) return null;
  return win.sessionStorage.getItem(KEYS.USER_ROLE);
};

/**
 * Lưu role
 */
export const setRole = (role) => {
  const win = getStorage();
  if (!win) return;
  win.sessionStorage.setItem(KEYS.USER_ROLE, role);
};

/**
 * Xóa toàn bộ thông tin auth (logout)
 */
export const clearAuth = () => {
  const win = getStorage();
  if (!win) return;

  Object.values(KEYS).forEach(key => {
    win.sessionStorage.removeItem(key);
  });
};

// Alias cho backward compatibility
export const clearRole = clearAuth;

/**
 * Kiểm tra đã đăng nhập chưa
 */
export const isAuthenticated = () => {
  return !!getRole();
};

/**
 * Kiểm tra role helpers
 */
export const isAdmin = () => getRole() === 'admin';
export const isEmployee = () => getRole() === 'employee';
export const isManager = () => getRole() === 'manager';
export const isAccountant = () => getRole() === 'accountant';

/**
 * Lưu thông tin user
 */
export const setUserInfo = (info) => {
  const win = getStorage();
  if (!win) return;

  if (!info) {
    win.sessionStorage.removeItem(KEYS.USER_INFO);
    return;
  }

  try {
    win.sessionStorage.setItem(KEYS.USER_INFO, JSON.stringify(info));
  } catch (error) {
    console.error('Failed to store user info', error);
  }
};

/**
 * Lấy thông tin user
 */
export const getUserInfo = () => {
  const win = getStorage();
  if (!win) return null;

  const raw = win.sessionStorage.getItem(KEYS.USER_INFO);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse user info', error);
    win.sessionStorage.removeItem(KEYS.USER_INFO);
    return null;
  }
};

/**
 * Xóa thông tin user
 */
export const clearUserInfo = () => {
  const win = getStorage();
  if (!win) return;
  win.sessionStorage.removeItem(KEYS.USER_INFO);
};

/**
 * Lấy user ID
 */
export const getUserId = () => {
  const userInfo = getUserInfo();
  return userInfo?.employeeId || null;
};

/**
 * Lấy employee ID của user hiện tại
 */
export const getCurrentEmployeeId = () => {
  const userInfo = getUserInfo();
  return userInfo?.employeeId || null;
};

/**
 * Lấy tên của user hiện tại
 */
export const getCurrentUserName = () => {
  const userInfo = getUserInfo();
  return userInfo?.name || null;
};

/**
 * Lấy department của user hiện tại
 */
export const getCurrentDepartment = () => {
  const userInfo = getUserInfo();
  return userInfo?.department || null;
};

/**
 * Kiểm tra user có quyền truy cập resource không
 */
export const hasAccess = (allowedRoles) => {
  const role = getRole();
  if (!role) return false;
  return allowedRoles.includes(role);
};

/**
 * Lấy route mặc định cho role
 */
export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'employee':
      return '/employee';
    case 'admin':
    case 'manager':
    case 'accountant':
      return '/dashboard';
    default:
      return '/login';
  }
};

/**
 * Lắng nghe thay đổi auth từ các tab khác (không dùng nữa, giữ cho compatibility)
 */
export const onAuthStorageChange = (onAuthChange) => {
  return () => {};
};
