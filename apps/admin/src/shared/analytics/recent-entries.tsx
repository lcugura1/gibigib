import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import type { EntryLogDto, LiveStatusDto } from '@gibigib/types';
import { Avatar } from '../components/avatar';
import { Card } from '../components/card';
import { Icon } from '../components/icon';
import { SectionLabel } from '../components/section-label';
import { StatusPill } from '../components/status-pill';
import { DENIAL_REASON } from '../domain/entries';
import { gymColor } from '../domain/palette';
import { ENTRIES_HREF } from '../layout/navigation';
import { useViewport } from '../layout/viewport';
import { formatDayMonth, formatTime } from '../lib/format';
import styles from './recent-entries.module.css';

interface RecentEntriesProps {
  entries: readonly EntryLogDto[];
  live: LiveStatusDto;
  gymId: string | undefined;
  scopeLabel?: string;
  onShowAll?: () => void;
  className?: string;
}

const dayStart = (iso: string) => {
  const date = new Date(iso);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

const DAY_MS = 86_400_000;

function lastEntryWhen(at: string, now: string) {
  const daysBefore = Math.round((dayStart(now) - dayStart(at)) / DAY_MS);
  return `${daysBefore === 1 ? 'jučer' : formatDayMonth(at)} u ${formatTime(at)}`;
}

function emptyMessage(live: LiveStatusDto, gymId: string | undefined, last: EntryLogDto | undefined, gymName: string) {
  const offline = gymId && live.offlineDevices.find((device) => device.gymId === gymId && device.kind === 'reader');
  if (offline) return `Nema ulaza od ${formatTime(offline.offlineSince)}. Čitač na ulazu je offline.`;
  if (!last) return 'Još nema ulaza.';
  return `Još nema ulaza danas. Zadnji ulaz bio je ${lastEntryWhen(last.at, live.updatedAt)} (${gymName}).`;
}

export function RecentEntries({ entries, live, gymId, scopeLabel, onShowAll, className }: RecentEntriesProps) {
  const compact = useViewport() === 'phone';
  const singleGym = gymId !== undefined;
  const gymIds = live.gyms.map((gym) => gym.id);
  const gymName = (id: string) => live.gyms.find((gym) => gym.id === id)?.name ?? '';
  const today = entries.filter((entry) => dayStart(entry.at) === dayStart(live.updatedAt));
  const [last] = entries;

  return (
    <Card variant="flat" className={`${styles.card} ${className ?? ''}`} aria-labelledby="entries-heading">
      <div className={styles.head}>
        <SectionLabel id="entries-heading">Zadnji ulazi{scopeLabel && ` · ${scopeLabel}`}</SectionLabel>
        <Link className={styles.all} to={ENTRIES_HREF} onClick={onShowAll}>
          {compact ? 'Svi' : 'Svi ulazi'}
          <Icon name="chevron" />
        </Link>
      </div>

      {today.length === 0 ? (
        <p className={styles.empty}>{emptyMessage(live, gymId, last, last ? gymName(last.gymId) : '')}</p>
      ) : (
        <ul>
          {today.map((entry) => {
            const reason = entry.denialReason ? DENIAL_REASON[entry.denialReason] : '';
            const tag = { '--tag': gymColor(gymIds, entry.gymId) } as CSSProperties;
            return (
              <li key={entry.id} className={entry.approved ? styles.row : `${styles.row} ${styles.denied}`}>
                {(!compact || singleGym) && (
                  <time className={styles.time} dateTime={entry.at}>
                    {formatTime(entry.at)}
                  </time>
                )}
                <Avatar name={entry.memberName} />
                <div className={styles.who}>
                  <p className={styles.name}>
                    {entry.memberId ? (
                      <Link to={`/clanovi/${entry.memberId}`}>{entry.memberName}</Link>
                    ) : (
                      entry.memberName
                    )}
                  </p>
                  {!singleGym && (
                    <p className={styles.gym} style={tag}>
                      {compact
                        ? [gymName(entry.gymId), formatTime(entry.at), reason].filter(Boolean).join(' · ')
                        : gymName(entry.gymId)}
                    </p>
                  )}
                </div>
                {entry.approved ? (
                  <StatusPill level="ok">Odobren</StatusPill>
                ) : (
                  <StatusPill level="danger">{compact ? 'Odbijen' : `Odbijen · ${reason}`}</StatusPill>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
