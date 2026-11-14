import type { MemberDetailDto } from '@gibigib/types';
import { SectionLabel } from '../../../../shared/components/section-label';
import { StatusPill } from '../../../../shared/components/status-pill';
import { PAYMENT_STATUS } from '../../../../shared/domain/payments';
import { useViewport } from '../../../../shared/layout/viewport';
import { formatCurrency, formatDate } from '../../../../shared/lib/format';
import styles from './payments.module.css';

interface PaymentsProps {
  member: MemberDetailDto;
  className?: string;
}

export function Payments({ member, className }: PaymentsProps) {
  const compact = useViewport() === 'phone';
  const { payments } = member;

  return (
    <section className={`${styles.section} ${className ?? ''}`} aria-labelledby="payments-heading">
      <SectionLabel id="payments-heading">Plaćanja</SectionLabel>
      {payments.length === 0 ? (
        <p className={styles.empty}>Još nema plaćanja.</p>
      ) : compact ? (
        <ul className={styles.list}>
          {payments.map((payment) => (
            <li key={payment.id} className={styles.item}>
              <div>
                <p className={payment.status === 'FAILED' ? styles.amountFailed : styles.amount}>
                  {formatCurrency(payment.amount)}
                </p>
                <p className={styles.meta}>
                  {formatDate(payment.date)} · {payment.method}
                </p>
              </div>
              <StatusPill level={PAYMENT_STATUS[payment.status].level}>
                {PAYMENT_STATUS[payment.status].label}
              </StatusPill>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.wrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Datum</th>
                <th scope="col">Opis</th>
                <th scope="col">Način</th>
                <th scope="col">Status</th>
                <th scope="col" className={styles.numeric}>
                  Iznos
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className={styles.date}>{formatDate(payment.date)}</td>
                  <td>{payment.description}</td>
                  <td>{payment.method}</td>
                  <td>
                    <StatusPill level={PAYMENT_STATUS[payment.status].level}>
                      {PAYMENT_STATUS[payment.status].label}
                    </StatusPill>
                  </td>
                  <td className={`${styles.numeric} ${payment.status === 'FAILED' ? styles.failed : ''}`}>
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
