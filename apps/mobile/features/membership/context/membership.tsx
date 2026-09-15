import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MembershipDto } from '@gibigib/types';
import { useAuth } from '@/features/auth/context/auth';
import {
  fetchActiveMembership,
  pauseMembership,
  resumeMembership,
} from '@/features/membership/services/membership';

export type MembershipNotice = 'resumed' | 'auto-resumed';

type MembershipContextValue = {
  membership: MembershipDto | null;
  status: 'loading' | 'ready' | 'error';
  notice: MembershipNotice | null;
  refresh: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  clearNotice: () => void;
};

const MembershipContext = createContext<MembershipContextValue | null>(null);

const NOTICE_SEEN_KEY = 'membership-pause-notice-seen';
const MAX_TIMEOUT_MS = 2_147_483_647;

function autoResumedPauseId(membership: MembershipDto | null) {
  const pause = membership?.lastPause;
  return pause?.endedAt && pause.endedAt === pause.endsAt ? pause.id : null;
}

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const [membership, setMembership] = useState<MembershipDto | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [notice, setNotice] = useState<MembershipNotice | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchActiveMembership();
      setMembership(data.membership);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  const pause = useCallback(async () => {
    setMembership(await pauseMembership());
  }, []);

  const resume = useCallback(async () => {
    const data = await resumeMembership();
    if (data.lastPause) {
      await AsyncStorage.setItem(NOTICE_SEEN_KEY, data.lastPause.id).catch(() => {});
    }
    setMembership(data);
    setNotice('resumed');
  }, []);

  const clearNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      setMembership(null);
      setStatus('loading');
      setNotice(null);
      return;
    }
    refresh();
  }, [isReady, user, refresh]);

  useEffect(() => {
    const pauseId = autoResumedPauseId(membership);
    if (!pauseId) return;

    let active = true;
    (async () => {
      const seen = await AsyncStorage.getItem(NOTICE_SEEN_KEY).catch(() => null);
      if (!active || seen === pauseId) return;
      await AsyncStorage.setItem(NOTICE_SEEN_KEY, pauseId).catch(() => {});
      setNotice('auto-resumed');
    })();

    return () => {
      active = false;
    };
  }, [membership]);

  useEffect(() => {
    const pauseEndsAt = membership?.status === 'PAUSED' ? membership.lastPause?.endsAt : null;
    if (!pauseEndsAt) return;

    const delay = Math.min(Math.max(new Date(pauseEndsAt).getTime() - Date.now(), 0) + 1_000, MAX_TIMEOUT_MS);
    const timeout = setTimeout(refresh, delay);
    return () => clearTimeout(timeout);
  }, [membership, refresh]);

  const value = useMemo<MembershipContextValue>(
    () => ({ membership, status, notice, refresh, pause, resume, clearNotice }),
    [membership, status, notice, refresh, pause, resume, clearNotice],
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
