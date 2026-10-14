import { useMemo, useState } from 'react';
import type { MemberDetailDto } from '@gibigib/types';
import { Card } from '../../../../shared/components/card';
import { Icon } from '../../../../shared/components/icon';
import { SectionLabel } from '../../../../shared/components/section-label';
import { useViewport } from '../../../../shared/layout/viewport';
import { formatMonth, pluralize } from '../../../../shared/lib/format';
import { useObservable } from '../../../../shared/lib/use-observable';
import { memberVisits$, type VisitsView } from '../../services/member-state';
import styles from './attendance-calendar.module.css';

const WEEKDAYS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
const LOADING: VisitsView = { status: 'loading' };

const monthOf = (iso: string) => iso.slice(0, 7);

function shiftMonth(month: string, by: number) {
  const [year, index] = month.split('-').map(Number) as [number, number];
  const date = new Date(year, index - 1 + by, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

const visitWord = (count: number) =>
  `${count} ${pluralize(count, { one: 'dolazak', few: 'dolaska', other: 'dolazaka' })}`;

interface AttendanceCalendarProps {
  member: MemberDetailDto;
  className?: string;
}

export function AttendanceCalendar({ member, className }: AttendanceCalendarProps) {
  const compact = useViewport() === 'phone';
  const currentMonth = monthOf(member.asOf);
  const [month, setMonth] = useState(currentMonth);
  const visits$ = useMemo(() => memberVisits$(member.id, month), [member.id, month]);
  const view = useObservable(visits$, LOADING);

  const [year, index] = month.split('-').map(Number) as [number, number];
  const daysInMonth = new Date(year, index, 0).getDate();
  const offset = (new Date(year, index - 1, 1).getDay() + 6) % 7;
  const today = month === currentMonth ? new Date(member.asOf).getDate() : month > currentMonth ? 0 : daysInMonth + 1;
  const visited = new Set(view.status === 'ready' ? view.visits.days : []);
  const title = `${formatMonth(`${month}-01T00:00:00`)} ${year}.`;
  const summary =
    month === currentMonth
      ? `${visited.size} ovaj mjesec · ${member.visits.last30Days} u ${compact ? '30 dana' : 'zadnjih 30 dana'}`
      : visitWord(visited.size);

  return (
    <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="calendar-heading">
      <div className={styles.head}>
        <div>
          <SectionLabel id="calendar-heading">Dolasci · {title}</SectionLabel>
          <p className={styles.summary} aria-live="polite">
            {view.status === 'error' ? 'Dolasci se nisu učitali.' : summary}
          </p>
        </div>
        <div className={styles.nav}>
          <button
            type="button"
            aria-label="Prethodni mjesec"
            disabled={month <= monthOf(member.memberSince)}
            onClick={() => setMonth(shiftMonth(month, -1))}
          >
            <Icon name="chevronLeft" />
          </button>
          <button
            type="button"
            aria-label="Sljedeći mjesec"
            disabled={month >= currentMonth}
            onClick={() => setMonth(shiftMonth(month, 1))}
          >
            <Icon name="chevron" />
          </button>
        </div>
      </div>

      <div className={styles.grid} aria-busy={view.status === 'loading'}>
        {WEEKDAYS.map((day) => (
          <span key={day} className={styles.weekday} aria-hidden="true">
            {compact ? day.charAt(0) : day}
          </span>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const classes = [
            styles.day,
            visited.has(day) ? styles.visit : '',
            day === today ? styles.today : '',
            day > today ? styles.future : '',
          ].join(' ');
          return (
            <span
              key={day}
              className={classes}
              style={day === 1 ? { gridColumnStart: offset + 1 } : undefined}
              aria-label={`${day}. ${visited.has(day) ? 'dolazak' : 'bez dolaska'}`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
