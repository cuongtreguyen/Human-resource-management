// Auth utility functions

const getStorage = () => (typeof window !== 'undefined' ? window : undefined);
const USER_INFO_KEY = 'userInfo';

export const getRole = () => {
  const win = getStorage();
  if (!win) return null;
  return win.sessionStorage.getItem('userRole');
};

export const setRole = (role) => {
  const win = getStorage();
  if (!win) return;
  win.sessionStorage.setItem('userRole', role);
  win.localStorage.removeItem('userRole');
};

export const clearRole = () => {
  const win = getStorage();
  if (!win) return;
  win.sessionStorage.removeItem('userRole');
  win.localStorage.removeItem('userRole');
  win.sessionStorage.removeItem(USER_INFO_KEY);
};

export const isAuthenticated = () => {
  return !!getRole();
};

export const isAdmin = () => {
  return getRole() === 'admin';
};

export const isEmployee = () => {
  return getRole() === 'employee';
};

export const isManager = () => {
  return getRole() === 'manager';
};

export const isAccountant = () => {
  return getRole() === 'accountant';
};

export const setUserInfo = (info) => {
  const win = getStorage();
  if (!win) return;
  if (!info) {
    win.sessionStorage.removeItem(USER_INFO_KEY);
    return;
  }
  try {
    win.sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
  } catch (error) {
    console.error('Failed to store user info', error);
  }
};

export const getUserInfo = () => {
  const win = getStorage();
  if (!win) return null;
  const raw = win.sessionStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse user info', error);
    win.sessionStorage.removeItem(USER_INFO_KEY);
    return null;
  }
};

export const clearUserInfo = () => {
  const win = getStorage();
  if (!win) return;
  win.sessionStorage.removeItem(USER_INFO_KEY);
};

export const getUserId = () => {
  const userInfo = getUserInfo();
  return userInfo?.employeeId || null;
};

/**
 * Lấy employee ID của user hiện tại
 * Nếu không có trong userInfo, trả về fallback cho demo/testing
 * @returns {string|null} Employee ID hoặc null
 */
export const getCurrentEmployeeId = () => {
  const userInfo = getUserInfo();
  // Nếu có employeeId trong userInfo, dùng nó
  if (userInfo?.employeeId) {
    return userInfo.employeeId;
  }
  // Fallback cho demo/testing - trong production nên throw error
  // hoặc redirect về login nếu không có employeeId
  return 'emp001';
};

