/**
 * requireMentee - Server-side auth guard for mentee-only pages
 * 
 * Usage in page.tsx:
 * const user = await requireMentee();
 */

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'mentee' | 'mentor' | 'admin';
}

export async function requireMentee(): Promise<AuthUser> {
  // Browser-side için localStorage kontrolü
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      // Redirect to login
      window.location.href = '/';
      throw new Error('Not authenticated');
    }

    const user: AuthUser = JSON.parse(userStr);

    if (user.role !== 'mentee') {
      // Redirect to home if not mentee
      window.location.href = '/';
      throw new Error('Not a mentee');
    }

    return user;
  }

  // Server-side fallback (Next.js için)
  // Şu an Vite kullanıyoruz, bu kısım gelecekte Next.js'e geçişte aktif olacak
  throw new Error('requireMentee called on server');
}

/**
 * getCurrentUser - Get current user without redirect
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * logout - Clear user session
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}


