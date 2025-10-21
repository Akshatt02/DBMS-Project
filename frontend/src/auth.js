export const tokenKey = 'cpms_token';

export const setToken = (token) => {
  localStorage.setItem(tokenKey, token);
};

export const getToken = () => {
  return localStorage.getItem(tokenKey);
};

export const clearToken = () => {
  localStorage.removeItem(tokenKey);
};

export const isLoggedIn = () => !!getToken();

// Decode JWT payload without verifying (for client-side UI purposes only)
export const parseToken = () => {
  const t = getToken();
  if (!t) return null;
  try {
    const parts = t.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (err) {
    return null;
  }
};

export const isAdmin = () => {
  const p = parseToken();
  return !!(p && (p.is_admin === 1 || p.is_admin === true));
};