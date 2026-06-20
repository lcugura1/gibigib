import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TAG_COLORS, DEFAULT_COLOR_LABELS, initialVisits, type Visit } from '@/features/attendance/data/visits';

const STORAGE_KEY = 'attendance:v1';

type AttendanceContextValue = {
  visits: Visit[];
  colorOptions: string[];
  colorLabels: Record<string, string>;
  selectedDate: string | null;
  selectDate: (date: string) => void;
  clearSelection: () => void;
  tagVisit: (date: string, color: string, label: string) => void;
};

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [colorLabels, setColorLabels] = useState<Record<string, string>>(DEFAULT_COLOR_LABELS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as {
            visits?: Visit[];
            colorLabels?: Record<string, string>;
          };
          if (saved.visits) setVisits(saved.visits);
          if (saved.colorLabels) setColorLabels({ ...DEFAULT_COLOR_LABELS, ...saved.colorLabels });
        }
      } catch {
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ visits, colorLabels })).catch(() => {});
  }, [hydrated, visits, colorLabels]);

  const value = useMemo<AttendanceContextValue>(
    () => ({
      visits,
      colorOptions: TAG_COLORS,
      colorLabels,
      selectedDate,
      selectDate: (date) => setSelectedDate(date),
      clearSelection: () => setSelectedDate(null),
      tagVisit: (date, color, label) => {
        const trimmed = label.trim();
        setVisits((current) =>
          current.map((visit) =>
            visit.date === date ? { ...visit, color, label: trimmed } : visit,
          ),
        );
        setColorLabels((current) => ({ ...current, [color]: trimmed }));
      },
    }),
    [visits, colorLabels, selectedDate],
  );

  return <AttendanceContext value={value}>{children}</AttendanceContext>;
}

export function useAttendance() {
  const context = use(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used inside AttendanceProvider');
  }
  return context;
}
