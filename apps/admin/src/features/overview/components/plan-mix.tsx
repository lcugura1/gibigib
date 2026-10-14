import { useState, type CSSProperties } from 'react';
import type { OverviewDto } from '@gibigib/types';
import { Card } from '../../../shared/components/card';
import { Chip } from '../../../shared/components/chip';
import { SectionLabel } from '../../../shared/components/section-label';
import { planColor } from '../../../shared/domain/palette';
import { formatInteger, formatMembers, formatShare } from '../../../shared/lib/format';
import headStyles from './card-head.module.css';
import styles from './plan-mix.module.css';

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = (CIRCUMFERENCE * 2.5) / 360;

interface PlanMixProps {
  planMix: OverviewDto['planMix'];
  className?: string;
}

export function PlanMix({ planMix, className }: PlanMixProps) {
  const [selectedSlug, setSelectedSlug] = useState(planMix[0]?.slug);
  const total = planMix.reduce((sum, plan) => sum + plan.count, 0);
  const selected = planMix.find((plan) => plan.slug === selectedSlug) ?? planMix[0];

  const slices = planMix.reduce<{ offset: number; items: { slug: string; length: number; rotation: number }[] }>(
    (acc, plan) => {
      const length = total === 0 ? 0 : (plan.count / total) * CIRCUMFERENCE;
      acc.items.push({ slug: plan.slug, length: Math.max(0, length - GAP), rotation: -90 + (acc.offset / CIRCUMFERENCE) * 360 });
      acc.offset += length;
      return acc;
    },
    { offset: 0, items: [] },
  ).items;

  return (
    <Card variant="flat" className={`${styles.card} ${className ?? ''}`} aria-labelledby="plans-heading">
      <div className={headStyles.head}>
        <SectionLabel id="plans-heading">Članovi po planu</SectionLabel>
        <p className={headStyles.sub}>{formatInteger(total)} aktivnih</p>
      </div>

      <div className={styles.donut}>
        <svg className={styles.ring} viewBox="0 0 240 240" role="img" aria-label="Udio aktivnih članarina po planu">
          {slices.map((slice) => (
            <circle
              key={slice.slug}
              cx="120"
              cy="120"
              r={RADIUS}
              style={{ stroke: planColor(slice.slug) }}
              strokeDasharray={`${slice.length} ${CIRCUMFERENCE - slice.length}`}
              strokeOpacity={slice.slug === selected?.slug ? 1 : 0.4}
              transform={`rotate(${slice.rotation} 120 120)`}
            />
          ))}
        </svg>
        {selected && (
          <div className={styles.centre} style={{ '--tag': planColor(selected.slug) } as CSSProperties}>
            <p className={styles.planName}>{selected.name}</p>
            <p className={styles.share}>{formatShare(selected.count, total)}</p>
            <p className={styles.count}>{formatMembers(selected.count)}</p>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        {planMix.map((plan) => (
          <Chip
            key={plan.slug}
            color={planColor(plan.slug)}
            active={plan.slug === selected?.slug}
            meta={formatInteger(plan.count)}
            onToggle={() => setSelectedSlug(plan.slug)}
          >
            {plan.name}
          </Chip>
        ))}
      </div>
    </Card>
  );
}
