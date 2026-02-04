'use client';

import { useEffect, useState } from 'react';
import { getAuthToken } from '../lib/auth';

// Decode JWT (DO NOT REMOVE as you requested)
const decodeJwt = (token: string): { userId: number | null } => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { userId: payload.sub ? Number(payload.sub) : null };
  } catch {
    return { userId: null };
  }
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const { userId } = decodeJwt(token);
    if (userId) {
      setIsAuthenticated(true);
      setUserId(userId);
    }
  }, []);

  return { isAuthenticated, userId };
}
