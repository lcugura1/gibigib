import type { MemberDetailDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Card } from '../../../../shared/components/card';
import { Icon } from '../../../../shared/components/icon';
import { SectionLabel } from '../../../../shared/components/section-label';
import { useViewport } from '../../../../shared/layout/viewport';
import { formatDate } from '../../../../shared/lib/format';
import { formatShortDate } from '../../member-format';
import styles from './change-log.module.css';

const AUDIT_LOG_HREF = '/dnevnik';

interface ChangeLogProps {
  member: MemberDetailDto;
  className?: string;
}

export function ChangeLog({ member, className }: ChangeLogProps) {
  const compact = useViewport() === 'phone';

  return (
    <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="log-heading">
      <div className={styles.head}>
        <SectionLabel id="log-heading">Dnevnik promjena</SectionLabel>
        <Link className={styles.all} to={AUDIT_LOG_HREF}>
          Cijeli dnevnik
          <Icon name="chevron" />
        </Link>
      </div>
      <ol className={styles.entries}>
        {member.changeLog.map((entry) => (
          <li key={entry.id} className={styles.entry}>
            <time className={styles.when} dateTime={entry.at}>
              {compact ? formatShortDate(entry.at, member.asOf) : formatDate(entry.at)}
            </time>
            <div>
              <p>
                <b>{entry.title}</b> · {entry.detail}
              </p>
              <p className={styles.actor}>{entry.actor}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
