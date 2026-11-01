'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfileResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types';
import { authService } from '@/services';

interface AuthContextValue {
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<UserProfileResponse>;
  register: (data: RegisterRequest) => Promise<UserProfileResponse>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = useCallback(async () => {
    if (!authService.hasToken()) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profile = await authService.getMe();
      setUser(profile);
      setIsAuthenticated(true);
    } catch {
      const cached = authService.getStoredProfile();
      if (cached) {
        setUser(cached);
        setIsAuthenticated(true);
      } else {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (data: LoginRequest): Promise<UserProfileResponse> => {
    await authService.login(data);
    const profile = await authService.getMe();
    setUser(profile);
    setIsAuthenticated(true);
    return profile;
  };

  const register = async (data: RegisterRequest): Promise<UserProfileResponse> => {
    await authService.register(data);
    const profile = await authService.getMe();
    setUser(profile);
    setIsAuthenticated(true);
    return profile;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
