'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
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
        // Check for authentication token and user data in cookies
        const authToken = Cookies.get('auth-token');
        const userDataStr = Cookies.get('user-data');
        
        if (authToken && userDataStr) {
          try {
            const user = JSON.parse(userDataStr) as User;
            setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
          } catch (parseError) {
            // If parsing fails, clear cookies and set unauthenticated state
            Cookies.remove('auth-token');
            Cookies.remove('user-data');
            setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
          }
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
        // Store user data and auth token in cookies
        Cookies.set('auth-token', `token-${user.id}`, { expires: 7, secure: true, sameSite: 'strict' });
        Cookies.set('user-data', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
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
          // Store user data and auth token in cookies
          Cookies.set('auth-token', `token-${user.id}`, { expires: 7, secure: true, sameSite: 'strict' });
          Cookies.set('user-data', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
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
      // Clear cookies
      Cookies.remove('auth-token');
      Cookies.remove('user-data');
      setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      toast.success('Đăng xuất thành công');
    } catch {
      // Fallback to mock service
      try {
        await mockAuthService.logout();
        // Clear cookies
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        toast.success('Đăng xuất thành công');
      } catch (fallbackError) {
        console.error('Fallback logout error:', fallbackError);
        // Still clear cookies even if logout fails
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        toast.error('Có lỗi xảy ra khi đăng xuất');
      }
    }
  };

  const getUser = async (): Promise<User | null> => {
    try {
      // First try to get from cookies
      const userDataStr = Cookies.get('user-data');
      if (userDataStr) {
        return JSON.parse(userDataStr) as User;
      }
      
      // Fallback to service
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
        // Update cookies with new user data
        Cookies.set('user-data', JSON.stringify(updatedUser), { expires: 7, secure: true, sameSite: 'strict' });
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        toast.success('Cập nhật thông tin thành công');
        return updatedUser;
      }
      toast.error('Không thể cập nhật thông tin');
      return null;
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
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
