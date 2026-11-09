import type { MemberListItemDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Avatar } from '../../../shared/components/avatar';
import { StatusPill } from '../../../shared/components/status-pill';
import { formatInteger } from '../../../shared/lib/format';
import { isInactive } from '../inactivity';
import { formatLastVisit, formatShortDate } from '../member-format';
import { STATUS_LABEL, STATUS_LEVEL } from '../status';
import { InactivePill } from './inactive-pill';
import styles from './member-cards.module.css';

interface MemberCardsProps {
  members: readonly MemberListItemDto[];
  now: string;
}

export function MemberCards({ members, now }: MemberCardsProps) {
  return (
    <ul className={styles.list}>
      {members.map((member) => (
        <li key={member.id}>
          <Link className={styles.card} to={`/clanovi/${member.id}`}>
            <span className={styles.main}>
              <Avatar name={member.name} size="large" />
              <span className={styles.who}>
                <b>{member.name}</b>
                <small>
                  {member.planName} · ističe {formatShortDate(member.expiresAt, now)}
                </small>
              </span>
              <StatusPill level={STATUS_LEVEL[member.status]}>{STATUS_LABEL[member.status]}</StatusPill>
            </span>
            <span className={styles.stats}>
              <span>
                Zadnji dolazak <b>{formatLastVisit(member.lastVisitAt, now, 'inline')}</b>
              </span>
              <span>
                <b>{formatInteger(member.visits30d)}</b> u 30 d
              </span>
            </span>
            {isInactive(member, now) && (
              <span className={styles.flag}>
                <InactivePill member={member} now={now} />
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
