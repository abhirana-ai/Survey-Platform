import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('survey_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('survey_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('survey_token');
    const storedUser = localStorage.getItem('survey_user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem('survey_token', response.token);
    localStorage.setItem('survey_user', JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const register = async (payload) => registerUser(payload);

  const logout = () => {
    localStorage.removeItem('survey_token');
    localStorage.removeItem('survey_user');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('auth:logout'));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
