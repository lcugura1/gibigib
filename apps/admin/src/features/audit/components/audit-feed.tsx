import type { AuditEntryDto, CatalogDto } from '@gibigib/types';
import { SectionLabel } from '../../../shared/components/section-label';
import { formatTime, formatWeekdayDay } from '../../../shared/lib/format';
import { GymMark } from './audit-table';
import styles from './audit-feed.module.css';

const DAY_MS = 86_400_000;

const dayKey = (iso: string) => iso.slice(0, 10);

function dayLabel(day: string, asOf: string) {
  const diff = Math.round((new Date(dayKey(asOf)).getTime() - new Date(day).getTime()) / DAY_MS);
  if (diff === 0) return 'Danas';
  if (diff === 1) return 'Jučer';
  return formatWeekdayDay(`${day}T12:00:00`);
}

interface AuditFeedProps {
  entries: readonly AuditEntryDto[];
  asOf: string;
  catalog: CatalogDto;
}

export function AuditFeed({ entries, asOf, catalog }: AuditFeedProps) {
  const days = entries.reduce<{ day: string; entries: AuditEntryDto[] }[]>((groups, entry) => {
    const day = dayKey(entry.at);
    const last = groups.at(-1);
    if (last?.day === day) last.entries.push(entry);
    else groups.push({ day, entries: [entry] });
    return groups;
  }, []);

  return (
    <div className={styles.days}>
      {days.map((group) => (
        <section key={group.day} className={styles.day} aria-labelledby={`day-${group.day}`}>
          <SectionLabel id={`day-${group.day}`}>{dayLabel(group.day, asOf)}</SectionLabel>
          <ul className={styles.list}>
            {group.entries.map((entry) => (
              <li key={entry.id} className={styles.row}>
                <span className={styles.time}>{formatTime(entry.at)}</span>
                <span className={styles.body}>
                  <b>{entry.title}</b>
                  {entry.details.length > 0 && <span className={styles.details}>{entry.details.join(' · ')}</span>}
                  <span className={styles.meta}>
                    <GymMark gymId={entry.gymId} catalog={catalog} allLabel="Sve teretane" /> · {entry.actor.name}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
