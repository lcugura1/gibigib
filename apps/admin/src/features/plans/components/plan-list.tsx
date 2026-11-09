import type { CSSProperties } from 'react';
import type { PlanDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Badge } from '../../../shared/components/badge';
import { Icon } from '../../../shared/components/icon';
import { Toggle } from '../../../shared/components/toggle';
import { planColor } from '../../../shared/domain/palette';
import { formatInteger } from '../../../shared/lib/format';
import { membershipsNoun, formatPlanDuration, formatPlanPrice, planSummary } from '../plan-format';
import styles from './plan-list.module.css';

interface PlanListProps {
  plans: readonly PlanDto[];
  popular: string | undefined;
  selected: string | undefined;
  hrefOf: (slug: string) => string;
  onVisible: (slug: string, visible: boolean) => void;
}

const dot = (slug: string) => ({ '--tag': planColor(slug) }) as CSSProperties;

export function PlanRows({ plans, popular, selected, hrefOf, onVisible }: PlanListProps) {
  return (
    <ul className={styles.rows}>
      {plans.map((plan) => (
        <li key={plan.slug} className={plan.slug === selected ? `${styles.row} ${styles.selected}` : styles.row}>
          <div className={styles.name}>
            <span className={styles.title} style={dot(plan.slug)}>
              <Link
                className={styles.link}
                to={hrefOf(plan.slug)}
                aria-current={plan.slug === selected ? 'true' : undefined}
              >
                {plan.name}
              </Link>
              {plan.slug === popular && <Badge>Popularno</Badge>}
            </span>
            <span className={styles.summary}>{planSummary(plan)}</span>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Cijena</dt>
              <dd className={styles.price}>{formatPlanPrice(plan.price)}</dd>
            </div>
            <div>
              <dt>Trajanje</dt>
              <dd>{formatPlanDuration(plan.durationDays)}</dd>
            </div>
            <div>
              <dt>Aktivni članovi</dt>
              <dd className={styles.count}>{formatInteger(plan.activeMembers)}</dd>
            </div>
          </dl>
          <span className={styles.toggle}>
            <Toggle
              checked={plan.visible}
              label={`Plan ${plan.name} prikazan u aplikaciji`}
              onChange={(visible) => onVisible(plan.slug, visible)}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PlanCards({ plans, popular, hrefOf, onVisible }: Omit<PlanListProps, 'selected'>) {
  return (
    <ul className={styles.cards}>
      {plans.map((plan) => (
        <li key={plan.slug} className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardName} style={dot(plan.slug)}>
              {plan.name}
            </span>
            <Toggle
              checked={plan.visible}
              label={`Plan ${plan.name} prikazan u aplikaciji`}
              onChange={(visible) => onVisible(plan.slug, visible)}
            />
          </div>
          <div className={styles.cardPrice}>
            <p>
              <b>{formatPlanPrice(plan.price)}</b>
              <span>{plan.durationDays === null ? 'po dogovoru' : formatPlanDuration(plan.durationDays)}</span>
            </p>
            {plan.slug === popular && <Badge>Popularno</Badge>}
          </div>
          <div className={styles.cardFoot}>
            <span className={styles.memberships}>
              <b>{formatInteger(plan.activeMembers)}</b> {membershipsNoun(plan.activeMembers)}
            </span>
            <Link className={styles.edit} to={hrefOf(plan.slug)} aria-label={`Uredi plan ${plan.name}`}>
              Uredi
              <Icon name="chevron" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
