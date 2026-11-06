import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthSessionUser, UserLoginPayload, UserRegistrationPayload, UserRole } from '@/types/auth';
import { authApi } from './auth-api';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actualUser, setActualUser] = useState<AuthSessionUser | null>(null);
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
    let mounted = true;

    const restoreSession = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (mounted && response.status && response.user) {
          setActualUser(response.user);
          localStorage.setItem('helpdesk_user', JSON.stringify(response.user));
        }
      } catch {
        // A missing or expired HttpOnly cookie means there is no session.
        if (mounted) clearSession();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const clearSession = () => {
    setActualUser(null);
    localStorage.removeItem('helpdesk_user');
  };

  const login = async (payload: UserLoginPayload) => {
    await authApi.login(payload);
    const response = await authApi.getCurrentUser();
    if (!response.status || !response.user) {
      throw new Error('Login succeeded, but the current user could not be loaded.');
    }

    setActualUser(response.user);
    localStorage.setItem('helpdesk_user', JSON.stringify(response.user));
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
