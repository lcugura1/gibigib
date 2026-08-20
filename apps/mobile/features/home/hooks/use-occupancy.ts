import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { OccupancyDto } from '@gibigib/types';
import { fetchOccupancy } from '@/features/home/services/entry';

const POLL_INTERVAL_MS = 5000;

export function useOccupancy() {
  const [occupancy, setOccupancy] = useState<OccupancyDto | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        try {
          const data = await fetchOccupancy();
          if (active) setOccupancy(data);
        } catch {}
      };

      load();
      const interval = setInterval(load, POLL_INTERVAL_MS);

      return () => {
        active = false;
        clearInterval(interval);
      };
    }, []),
  );

  return occupancy;
}
