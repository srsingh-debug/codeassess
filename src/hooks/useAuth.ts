import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { authApi, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get user from token
  const refreshUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
          isEmailVerified: response.data.isEmailVerified,
          createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
        };
        setUser(userData);
        localStorage.setItem('auth-user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('auth-user');
    const token = getAuthToken();
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Verify token is still valid by fetching current user
        refreshUser();
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        removeAuthToken();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        // Store tokens
        setAuthToken(response.data.accessToken, response.data.refreshToken);
        
        // Store user data
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          isEmailVerified: response.data.user.isEmailVerified,
        };
        
        setUser(userData);
        localStorage.setItem('auth-user', JSON.stringify(userData));
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const response = await authApi.register({ email, password, name, role });
      
      if (response.success && response.data) {
        // Store tokens
        setAuthToken(response.data.accessToken, response.data.refreshToken);
        
        // Store user data
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          isEmailVerified: response.data.user.isEmailVerified,
        };
        
        setUser(userData);
        localStorage.setItem('auth-user', JSON.stringify(userData));
        
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      
      // Extract error message from response
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.error) {
        if (error.response.data.error.details) {
          // Validation errors
          const details = error.response.data.error.details;
          errorMessage = details.map((d: any) => d.message).join(', ');
        } else {
          errorMessage = error.response.data.error.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      removeAuthToken();
      navigate('/');
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: { user, login, register, logout, isLoading, refreshUser }
  }, children);
};