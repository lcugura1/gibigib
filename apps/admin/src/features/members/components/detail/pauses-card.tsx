import type { MemberDetailDto } from '@gibigib/types';
import { Card } from '../../../../shared/components/card';
import { SectionLabel } from '../../../../shared/components/section-label';
import { StatusPill } from '../../../../shared/components/status-pill';
import { formatDate, formatDayMonth, formatDays, pluralize } from '../../../../shared/lib/format';
import { pauseState, type PauseState } from '../../membership-rules';
import styles from './pauses-card.module.css';

const dayWord = (count: number) => pluralize(count, { one: 'dan', few: 'dana', other: 'dana' });

function headline(state: PauseState, maxDays: number) {
  switch (state.kind) {
    case 'paused':
      return { count: state.daysLeft, text: `${dayWord(state.daysLeft)} do kraja pauze` };
    case 'cooldown':
      return { count: state.daysLeft, text: `${dayWord(state.daysLeft)} do sljedeće pauze` };
    case 'available':
      return { count: maxDays, text: `${dayWord(maxDays)} pauze dostupno` };
    case 'unavailable':
      return undefined;
  }
}

const PILL: Record<PauseState['kind'], { level: 'ok' | 'warn' | 'muted'; label: string } | undefined> = {
  paused: { level: 'warn', label: 'U tijeku' },
  cooldown: { level: 'muted', label: 'Čekanje' },
  available: { level: 'ok', label: 'Dostupna' },
  unavailable: undefined,
};

interface PausesCardProps {
  member: MemberDetailDto;
  className?: string;
}

export function PausesCard({ member, className }: PausesCardProps) {
  const state = pauseState(member);
  const { maxDays, cooldownDays, history } = member.pause;
  const head = headline(state, maxDays);
  const pill = PILL[state.kind];
  const lit = state.kind === 'available' ? maxDays : 0;
  const rule = `Najviše ${formatDays(maxDays)} po pauzi. Nakon pauze slijedi ${formatDays(cooldownDays)} čekanja`;

  return (
    <Card className={`${styles.card} ${className ?? ''}`} aria-labelledby="pauses-heading">
      <div className={styles.head}>
        <SectionLabel id="pauses-heading">Pauze</SectionLabel>
        {pill && <StatusPill level={pill.level}>{pill.label}</StatusPill>}
      </div>

      {head && (
        <p className={styles.headline}>
          <span className={styles.count}>{head.count}</span>
          {head.text}
        </p>
      )}

      {state.kind !== 'unavailable' && (
        <div className={styles.segments} aria-hidden="true">
          {Array.from({ length: maxDays }, (_, i) => (
            <span key={i} className={i < lit ? styles.on : undefined} />
          ))}
        </div>
      )}

      <p className={styles.rule}>
        {state.kind === 'cooldown' ? `${rule}, pa je sljedeća moguća od ${formatDate(state.from)}` : `${rule}.`}
      </p>

      {history.length > 0 && (
        <ul className={styles.history}>
          {history.map((pause) => (
            <li key={pause.from}>
              <span className={styles.when}>{formatDate(pause.from)}</span>
              <span>
                {formatDays(pause.days)} · do {formatDayMonth(pause.until)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
