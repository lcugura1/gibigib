import type { ReactNode } from 'react';
import { Icon } from './icon';
import { formatInteger } from '../lib/format';
import styles from './pager.module.css';

export function shownRange(page: number, pageSize: number, shown: number) {
  const first = (page - 1) * pageSize + 1;
  return `${formatInteger(first)}–${formatInteger(first + shown - 1)}`;
}

interface PagerProps {
  label: string;
  summary: string;
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  actions?: ReactNode;
}

export function Pager({ label, summary, page, pageSize, total, onPage, actions }: PagerProps) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav className={styles.pager} aria-label={label}>
      <p>{summary}</p>
      <div className={styles.end}>
        {actions}
        <div className={styles.buttons}>
          <button type="button" aria-label="Prethodna stranica" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            <Icon name="chevronLeft" />
          </button>
          <button
            type="button"
            aria-label="Sljedeća stranica"
            disabled={page >= lastPage}
            onClick={() => onPage(page + 1)}
          >
            <Icon name="chevron" />
          </button>
        </div>
      </div>
    </nav>
  );
}
