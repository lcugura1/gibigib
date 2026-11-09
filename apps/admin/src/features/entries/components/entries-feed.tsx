import type { CSSProperties } from 'react';
import type { CatalogDto, EntryLogDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Avatar } from '../../../shared/components/avatar';
import { StatusPill } from '../../../shared/components/status-pill';
import { DENIAL_REASON } from '../../../shared/domain/entries';
import { gymColor } from '../../../shared/domain/palette';
import { EntryTime } from './entry-time';
import styles from './entries-feed.module.css';

interface EntriesFeedProps {
  entries: readonly EntryLogDto[];
  now: string;
  catalog: CatalogDto;
}

export function EntriesFeed({ entries, now, catalog }: EntriesFeedProps) {
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const gymName = (id: string) => catalog.gyms.find((gym) => gym.id === id)?.name ?? '';

  return (
    <ul className={styles.feed}>
      {entries.map((entry) => {
        const content = (
          <>
            <span className={styles.time}>
              <EntryTime at={entry.at} now={now} seconds={false} />
            </span>
            <Avatar name={entry.memberName} />
            <span className={styles.who}>
              <b>{entry.memberName}</b>
              <span className={styles.gym} style={{ '--tag': gymColor(gymIds, entry.gymId) } as CSSProperties}>
                {gymName(entry.gymId)}
              </span>
              {entry.denialReason && <span className={styles.reason}>{DENIAL_REASON[entry.denialReason]}</span>}
            </span>
            {entry.approved ? (
              <StatusPill level="ok">Odobren</StatusPill>
            ) : (
              <StatusPill level="danger">Odbijen</StatusPill>
            )}
          </>
        );
        return (
          <li key={entry.id} className={entry.approved ? undefined : styles.denied}>
            {entry.memberId ? (
              <Link className={styles.row} to={`/clanovi/${entry.memberId}`}>
                {content}
              </Link>
            ) : (
              <div className={styles.row}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
