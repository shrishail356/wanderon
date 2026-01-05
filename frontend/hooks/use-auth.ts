'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';

export function useAuth() {
  const { user, setUser, setLoading, isAuthenticated } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check auth if we don't already have a user
    // This prevents overriding the user set during registration/login
    if (hasChecked.current || user) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      hasChecked.current = true;
      setLoading(true);
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          // Backend returns { success: true, data: { user: ... } }
          const user = response.data.data?.user;
          if (user) {
            setUser({
              id: user._id || user.id,
              email: user.email,
              name: user.name || user.email.split('@')[0],
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, setUser, setLoading]);

  return { isAuthenticated };
}

