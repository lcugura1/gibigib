import type { AttendanceVisitDto, VisitDto } from '@gibigib/types';
import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/context/auth';
import { fetchEntryVisits, fetchGoal, fetchVisits, saveGoal, saveTag } from '@/features/attendance/services/attendance';
import { TAG_COLORS, DEFAULT_COLOR_LABELS, initialVisits, type Visit } from '@/features/attendance/data/visits';

type Status = 'loading' | 'ready' | 'error';

type AttendanceContextValue = {
  visits: Visit[];
  colorOptions: string[];
  colorLabels: Record<string, string>;
  selectedDate: string | null;
  status: Status;
  errorMessage: string | null;
  goal: number | null;
  selectDate: (date: string) => void;
  clearSelection: () => void;
  tagVisit: (date: string, color: string, label: string) => void;
  setGoal: (goal: number) => void;
};

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

function mergeEntryVisits(seed: Visit[], entries: AttendanceVisitDto[]): Visit[] {
  const byDate = new Map<string, Visit>();
  for (const visit of seed) byDate.set(visit.date, visit);
  for (const entry of entries) {
    if (!byDate.has(entry.date)) {
      byDate.set(entry.date, { id: entry.id, date: entry.date, time: entry.time });
    }
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

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
  const [goal, setGoalState] = useState<number | null>(null);

  useEffect(() => {
    if (!isReady || !user) return;
    let cancelled = false;
    setStatus('loading');
    Promise.all([
      fetchVisits(),
      fetchEntryVisits().catch(() => []),
      fetchGoal().catch(() => ({ goal: null })),
    ])
      .then(([server, entries, goalDto]) => {
        if (cancelled) return;
        setVisits(mergeVisits(mergeEntryVisits(initialVisits, entries), server));
        setGoalState(goalDto.goal);
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
      goal,
      selectDate: (date) => setSelectedDate(date),
      clearSelection: () => setSelectedDate(null),
      setGoal: (next) => {
        const previous = goal;
        setGoalState(next);
        setErrorMessage(null);
        saveGoal(next).catch(() => {
          setGoalState(previous);
          setErrorMessage('Spremanje cilja nije uspjelo. Pokušaj ponovno.');
        });
      },
      tagVisit: (date, color, label) => {
        const trimmed = label.trim();
        const snapshot = visits;
        const renaming = (colorLabels[color] ?? '') !== trimmed;
        const existing = visits.find((visit) => visit.date === date);
        const time = existing?.time ?? '';

        const base = existing
          ? visits
          : [...visits, { id: date, date, time, color, label: trimmed }];
        const optimistic = base
          .map((visit) => {
            if (visit.date === date) return { ...visit, color, label: trimmed };
            if (renaming && visit.color === color) return { ...visit, label: trimmed };
            return visit;
          })
          .sort((a, b) => a.date.localeCompare(b.date));

        setVisits(optimistic);
        setErrorMessage(null);

        const changed = optimistic.filter(
          (visit) => visit.date === date || (renaming && visit.color === color),
        );
        Promise.all(
          changed.map((visit) =>
            saveTag({ date: visit.date, time: visit.time || undefined, color, label: trimmed }),
          ),
        ).catch(() => {
          setVisits(snapshot);
          setErrorMessage('Spremanje nije uspjelo. Pokušaj ponovno.');
        });
      },
    }),
    [visits, colorLabels, selectedDate, status, errorMessage, goal],
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
