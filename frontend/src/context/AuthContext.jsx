import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (result.success) {
          setUser(result.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.data);
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server communication error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        setToken(result.token);
        setUser(result.data);
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Signup failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server communication error' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Server communication error' };
    }
  };

  const verifyOtp = async (email, otp, newPassword) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Server communication error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, forgotPassword, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
