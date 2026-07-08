import type { VisitDto } from '@gibigib/types';
import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/context/auth';
import { fetchVisits, saveTag } from '@/features/attendance/services/attendance';
import { TAG_COLORS, DEFAULT_COLOR_LABELS, initialVisits, type Visit } from '@/features/attendance/data/visits';

type Status = 'loading' | 'ready' | 'error';

type AttendanceContextValue = {
  visits: Visit[];
  colorOptions: string[];
  colorLabels: Record<string, string>;
  selectedDate: string | null;
  status: Status;
  errorMessage: string | null;
  selectDate: (date: string) => void;
  clearSelection: () => void;
  tagVisit: (date: string, color: string, label: string) => void;
};

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

function mergeVisits(seed: Visit[], server: VisitDto[]): Visit[] {
  const byDate = new Map<string, Visit>();
  for (const visit of seed) byDate.set(visit.date, visit);
  for (const dto of server) {
    const existing = byDate.get(dto.date);
    byDate.set(dto.date, {
      id: dto.id,
      date: dto.date,
      time: dto.time ?? existing?.time ?? '',
      color: dto.color,
      label: dto.label,
    });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !user) return;
    let cancelled = false;
    setStatus('loading');
    fetchVisits()
      .then((server) => {
        if (cancelled) return;
        setVisits(mergeVisits(initialVisits, server));
        setStatus('ready');
        setErrorMessage(null);
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage('Nije moguće učitati treninge.');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user?.id]);

  const colorLabels = useMemo(() => {
    const derived: Record<string, string> = { ...DEFAULT_COLOR_LABELS };
    for (const visit of visits) {
      if (visit.color && visit.label) derived[visit.color] = visit.label;
    }
    return derived;
  }, [visits]);

  const value = useMemo<AttendanceContextValue>(
    () => ({
      visits,
      colorOptions: TAG_COLORS,
      colorLabels,
      selectedDate,
      status,
      errorMessage,
      selectDate: (date) => setSelectedDate(date),
      clearSelection: () => setSelectedDate(null),
      tagVisit: (date, color, label) => {
        const trimmed = label.trim();
        const snapshot = visits;
        const existing = visits.find((visit) => visit.date === date);
        const time = existing?.time ?? '';

        const optimistic = existing
          ? visits.map((visit) =>
              visit.date === date ? { ...visit, color, label: trimmed } : visit,
            )
          : [...visits, { id: date, date, time, color, label: trimmed }].sort((a, b) =>
              a.date.localeCompare(b.date),
            );

        setVisits(optimistic);
        setErrorMessage(null);

        saveTag({ date, time: time || undefined, color, label: trimmed })
          .then((saved) => {
            setVisits((current) =>
              current.map((visit) =>
                visit.date === date
                  ? { ...visit, id: saved.id, time: saved.time ?? visit.time, color: saved.color, label: saved.label }
                  : visit,
              ),
            );
          })
          .catch(() => {
            setVisits(snapshot);
            setErrorMessage('Spremanje nije uspjelo. Pokušaj ponovno.');
          });
      },
    }),
    [visits, colorLabels, selectedDate, status, errorMessage],
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
