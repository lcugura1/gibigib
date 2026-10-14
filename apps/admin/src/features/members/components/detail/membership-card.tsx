import type { CSSProperties } from 'react';
import type { MemberDetailDto } from '@gibigib/types';
import { Card } from '../../../../shared/components/card';
import { SectionLabel } from '../../../../shared/components/section-label';
import { StatusPill } from '../../../../shared/components/status-pill';
import { formatCurrency, formatDate, formatDayMonth, pluralize } from '../../../../shared/lib/format';
import { daysBetween } from '../../inactivity';
import { daysUntilEnd, pauseState } from '../../membership-rules';
import { STATUS_LABEL, STATUS_LEVEL } from '../../status';
import styles from './membership-card.module.css';

const dayWord = (count: number) => pluralize(count, { one: 'dan', few: 'dana', other: 'dana' });

function pauseValue(member: MemberDetailDto) {
  const state = pauseState(member);
  switch (state.kind) {
    case 'paused':
      return `do ${formatDayMonth(state.until)}`;
    case 'cooldown':
      return `od ${formatDayMonth(state.from)}`;
    case 'available':
      return 'dostupna';
    case 'unavailable':
      return '—';
  }
}

interface MembershipCardProps {
  member: MemberDetailDto;
  className?: string;
}

export function MembershipCard({ member, className }: MembershipCardProps) {
  const { membership } = member;
  const remaining = daysUntilEnd(member);
  const ended = remaining < 0 || membership.status === 'CANCELLED';
  const elapsed = daysBetween(membership.startsAt, member.asOf);
  const progress = Math.min(1, Math.max(0, elapsed / Math.max(1, daysBetween(membership.startsAt, membership.endsAt))));
  const count = Math.abs(remaining);
  const renewal = membership.autoRenew ? 'automatska obnova' : 'bez automatske obnove';

  return (
    <Card variant="light" className={`${styles.card} ${className ?? ''}`} aria-labelledby="membership-heading">
      <div className={styles.head}>
        <SectionLabel id="membership-heading">Trenutna članarina</SectionLabel>
        <StatusPill level={STATUS_LEVEL[membership.status]} solid>
          {STATUS_LABEL[membership.status]}
        </StatusPill>
      </div>

      <div>
        <p className={styles.plan}>{membership.planName}</p>
        <p className={styles.terms}>
          {formatCurrency(membership.price)} · {membership.durationDays} dana · {renewal}
        </p>
      </div>

      <p className={styles.countdown}>
        <span className={styles.count}>{count}</span>
        {ended ? `${dayWord(count)} od kraja` : `${dayWord(count)} do isteka`}
      </p>

      <div className={styles.track} aria-hidden="true">
        <span style={{ '--progress': `${progress * 100}%` } as CSSProperties} />
      </div>

      <dl className={styles.facts}>
        <div>
          <dt>Početak</dt>
          <dd>{formatDate(membership.startsAt)}</dd>
        </div>
        <div>
          <dt>Kraj</dt>
          <dd>{formatDate(membership.endsAt)}</dd>
        </div>
        <div>
          <dt>Plaćanje</dt>
          <dd>{membership.paymentMethod}</dd>
        </div>
        <div>
          <dt>Pauza</dt>
          <dd>{pauseValue(member)}</dd>
        </div>
      </dl>
    </Card>
  );
}
