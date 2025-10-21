import createApi from './api';
import { getToken, clearToken } from './auth';

const onUnauthorized = () => {
  clearToken();
  window.location.href = '/login';
};

export const api = createApi({ getToken, onUnauthorized });

export default api;
