import { useState, useEffect } from 'react';

type Role = 'mentor' | 'mentee' | null;

/**
 * Custom hook for managing user role selection
 * Provides functions to get and set user role in localStorage
 */
export const useRole = () => {
  const [role, setRoleState] = useState<Role>(null);

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem('mh_role') as Role;
    if (savedRole === 'mentor' || savedRole === 'mentee') {
      setRoleState(savedRole);
    }
  }, []);

  const getRole = (): Role => {
    if (typeof window === 'undefined') return null;
    const savedRole = localStorage.getItem('mh_role') as Role;
    return savedRole === 'mentor' || savedRole === 'mentee' ? savedRole : null;
  };

  const setRole = (newRole: Role) => {
    if (typeof window === 'undefined') return;
    
    if (newRole) {
      localStorage.setItem('mh_role', newRole);
    } else {
      localStorage.removeItem('mh_role');
    }
    setRoleState(newRole);
  };

  const clearRole = () => {
    setRole(null);
  };

  return {
    role,
    getRole,
    setRole,
    clearRole
  };
};

export default useRole;