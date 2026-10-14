import { useState } from 'react';
import { Link } from 'react-router';
import type { AttentionItemDto, AttentionKind, OverviewDto } from '@gibigib/types';
import type { GymRef } from '../domain/scope';
import { Avatar } from '../components/avatar';
import { Card } from '../components/card';
import { Icon } from '../components/icon';
import { SectionLabel } from '../components/section-label';
import { MEMBERS_HREF } from '../layout/navigation';
import { useViewport } from '../layout/viewport';
import { formatCurrency, formatDayMonth, formatDays, formatMembers } from '../lib/format';
import headStyles from './card-head.module.css';
import styles from './attention-card.module.css';

const TABS: readonly { kind: AttentionKind; label: string; short: string; hint: string }[] = [
  {
    kind: 'expiring',
    label: 'Ističu u 7 dana',
    short: 'Ističu',
    hint: 'Članarine koje istječu u idućih 7 dana bez automatske obnove.',
  },
  {
    kind: 'inactive',
    label: 'Bez dolaska',
    short: 'Bez dolaska',
    hint: 'Aktivni članovi bez dolaska 14 ili više dana.',
  },
  { kind: 'paused', label: 'Pauzirani', short: 'Pauzirani', hint: 'Pauzirane članarine i datum kad pauza završava.' },
  {
    kind: 'failedPayment',
    label: 'Neuspjela plaćanja',
    short: 'Plaćanja',
    hint: 'Plaćanja koja nisu prošla u zadnjih 7 dana.',
  },
];

const ACTION: Record<AttentionKind, string> = {
  expiring: 'Produži',
  inactive: 'Podsjeti',
  paused: 'Nastavi',
  failedPayment: 'Podsjeti',
};

const PAYMENT_FAILURE = { declined: 'kartica odbijena', cardExpired: 'kartica istekla' } as const;

function describe(item: AttentionItemDto) {
  switch (item.kind) {
    case 'expiring':
      return `${item.planName} · ističe ${formatDayMonth(item.expiresAt)}`;
    case 'inactive':
      return `Bez dolaska ${formatDays(item.daysSinceVisit)} · ${item.planName}`;
    case 'paused':
      return `Pauza do ${formatDayMonth(item.pausedUntil)} · ${item.planName}`;
    case 'failedPayment':
      return `${formatCurrency(item.amount)} · ${PAYMENT_FAILURE[item.reason]} ${formatDayMonth(item.failedAt)}`;
  }
}

interface AttentionCardProps {
  attention: OverviewDto['attention'];
  gyms: readonly GymRef[];
  variant?: 'light' | 'flat';
  scopeLabel?: string;
  className?: string;
}

export function AttentionCard({ attention, gyms, variant = 'light', scopeLabel, className }: AttentionCardProps) {
  const compact = useViewport() === 'phone';
  const [kind, setKind] = useState<AttentionKind>('expiring');
  const active = TABS.find((tab) => tab.kind === kind) ?? TABS[0];
  const group = attention[kind];
  const total = TABS.reduce((sum, tab) => sum + attention[tab.kind].total, 0);
  const gymName = (gymId: string) => gyms.find((gym) => gym.id === gymId)?.name ?? '';

  return (
    <Card
      variant={variant}
      className={`${styles.card} ${variant === 'flat' ? styles.flat : ''} ${className ?? ''}`}
      aria-labelledby="attention-heading"
    >
      <div className={headStyles.head}>
        <SectionLabel id="attention-heading">Treba pažnju{scopeLabel && ` · ${scopeLabel}`}</SectionLabel>
        <p className={styles.count}>{formatMembers(total)}</p>
      </div>

      <div className={styles.tabs} role="group" aria-label="Vrsta">
        {TABS.map((tab) => (
          <button
            key={tab.kind}
            type="button"
            className={styles.tab}
            aria-pressed={tab.kind === kind}
            onClick={() => setKind(tab.kind)}
          >
            {compact ? tab.short : tab.label} <b>{attention[tab.kind].total}</b>
          </button>
        ))}
      </div>

      <p className={styles.hint}>{active?.hint}</p>

      <ul>
        {group.items.map((item) => (
          <li key={item.memberId} className={styles.row}>
            <Avatar name={item.name} onLight={variant === 'light'} />
            <div className={styles.who}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.meta}>
                {describe(item)} · {gymName(item.gymId)}
              </p>
            </div>
            <button type="button" className={styles.action} aria-label={`${ACTION[item.kind]}: ${item.name}`}>
              {ACTION[item.kind]}
            </button>
          </li>
        ))}
      </ul>

      <Link className={styles.more} to={MEMBERS_HREF}>
        Prikaži sve ({group.total})
        <Icon name="chevron" />
      </Link>
    </Card>
  );
}
