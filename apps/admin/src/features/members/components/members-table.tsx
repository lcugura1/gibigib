import type { CSSProperties, ReactNode } from 'react';
import type { CatalogDto, MemberListItemDto, MemberSortKey } from '@gibigib/types';
import { Link } from 'react-router';
import { Avatar } from '../../../shared/components/avatar';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { gymColor } from '../../../shared/domain/palette';
import { formatDate, formatInteger } from '../../../shared/lib/format';
import { formatLastVisit } from '../member-format';
import type { MemberSort } from '../services/members-state';
import { STATUS_LABEL, STATUS_LEVEL } from '../status';
import { InactivePill } from './inactive-pill';
import styles from './members-table.module.css';

interface Column {
  key: MemberSortKey;
  label: string;
  numeric?: boolean;
  wraps?: boolean;
  render: (member: MemberListItemDto) => ReactNode;
}

interface MembersTableProps {
  members: readonly MemberListItemDto[];
  now: string;
  catalog: CatalogDto;
  sort: MemberSort;
  onSort: (key: MemberSortKey) => void;
  compact: boolean;
  children?: ReactNode;
}

const COMPACT_COLUMNS: readonly MemberSortKey[] = ['name', 'plan', 'status', 'expiresAt', 'lastVisit'];

const SORT_ICON = { asc: 'sortUp', desc: 'sortDown' } as const;

const cellClass = (column: Column) =>
  [column.numeric ? styles.numeric : '', column.wraps ? styles.wraps : ''].join(' ').trim() || undefined;

export function MembersTable({ members, now, catalog, sort, onSort, compact, children }: MembersTableProps) {
  const gymIds = catalog.gyms.map((gym) => gym.id);
  const gymName = (id: string) => catalog.gyms.find((gym) => gym.id === id)?.name ?? '';

  const allColumns: readonly Column[] = [
    {
      key: 'name',
      label: 'Član',
      render: (m) => (
        <Link className={styles.member} to={`/clanovi/${m.id}`}>
          <Avatar name={m.name} />
          <span className={styles.who}>
            <b>{m.name}</b>
            <small>{m.email}</small>
          </span>
        </Link>
      ),
    },
    { key: 'plan', label: 'Plan', wraps: true, render: (m) => m.planName },
    {
      key: 'status',
      label: 'Status',
      render: (m) => <StatusPill level={STATUS_LEVEL[m.status]}>{STATUS_LABEL[m.status]}</StatusPill>,
    },
    {
      key: 'homeGym',
      label: 'Matična teretana',
      render: (m) => (
        <span className={styles.gym} style={{ '--tag': gymColor(gymIds, m.homeGymId) } as CSSProperties}>
          {gymName(m.homeGymId)}
        </span>
      ),
    },
    { key: 'expiresAt', label: 'Ističe', numeric: true, render: (m) => formatDate(m.expiresAt) },
    {
      key: 'lastVisit',
      label: 'Zadnji dolazak',
      render: (m) => (
        <span className={styles.lastVisit}>
          {formatLastVisit(m.lastVisitAt, now, 'table')}
          <InactivePill member={m} now={now} />
        </span>
      ),
    },
    { key: 'visits30d', label: 'Dolasci (30 d)', numeric: true, render: (m) => formatInteger(m.visits30d) },
  ];
  const columns = compact ? allColumns.filter((column) => COMPACT_COLUMNS.includes(column.key)) : allColumns;

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>Članovi</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort.key === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={column.numeric ? styles.numeric : undefined}
                  aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" className={styles.sort} onClick={() => onSort(column.key)}>
                    {column.label}
                    <Icon name={active ? SORT_ICON[sort.direction] : 'sort'} className={styles.sortIcon} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        {members.length > 0 && (
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                {columns.map((column) => (
                  <td key={column.key} className={cellClass(column)}>
                    {column.render(member)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {children}
    </div>
  );
}
