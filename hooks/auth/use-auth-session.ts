import { useState, useEffect, useCallback } from 'react';

export type UserRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'DIRECTOR' | 'TEAM_LEADER' | 'AGENT' | 'ACCOUNTANT';

export interface AuthSession {
  token: string | null;
  role: UserRoleType | null;
  isAuthenticated: boolean;
  hasRole: (allowedRoles: UserRoleType[]) => boolean;
  logout: () => void;
}

export function useAuthSession(): AuthSession {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRoleType | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem('nova_auth_token') || null;
    const savedRole = (localStorage.getItem('nova_auth_role') as UserRoleType) || null;

    setToken(savedToken);
    setRole(savedRole);
  }, []);

  const hasRole = useCallback(
    (allowedRoles: UserRoleType[]): boolean => {
      if (!role) return false;
      if (role === 'SUPER_ADMIN') return true;
      return allowedRoles.includes(role);
    },
    [role]
  );

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nova_auth_token');
      localStorage.removeItem('nova_auth_role');
      document.cookie = 'nova_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'nova_auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/login';
    }
  }, []);

  return {
    token,
    role,
    isAuthenticated: Boolean(token),
    hasRole,
    logout,
  };
}
