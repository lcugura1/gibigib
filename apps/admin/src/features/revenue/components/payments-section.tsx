import type { ReactNode } from 'react';
import type { CatalogDto, PaymentFilter, PaymentLogDto, PaymentsPageDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Avatar } from '../../../shared/components/avatar';
import { Chip } from '../../../shared/components/chip';
import { ExportButton } from '../../../shared/components/export-button';
import { SectionLabel } from '../../../shared/components/section-label';
import { StatusPill } from '../../../shared/components/status-pill';
import { PAYMENT_STATUS } from '../../../shared/domain/payments';
import { MEMBERS_HREF } from '../../../shared/layout/navigation';
import { formatDayMonth, formatInteger, formatTime, pluralize } from '../../../shared/lib/format';
import { formatEuro } from '../revenue-format';
import styles from './payments-section.module.css';

const FILTERS: readonly { value: PaymentFilter; label: string; color: string }[] = [
  { value: 'all', label: 'Sva', color: 'var(--text-secondary)' },
  { value: 'pending', label: 'Na čekanju', color: 'var(--warning)' },
  { value: 'failed', label: 'Neuspjela', color: 'var(--danger)' },
];

interface PaymentsHeadProps {
  filter: PaymentFilter;
  counts: PaymentsPageDto['counts'] | undefined;
  compact: boolean;
  onFilter: (filter: PaymentFilter) => void;
  onExport: () => Promise<string>;
}

export function PaymentsHead({ filter, counts, compact, onFilter, onExport }: PaymentsHeadProps) {
  const failed = counts?.failed ?? 0;

  return (
    <div className={styles.head}>
      <SectionLabel id="payments-heading">Plaćanja</SectionLabel>
      {compact ? (
        failed > 0 && (
          <button
            type="button"
            className={styles.failedToggle}
            aria-pressed={filter === 'failed'}
            onClick={() => onFilter(filter === 'failed' ? 'all' : 'failed')}
          >
            <StatusPill level="danger">
              {formatInteger(failed)} {pluralize(failed, { one: 'neuspjelo', few: 'neuspjela', other: 'neuspjelih' })}
            </StatusPill>
          </button>
        )
      ) : (
        <div className={styles.tools}>
          <div className={styles.chips} role="group" aria-label="Status plaćanja">
            {FILTERS.map((option) => (
              <Chip
                key={option.value}
                className={styles.chip}
                color={option.color}
                active={option.value === filter}
                meta={counts ? formatInteger(counts[option.value]) : undefined}
                onToggle={() => onFilter(option.value)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
          <ExportButton variant="button" fileName="placanja.csv" onExport={onExport} />
        </div>
      )}
    </div>
  );
}

const memberLink = (payment: PaymentLogDto, content: ReactNode, className: string | undefined) =>
  payment.memberId ? (
    <Link className={className} to={`${MEMBERS_HREF}/${payment.memberId}`}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );

const statusPill = (payment: PaymentLogDto) => (
  <StatusPill level={PAYMENT_STATUS[payment.status].level}>{PAYMENT_STATUS[payment.status].label}</StatusPill>
);

interface PaymentsTableProps {
  payments: readonly PaymentLogDto[];
  catalog: CatalogDto;
  compact: boolean;
  children?: ReactNode;
}

export function PaymentsTable({ payments, catalog, compact, children }: PaymentsTableProps) {
  const planName = (slug: string) => catalog.plans.find((plan) => plan.slug === slug)?.name ?? slug;

  return (
    <div className={styles.wrap}>
      <table className={styles.table} aria-labelledby="payments-heading">
        <thead>
          <tr>
            <th scope="col">Datum</th>
            <th scope="col">Član</th>
            {!compact && <th scope="col">Plan</th>}
            <th scope="col">Način</th>
            <th scope="col">Status</th>
            <th scope="col" className={styles.num}>
              Iznos
            </th>
          </tr>
        </thead>
        {payments.length > 0 && (
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className={payment.status === 'FAILED' ? styles.failed : undefined}>
                <td className={styles.date}>
                  {formatDayMonth(payment.at)} {formatTime(payment.at)}
                </td>
                <td>
                  {memberLink(
                    payment,
                    <>
                      <Avatar name={payment.memberName} />
                      <b>{payment.memberName}</b>
                    </>,
                    styles.member,
                  )}
                </td>
                {!compact && <td>{planName(payment.planSlug)}</td>}
                <td className={styles.muted}>{payment.method}</td>
                <td>{statusPill(payment)}</td>
                <td className={`${styles.num} ${styles.amount}`}>{formatEuro(payment.amount)}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {children}
    </div>
  );
}

const shortMethod = (method: string) => method.split(' ·· ')[0] ?? method;

export function PaymentsList({ payments }: { payments: readonly PaymentLogDto[] }) {
  return (
    <ul className={styles.list} aria-labelledby="payments-heading">
      {payments.map((payment) => (
        <li key={payment.id} className={payment.status === 'FAILED' ? styles.failed : undefined}>
          {memberLink(
            payment,
            <>
              <Avatar name={payment.memberName} />
              <span className={styles.who}>
                <b>{payment.memberName}</b>
                <span>
                  {formatDayMonth(payment.at)} · {shortMethod(payment.method)}
                </span>
              </span>
              <span className={styles.end}>
                <b className={styles.amount}>{formatEuro(payment.amount)}</b>
                <span className={styles.smallPill}>{statusPill(payment)}</span>
              </span>
            </>,
            styles.row,
          )}
        </li>
      ))}
    </ul>
  );
}
