import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, getToken, loginUser, registerUser, setToken as persistToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    let active = true;
    if (!token) {
      setLoading(false);
      setUser(null);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    fetchMe()
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (!active) return;
        persistToken(null);
        setTokenState(null);
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    persistToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    persistToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
