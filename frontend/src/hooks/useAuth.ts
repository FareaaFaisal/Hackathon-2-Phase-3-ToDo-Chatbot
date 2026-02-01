// frontend/src/hooks/useAuth.ts
"use client";
import { useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken } from '../lib/auth';

const decodeJwt = (token: string): { userId: string | null } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return { userId: payload.sub || payload.user_id || null };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return { userId: null };
  }
};

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
}

export const useAuth = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) {
      const { userId: decodedUserId } = decodeJwt(storedToken);
      if (decodedUserId) {
        setIsAuthenticated(true);
        setUserId(decodedUserId);
        setToken(storedToken);
      } else {
        removeAuthToken();
        setIsAuthenticated(false);
        setUserId(null);
        setToken(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserId(null);
      setToken(null);
    }
  }, []);

  return { isAuthenticated, userId, token };
};
