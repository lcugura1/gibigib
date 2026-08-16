import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { ENTRY_QR_PREFIX } from '@gibigib/types';
import { fetchEntryToken } from '@/features/home/services/entry';

const REFRESH_INTERVAL_MS = 60_000;

export function useEntryToken(enabled: boolean) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setToken(null);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const data = await fetchEntryToken();
        if (active) setToken(data.token);
      } catch {}
    };

    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') load();
    });

    return () => {
      active = false;
      clearInterval(interval);
      subscription.remove();
    };
  }, [enabled]);

  return { qrValue: token ? `${ENTRY_QR_PREFIX}${token}` : null };
}
