import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'mentor' | 'mentee';
  }) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: any) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock authentication - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Demo users for testing
      const demoUsers = [
        {
          id: '1',
          name: 'Alex Thompson',
          email: 'alex@example.com',
          role: 'mentee' as const,
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'mentor' as const,
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        },
        {
          id: 'mentor_elif30',
          name: 'Elif Kaya',
          email: 'elif@example.com',
          role: 'mentor' as const,
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        },
        {
          id: 'menti_zeynep23',
          name: 'Zeynep Demir',
          email: 'zeynep@example.com',
          role: 'mentee' as const,
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        }
      ];
      
      const foundUser = demoUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      } else {
        setError('Geçersiz e-posta veya şifre');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'mentor' | 'mentee';
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userData.password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır');
        setIsLoading(false);
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400`
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu');
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (password.length < 8) {
        setError('Şifre en az 8 karakter olmalıdır');
        setIsLoading(false);
        return false;
      }

      const existingUsers = ['alex@example.com', 'sarah@example.com', 'elif@example.com'];
      if (existingUsers.includes(email)) {
        throw new Error('User already registered');
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: metadata?.role || 'mentee',
        createdAt: new Date().toISOString(),
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400`
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      if (metadata?.guest_session_id) {
        localStorage.removeItem('beementor_guest_session_id');
        localStorage.removeItem('beementor_onboarding_guest');
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('Bu e-posta adresi zaten kayıtlı');
      } else {
        setError('Kayıt olurken bir hata oluştu');
      }
      setIsLoading(false);
      throw err;
    }
  };

  // Check for existing user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    register,
    signUp,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};