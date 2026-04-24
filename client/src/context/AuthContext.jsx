// client/src/context/AuthContext.jsx — Global auth state

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'carmax_token';
const USER_KEY  = 'carmax_user';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true); // initial hydration

  // ── Persist helpers ────────────────────────────────────────────────────
  const saveSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // ── Hydrate user on mount (validates stored token) ─────────────────────
  useEffect(() => {
    const hydrate = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await authApi.getMe();
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await authApi.register(formData);
    saveSession(data.token, data.user);
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    saveSession(data.token, data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
