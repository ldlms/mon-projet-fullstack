import { useCallback } from 'react';

export const useAuth = () => {
  const getAuthToken = useCallback((): string | null => {
    return localStorage.getItem('token');
  }, []);

  const getUser = useCallback(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }, []);

  return { getAuthToken, getUser, redirectToLogin };
};