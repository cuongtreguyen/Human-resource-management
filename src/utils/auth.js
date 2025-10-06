// Auth utility functions

export const getRole = () => {
  return localStorage.getItem('userRole');
};

export const setRole = (role) => {
  localStorage.setItem('userRole', role);
};

export const clearRole = () => {
  localStorage.removeItem('userRole');
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
