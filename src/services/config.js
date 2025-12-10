// src/services/config.js
// Nơi cấu hình base URL cho Python (Flask) và Java (Spring Boot)

export const PY_API =
  (import.meta?.env?.VITE_PY_API) || 'http://127.0.0.1:5000';

// Production - dùng relative URL (same domain với FE)
// export const JAVA_API = '/api';
// Local dev
export const JAVA_API = 'http://localhost:8085/api';

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
