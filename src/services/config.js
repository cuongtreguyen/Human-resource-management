// src/services/config.js
// Nơi cấu hình base URL cho Python (Flask) và Java (Spring Boot)

export const PY_API =
  (import.meta?.env?.VITE_PY_API) || 'http://localhost:5000/api';

export const JAVA_API =
  (import.meta?.env?.VITE_JAVA_API) || 'http://localhost:8080/api';

// Helper fetch có timeout để tránh “treo” request
export async function http(url, opts = {}, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}
