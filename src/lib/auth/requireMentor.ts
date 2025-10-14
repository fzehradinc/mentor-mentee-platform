/**
 * requireMentor - Server-side auth guard for mentor-only pages
 */

import { getCurrentUser } from './requireMentee';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'mentee' | 'mentor' | 'admin';
}

export async function requireMentor(): Promise<AuthUser> {
  // Browser-side için localStorage kontrolü
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      // Redirect to login
      window.location.href = '/';
      throw new Error('Not authenticated');
    }

    const user: AuthUser = JSON.parse(userStr);

    if (user.role !== 'mentor') {
      // Redirect to mentee dashboard if not mentor
      window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'mentee-dashboard' }));
      throw new Error('Not a mentor');
    }

    return user;
  }

  // Server-side fallback
  throw new Error('requireMentor called on server');
}

/**
 * getMentorProfile - Get full mentor profile data
 */
export function getMentorProfile(): any {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  const user = JSON.parse(userStr);
  if (user.role !== 'mentor') return null;

  return user;
}


