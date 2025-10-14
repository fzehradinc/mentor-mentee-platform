"use client";
import { useState, useEffect } from 'react';

interface LoginParams {
  email: string;
  password: string;
  returnTo?: string;
}

interface RegisterParams {
  email: string;
  password: string;
  role: 'mentee' | 'mentor';
  mentorType?: 'individual' | 'corporate';
  returnTo?: string;
}

interface User {
  id: string;
  email: string;
  role: 'mentee' | 'mentor';
  mentorType?: 'individual' | 'corporate';
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Mock user data - in real app, validate token with backend
          const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password, returnTo }: LoginParams) => {
    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - role will be determined from existing user data
      const userData: User = {
        id: '1',
        email,
        role: 'mentee', // Default role, will be updated from backend
        name: email.split('@')[0]
      };
      
      // Store in localStorage
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
      
      // Redirect logic
      const redirectTo = returnTo || '/dashboard';
      window.location.href = redirectTo;
      
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Giriş yapılamadı');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ email, password, role, mentorType, returnTo }: RegisterParams) => {
    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        email,
        role,
        mentorType,
        name: email.split('@')[0]
      };
      
      // Store in localStorage
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
      
      // Redirect logic
      const redirectTo = returnTo || getDefaultRoute(role, mentorType);
      window.location.href = redirectTo;
      
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Kayıt olunamadı');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDefaultRoute = (role: 'mentee' | 'mentor', mentorType?: 'individual' | 'corporate') => {
    if (role === 'mentee') return '/mentee/onboarding';
    if (role === 'mentor') {
      if (mentorType === 'corporate') return '/mentor/corporate/onboarding';
      return '/mentor/onboarding';
    }
    return '/dashboard';
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}
