import type { CSSProperties } from 'react';
import type { CatalogDto, ConnectedRevenueDto } from '@gibigib/types';
import { SectionLabel } from '../../../shared/components/section-label';
import { gymColor } from '../../../shared/domain/palette';
import { formatDecimal, formatInteger, formatMonth } from '../../../shared/lib/format';
import { formatEuro, formatWholeEuro } from '../revenue-format';
import styles from './revenue-breakdown.module.css';

const PLAN_SHORT: Record<string, string> = {
  mjesecno: 'Mjesečno',
  grupni: 'Grupni',
  godisnji: 'Godišnji',
  trener: '1 na 1',
};

interface RevenueBreakdownProps {
  breakdown: ConnectedRevenueDto['breakdown'];
  catalog: CatalogDto;
  viewport: 'phone' | 'tablet' | 'desktop';
}

const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);

const percentOf = (part: number, whole: number) => (whole === 0 ? 0 : (part / whole) * 100);

const formatShortPercent = (share: number) =>
  `${Number.isInteger(Math.round(share * 10) / 10) ? formatInteger(share) : formatDecimal(share)} %`;

export function RevenueBreakdown({ breakdown, catalog, viewport }: RevenueBreakdownProps) {
  const { month, planSlugs, rows } = breakdown;
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const gymName = (id: string) => catalog.gyms.find((gym) => gym.id === id)?.name ?? id;
  const planName = (slug: string) => catalog.plans.find((plan) => plan.slug === slug)?.name ?? slug;
  const rowTotals = rows.map((row) => sum(row.byPlan));
  const total = sum(rowTotals);
  const monthTitle = `${formatMonth(month)} ${new Date(month).getFullYear()}.`;
  const dot = (gymId: string) => ({ '--tag': gymColor(gymIds, gymId) }) as CSSProperties;

  if (viewport === 'phone') {
    const maxTotal = Math.max(...rowTotals, 1);
    return (
      <section className={styles.section} aria-labelledby="breakdown-heading">
        <div className={styles.head}>
          <SectionLabel id="breakdown-heading">Po teretani · {formatMonth(month)}</SectionLabel>
          <span className={styles.note}>{formatEuro(total)}</span>
        </div>
        <ul className={styles.list}>
          {rows.map((row, i) => {
            const rowTotal = rowTotals[i] ?? 0;
            const topPlans = row.byPlan
              .map((amount, p) => ({ amount, slug: planSlugs[p] ?? '' }))
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 2);
            return (
              <li key={row.gymId} className={styles.item} style={dot(row.gymId)}>
                <div className={styles.itemHead}>
                  <span className={styles.gym}>{gymName(row.gymId)}</span>
                  <b className={styles.amount}>{formatEuro(rowTotal)}</b>
                </div>
                <span className={styles.bar}>
                  <span style={{ inlineSize: `${(rowTotal / maxTotal) * 100}%` }} />
                </span>
                <span className={styles.note}>
                  {[
                    formatShortPercent(percentOf(rowTotal, total)),
                    ...topPlans.map(
                      (plan) => `${PLAN_SHORT[plan.slug] ?? planName(plan.slug)} ${formatWholeEuro(plan.amount)}`,
                    ),
                  ].join(' · ')}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const short = viewport === 'tablet';
  const planTotals = planSlugs.map((_, p) => sum(rows.map((row) => row.byPlan[p] ?? 0)));

  return (
    <section className={styles.section} aria-labelledby="breakdown-heading">
      <div className={styles.head}>
        <SectionLabel id="breakdown-heading">Raspodjela · {monthTitle}</SectionLabel>
        <span className={styles.note}>Godišnji raspoređen na 12 mjeseci · 1 na 1 prema stvarnim naplatama</span>
      </div>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Teretana</th>
              {planSlugs.map((slug) => (
                <th key={slug} scope="col" className={styles.num}>
                  {short ? (PLAN_SHORT[slug] ?? planName(slug)) : planName(slug)}
                </th>
              ))}
              <th scope="col" className={styles.num}>
                Ukupno
              </th>
              <th scope="col" className={`${styles.num} ${styles.share}`}>
                Udio
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.gymId}>
                <th scope="row">
                  <span className={styles.gym} style={dot(row.gymId)}>
                    {gymName(row.gymId)}
                  </span>
                </th>
                {row.byPlan.map((amount, p) => (
                  <td key={planSlugs[p]} className={styles.num}>
                    {formatEuro(amount)}
                  </td>
                ))}
                <td className={`${styles.num} ${styles.strong}`}>{formatEuro(rowTotals[i] ?? 0)}</td>
                <td className={`${styles.num} ${styles.muted} ${styles.share}`}>
                  {formatDecimal(percentOf(rowTotals[i] ?? 0, total))} %
                </td>
              </tr>
            ))}
          </tbody>
          {rows.length > 1 && (
            <tfoot>
              <tr>
                <th scope="row">Ukupno</th>
                {planTotals.map((amount, p) => (
                  <td key={planSlugs[p]} className={styles.num}>
                    {formatEuro(amount)}
                  </td>
                ))}
                <td className={styles.num}>{formatEuro(total)}</td>
                <td className={`${styles.num} ${styles.share}`}>100 %</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}
