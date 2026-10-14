import type { CSSProperties, ReactNode } from 'react';
import type { CatalogDto, EntryLogDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Avatar } from '../../../shared/components/avatar';
import { StatusPill } from '../../../shared/components/status-pill';
import { DENIAL_REASON } from '../../../shared/domain/entries';
import { gymColor } from '../../../shared/domain/palette';
import { EntryTime } from './entry-time';
import styles from './entries-table.module.css';

interface EntriesTableProps {
  entries: readonly EntryLogDto[];
  now: string;
  catalog: CatalogDto;
  compact: boolean;
  children?: ReactNode;
}

export function EntriesTable({ entries, now, catalog, compact, children }: EntriesTableProps) {
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const gymName = (id: string) => catalog.gyms.find((gym) => gym.id === id)?.name ?? '';

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>Dnevnik ulaza</caption>
        <thead>
          <tr>
            <th scope="col">Vrijeme</th>
            <th scope="col">Član</th>
            <th scope="col">Teretana</th>
            {!compact && <th scope="col">Uređaj</th>}
            <th scope="col">Rezultat</th>
            <th scope="col">Razlog</th>
          </tr>
        </thead>
        {entries.length > 0 && (
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className={entry.approved ? undefined : styles.denied}>
                <td>
                  <EntryTime at={entry.at} now={now} seconds />
                </td>
                <td>
                  {entry.memberId ? (
                    <Link className={styles.member} to={`/clanovi/${entry.memberId}`}>
                      <Avatar name={entry.memberName} />
                      <b>{entry.memberName}</b>
                    </Link>
                  ) : (
                    <span className={styles.member}>
                      <Avatar name={entry.memberName} />
                      <b>{entry.memberName}</b>
                    </span>
                  )}
                </td>
                <td>
                  <span className={styles.gym} style={{ '--tag': gymColor(gymIds, entry.gymId) } as CSSProperties}>
                    {gymName(entry.gymId)}
                  </span>
                </td>
                {!compact && <td className={styles.muted}>{entry.device}</td>}
                <td>
                  {entry.approved ? (
                    <StatusPill level="ok">Odobren</StatusPill>
                  ) : (
                    <StatusPill level="danger">Odbijen</StatusPill>
                  )}
                </td>
                <td className={entry.denialReason ? styles.reason : styles.muted}>
                  {entry.denialReason ? DENIAL_REASON[entry.denialReason] : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {children}
    </div>
  );
}
