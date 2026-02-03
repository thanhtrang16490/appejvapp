'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthState } from '@/types';
import { mockAuthService } from '@/services/mock-auth';
import { auth as authService } from '@/services';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => Promise<void>;
  getUser: () => Promise<User | null>;
  updateUser: (userInfo: Partial<User>) => Promise<User | null>;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  authState: defaultAuthState,
  login: async () => null,
  logout: async () => {},
  getUser: async () => null,
  updateUser: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await mockAuthService.isAuthenticated();
        if (isAuthenticated) {
          const user = await mockAuthService.getCurrentUser();
          setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
        } else {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
      } catch {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: 'Error checking authentication' });
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.login(credentials);
      if (user) {
        await mockAuthService.storeUserData(user); // Keep using mock for storage
        setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
        return user;
      }
      setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: 'Invalid credentials' });
      return null;
    } catch {
      // Fallback to mock service
      try {
        const user = await mockAuthService.login(credentials);
        if (user) {
          await mockAuthService.storeUserData(user);
          setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
          return user;
        }
      } catch (fallbackError) {
        console.error('Fallback login error:', fallbackError);
      }
      setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: 'Login failed' });
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch {
      // Fallback to mock service
      try {
        await mockAuthService.logout();
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      } catch (fallbackError) {
        console.error('Fallback logout error:', fallbackError);
        setAuthState(prev => ({ ...prev, error: 'Logout failed' }));
      }
    }
  };

  const getUser = async (): Promise<User | null> => {
    try {
      return await authService.getCurrentUser();
    } catch {
      // Fallback to mock service
      try {
        return await mockAuthService.getCurrentUser();
      } catch (fallbackError) {
        console.error('Fallback getUser error:', fallbackError);
        return null;
      }
    }
  };

  const updateUser = async (userInfo: Partial<User>): Promise<User | null> => {
    try {
      const updatedUser = await mockAuthService.updateUserProfile(userInfo);
      if (updatedUser) {
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        return updatedUser;
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, getUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
