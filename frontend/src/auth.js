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