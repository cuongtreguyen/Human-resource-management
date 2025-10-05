// Simple role-based auth helpers using localStorage

const ROLE_KEY = 'app.role'; // 'admin' | 'employee'

export function getRole() {
  const role = typeof window !== 'undefined' ? window.localStorage.getItem(ROLE_KEY) : null;
  return role || null;
}

export function setRole(role) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ROLE_KEY, role);
  }
}

export function clearRole() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ROLE_KEY);
  }
}

export function isAdmin() {
  return getRole() === 'admin';
}

export function isEmployee() {
  return getRole() === 'employee';
}


