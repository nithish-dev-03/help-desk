import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthSessionUser, UserLoginPayload, UserRegistrationPayload, UserRole } from '@/types/auth';
import { authApi } from './auth-api';
import { getCookie, parseJwt } from '@/lib/utils';
import { queryClient } from '@/app/query-client';

interface AuthContextType {
  user: AuthSessionUser | null;
  actualRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: UserLoginPayload) => Promise<void>;
  register: (payload: UserRegistrationPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_COOKIE_NAME = import.meta.env.VITE_SESSION_COOKIE_NAME || 'helpdesk';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actualUser, setActualUser] = useState<AuthSessionUser | null>(() => {
    try {
      const stored = localStorage.getItem('helpdesk_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = actualUser;

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      queryClient.clear();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const token = getCookie(SESSION_COOKIE_NAME);
    const payload = token
      ? parseJwt<{ sub: string; email: string; role: UserRole; exp: number }>(token)
      : null;

    if (!payload || !payload.sub || payload.exp * 1000 <= Date.now()) {
      clearSession();
    } else {
      const sessionUser: AuthSessionUser = {
        id: parseInt(payload.sub, 10),
        email: payload.email,
        name: actualUser?.name || payload.email.split('@')[0],
        role: payload.role,
      };
      setActualUser(sessionUser);
      localStorage.setItem('helpdesk_user', JSON.stringify(sessionUser));
    }
    setIsLoading(false);
  }, []);

  const clearSession = () => {
    setActualUser(null);
    localStorage.removeItem('helpdesk_user');
  };

  const login = async (payload: UserLoginPayload) => {
    await authApi.login(payload);
    const token = getCookie(SESSION_COOKIE_NAME);
    const jwtData = token
      ? parseJwt<{ sub: string; email: string; role: UserRole }>(token)
      : null;

    if (!jwtData?.sub || !jwtData.email || !jwtData.role) {
      throw new Error('Login succeeded, but the session cookie was not established.');
    }

    const sessionUser: AuthSessionUser = {
      id: parseInt(jwtData.sub, 10),
      email: jwtData.email,
      name: payload.email.split('@')[0],
      role: jwtData.role,
    };
    setActualUser(sessionUser);
    localStorage.setItem('helpdesk_user', JSON.stringify(sessionUser));
    queryClient.invalidateQueries();
  };

  const register = async (payload: UserRegistrationPayload) => {
    await authApi.register(payload);
    clearSession();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network failure on logout; local session still must be cleared.
    } finally {
      clearSession();
      queryClient.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        actualRole: actualUser?.role ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
