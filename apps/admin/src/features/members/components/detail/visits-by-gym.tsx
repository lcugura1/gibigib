import type { CSSProperties } from 'react';
import type { CatalogDto, MemberDetailDto } from '@gibigib/types';
import { Card } from '../../../../shared/components/card';
import { SectionLabel } from '../../../../shared/components/section-label';
import { gymColor } from '../../../../shared/domain/palette';
import { useViewport } from '../../../../shared/layout/viewport';
import { formatInteger } from '../../../../shared/lib/format';
import styles from './visits-by-gym.module.css';

interface VisitsByGymProps {
  member: MemberDetailDto;
  catalog: CatalogDto;
  className?: string;
}

export function VisitsByGym({ member, catalog, className }: VisitsByGymProps) {
  const compact = useViewport() === 'phone';
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const max = Math.max(1, ...member.visits.byGym30Days.map((row) => row.count));

  return (
    <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="by-gym-heading">
      <div className={styles.head}>
        <SectionLabel id="by-gym-heading">Dolasci po teretani · 30 dana</SectionLabel>
        {!compact && <p className={styles.hint}>Matična je teretana s najviše dolazaka</p>}
      </div>
      <ul className={styles.rows}>
        {catalog.gyms.map((gym) => {
          const count = member.visits.byGym30Days.find((row) => row.gymId === gym.id)?.count ?? 0;
          const style = { '--tag': gymColor(gymIds, gym.id), '--share': `${(count / max) * 100}%` } as CSSProperties;
          return (
            <li key={gym.id} className={styles.row} style={style}>
              <span>{gym.name}</span>
              <span className={styles.bar} aria-hidden="true" />
              <b>{formatInteger(count)}</b>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
