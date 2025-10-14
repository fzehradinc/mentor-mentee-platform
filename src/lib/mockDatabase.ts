/**
 * Mock Database - localStorage based simple user storage
 * Used when Supabase is not configured
 */

interface MockUser {
  id: string;
  email: string;
  password: string; // In real DB this would be hashed!
  fullName: string;
  role: 'mentee' | 'mentor';
  createdAt: string;
  // Additional data
  menteeData?: any;
  mentorData?: any;
}

const MOCK_DB_KEY = 'bimentor_mock_users';

export class MockDatabase {
  private static getUsers(): MockUser[] {
    const data = localStorage.getItem(MOCK_DB_KEY);
    return data ? JSON.parse(data) : [];
  }

  private static saveUsers(users: MockUser[]): void {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
  }

  /**
   * Register a new user
   */
  static registerUser(userData: {
    email: string;
    password: string;
    fullName: string;
    role: 'mentee' | 'mentor';
    additionalData?: any;
  }): { success: boolean; userId: string; user: any; mentorType?: string } {
    const users = this.getUsers();

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Bu e-posta adresi zaten kayıtlı');
    }

    const newUser: MockUser = {
      id: crypto.randomUUID(),
      email: userData.email,
      password: userData.password, // ⚠️ MOCK ONLY - never store plain passwords in real DB!
      fullName: userData.fullName,
      role: userData.role,
      createdAt: new Date().toISOString(),
      ...(userData.role === 'mentee' && { menteeData: userData.additionalData }),
      ...(userData.role === 'mentor' && { mentorData: userData.additionalData })
    };

    users.push(newUser);
    this.saveUsers(users);

    console.log('✅ Mock DB: User registered', newUser.email);

    return {
      success: true,
      userId: newUser.id,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    };
  }

  /**
   * Login - verify credentials
   */
  static login(email: string, password: string): { 
    success: boolean; 
    user: { id: string; email: string; full_name: string; role: string } 
  } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('E-posta veya şifre hatalı');
    }

    console.log('✅ Mock DB: User logged in', user.email, 'Role:', user.role);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role
      }
    };
  }

  /**
   * Get all registered users (for debugging)
   */
  static getAllUsers(): MockUser[] {
    return this.getUsers();
  }

  /**
   * Clear all users (reset)
   */
  static clearAll(): void {
    localStorage.removeItem(MOCK_DB_KEY);
    console.log('🗑️ Mock DB: Cleared all users');
  }
}

// Export for debugging in console
if (typeof window !== 'undefined') {
  (window as any).MockDB = MockDatabase;
}

