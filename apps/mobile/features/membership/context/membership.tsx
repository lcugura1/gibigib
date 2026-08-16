import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MembershipDto } from '@gibigib/types';
import { useAuth } from '@/features/auth/context/auth';
import { fetchActiveMembership } from '@/features/membership/services/membership';

type MembershipContextValue = {
  membership: MembershipDto | null;
  status: 'loading' | 'ready' | 'error';
  refresh: () => Promise<void>;
};

const MembershipContext = createContext<MembershipContextValue | null>(null);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const [membership, setMembership] = useState<MembershipDto | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const refresh = useCallback(async () => {
    try {
      const data = await fetchActiveMembership();
      setMembership(data.membership);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      setMembership(null);
      setStatus('loading');
      return;
    }
    refresh();
  }, [isReady, user, refresh]);

  const value = useMemo<MembershipContextValue>(
    () => ({ membership, status, refresh }),
    [membership, status, refresh],
  );

  return <MembershipContext value={value}>{children}</MembershipContext>;
}

export function useMembership() {
  const context = use(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used inside MembershipProvider');
  }
  return context;
}
