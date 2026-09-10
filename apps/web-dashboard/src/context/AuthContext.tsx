import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserDto, AuthResponse } from '../services/api';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(() => {
    const savedUser = localStorage.getItem('pilot_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pilot_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
          localStorage.setItem('pilot_user', JSON.stringify(userData));
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('pilot_token');
          localStorage.removeItem('pilot_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const handleAuthSuccess = (res: AuthResponse) => {
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('pilot_token', res.token);
    localStorage.setItem('pilot_user', JSON.stringify(res.user));
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    handleAuthSuccess(response);
  };

  const register = async (email: string, password: string, fullName: string, role?: string) => {
    const response = await api.register({ email, password, fullName, role });
    handleAuthSuccess(response);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pilot_token');
    localStorage.removeItem('pilot_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
