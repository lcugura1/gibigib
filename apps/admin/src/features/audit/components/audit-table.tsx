import type { CSSProperties, ReactNode } from 'react';
import type { AuditEntryDto, CatalogDto } from '@gibigib/types';
import { Link } from 'react-router';
import { StatusPill } from '../../../shared/components/status-pill';
import { gymColor } from '../../../shared/domain/palette';
import { MEMBERS_HREF } from '../../../shared/layout/navigation';
import { formatDayMonth, formatTime, initials } from '../../../shared/lib/format';
import { AUDIT_KIND_LABEL } from '../audit-format';
import styles from './audit-table.module.css';

interface AuditTableProps {
  entries: readonly AuditEntryDto[];
  catalog: CatalogDto;
  compact: boolean;
  children?: ReactNode;
}

export function GymMark({ gymId, catalog, allLabel }: { gymId: string | null; catalog: CatalogDto; allLabel: string }) {
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const color = gymId ? gymColor(gymIds, gymId) : 'var(--text-secondary)';
  return (
    <span className={styles.gym} style={{ '--tag': color } as CSSProperties}>
      {gymId ? (catalog.gyms.find((gym) => gym.id === gymId)?.name ?? gymId) : allLabel}
    </span>
  );
}

export function AuditTable({ entries, catalog, compact, children }: AuditTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>Dnevnik promjena</caption>
        <thead>
          <tr>
            <th scope="col">Kada</th>
            <th scope="col">Tko</th>
            {!compact && <th scope="col">Vrsta</th>}
            <th scope="col">Što</th>
            <th scope="col">Teretana</th>
          </tr>
        </thead>
        {entries.length > 0 && (
          <tbody>
            {entries.map((entry) => {
              const actor = (
                <>
                  <span className={styles.avatar} aria-hidden="true">
                    {entry.actor.kind === 'MEMBER' ? initials(entry.actor.name) : entry.actor.name.charAt(0)}
                  </span>
                  {entry.actor.name}
                </>
              );
              return (
                <tr key={entry.id}>
                  <td className={styles.when}>
                    {formatDayMonth(entry.at)} {formatTime(entry.at)}
                  </td>
                  <td>
                    {entry.actor.memberId ? (
                      <Link className={styles.actor} to={`${MEMBERS_HREF}/${entry.actor.memberId}`}>
                        {actor}
                      </Link>
                    ) : (
                      <span className={styles.actor}>{actor}</span>
                    )}
                  </td>
                  {!compact && (
                    <td>
                      <StatusPill level="muted">{AUDIT_KIND_LABEL[entry.kind]}</StatusPill>
                    </td>
                  )}
                  <td className={styles.what}>
                    <b>{entry.title}</b>
                    {entry.details.length > 0 && <span> · {entry.details.join(' · ')}</span>}
                  </td>
                  <td>
                    <GymMark gymId={entry.gymId} catalog={catalog} allLabel="Sve" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {children}
    </div>
  );
}
