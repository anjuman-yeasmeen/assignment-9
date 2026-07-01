// Client-side API layer. All requests go to the standalone Express backend at
// NEXT_PUBLIC_API_URL. The JWT is kept in localStorage and sent as a Bearer
// token; `credentials: 'include'` is also set so the cookie-based Google OAuth
// flow works without extra handling.

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const TOKEN_KEY = 'ideavault_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined' || !token) return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

// Absolute URL for a backend path (e.g. for full-page redirects like OAuth).
export function apiUrl(path) {
  return `${API_URL}${path}`;
}

// Thin fetch wrapper: sends/receives JSON, attaches auth, and throws a useful
// Error (with the server's message) on non-2xx responses.
export async function apiFetch(path, { headers, ...options } = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
