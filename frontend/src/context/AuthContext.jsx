import React, { createContext, useContext, useEffect, useState } from 'react';
import { setToken as storeToken, getToken as readToken, clearToken as removeToken, parseToken } from '../auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => readToken());
  const [user, setUser] = useState(() => parseToken());

  useEffect(() => {
    // keep user in sync with token
    setUser(parseToken());
  }, [token]);

  const login = (t) => {
    storeToken(t);
    setTokenState(t);
    setUser(parseToken());
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    // navigate to login via location to be safe from hooks
    window.location.href = '/login';
  };

  const value = {
    token,
    user,
    isLoggedIn: !!token,
    isAdmin: !!(user && (user.is_admin === 1 || user.is_admin === true)),
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
