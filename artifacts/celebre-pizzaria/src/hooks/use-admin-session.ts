import { useCallback, useEffect, useState } from 'react';
import type { AdminSession } from '@/lib/admin-types';
import { getAdminSession, loginAdmin, logoutAdmin } from '@/lib/admin-client';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function useAdminSession() {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [session, setSession] = useState<AdminSession | null>(null);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const nextSession = await getAdminSession();
      setSession(nextSession);
      setStatus(nextSession ? 'authenticated' : 'unauthenticated');
      setError(null);
    } catch (cause) {
      setSession(null);
      setStatus('unauthenticated');
      setError(cause);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (username: string, password: string) => {
    const nextSession = await loginAdmin(username, password);
    setSession(nextSession);
    setStatus('authenticated');
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  return { status, session, error, login, logout, refresh };
}
