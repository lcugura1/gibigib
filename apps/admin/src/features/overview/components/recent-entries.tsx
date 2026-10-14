import type { CSSProperties } from 'react';
import type { EntryDenialReason, EntryLogDto, LiveStatusDto } from '@gibigib/types';
import { Avatar } from '../../../shared/components/avatar';
import { Card } from '../../../shared/components/card';
import { Icon } from '../../../shared/components/icon';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { gymColor } from '../../../shared/domain/palette';
import { formatTime } from '../../../shared/lib/format';
import styles from './recent-entries.module.css';

const DENIAL_REASON: Record<EntryDenialReason, string> = {
  EXPIRED: 'Članarina istekla',
  PAUSED: 'Članarina pauzirana',
  CANCELLED: 'Članarina otkazana',
  INVALID_CODE: 'Nevažeći kod',
};

interface RecentEntriesProps {
  entries: readonly EntryLogDto[];
  live: LiveStatusDto;
  gymId: string | undefined;
  className?: string;
}

function emptyMessage(live: LiveStatusDto, gymId: string | undefined) {
  const offline = gymId && live.offlineDevices.find((device) => device.gymId === gymId && device.kind === 'reader');
  return offline
    ? `Nema ulaza od ${formatTime(offline.offlineSince)}. Čitač na ulazu je offline.`
    : 'Još nema ulaza.';
}

export function RecentEntries({ entries, live, gymId, className }: RecentEntriesProps) {
  const gymIds = live.gyms.map((gym) => gym.id);

  return (
    <Card variant="flat" className={`${styles.card} ${className ?? ''}`} aria-labelledby="entries-heading">
      <div className={styles.head}>
        <SectionLabel id="entries-heading">Zadnji ulazi</SectionLabel>
        <a className={styles.all} href="/ulazi">
          Svi ulazi
          <Icon name="chevron" />
        </a>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>{emptyMessage(live, gymId)}</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id} className={entry.approved ? styles.row : `${styles.row} ${styles.denied}`}>
              <time className={styles.time} dateTime={entry.at}>
                {formatTime(entry.at)}
              </time>
              <Avatar name={entry.memberName} />
              <div className={styles.who}>
                <p className={styles.name}>{entry.memberName}</p>
                <p className={styles.gym} style={{ '--tag': gymColor(gymIds, entry.gymId) } as CSSProperties}>
                  {live.gyms.find((gym) => gym.id === entry.gymId)?.name}
                </p>
              </div>
              {entry.approved ? (
                <StatusPill level="ok">Odobren</StatusPill>
              ) : (
                <StatusPill level="danger">
                  Odbijen · {entry.denialReason ? DENIAL_REASON[entry.denialReason] : ''}
                </StatusPill>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
