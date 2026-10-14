import type { EventDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Icon } from '../../../shared/components/icon';
import { StatusPill } from '../../../shared/components/status-pill';
import { formatDate } from '../../../shared/lib/format';
import styles from './event-list.module.css';

interface EventListProps {
  events: readonly EventDto[];
  selected?: string;
  hrefOf: (id: string) => string;
}

export function EventStatusPill({ status }: { status: EventDto['status'] }) {
  return status === 'PUBLISHED' ? (
    <StatusPill level="ok">Objavljeno</StatusPill>
  ) : (
    <StatusPill level="muted">Skica</StatusPill>
  );
}

export function EventImage({ url, className }: { url: string | null; className?: string }) {
  return (
    <span className={`${styles.image} ${className ?? ''}`} aria-hidden="true">
      {url ? <img src={url} alt="" /> : <Icon name="image" />}
    </span>
  );
}

export function EventRows({ events, selected, hrefOf }: EventListProps) {
  return (
    <ul className={styles.rows}>
      {events.map((event) => (
        <li key={event.id}>
          <Link
            className={event.id === selected ? `${styles.row} ${styles.selected}` : styles.row}
            to={hrefOf(event.id)}
            aria-current={event.id === selected ? 'true' : undefined}
          >
            <EventImage url={event.imageUrl} className={styles.thumb} />
            <span className={styles.text}>
              <b>{event.title}</b>
              <span>{formatDate(event.date)}</span>
            </span>
            <EventStatusPill status={event.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function EventCards({ events, hrefOf }: EventListProps) {
  return (
    <ul className={styles.cards}>
      {events.map((event) => (
        <li key={event.id}>
          <Link className={styles.card} to={hrefOf(event.id)}>
            <EventImage url={event.imageUrl} className={styles.cover} />
            <span className={styles.body}>
              <span className={styles.meta}>
                <span>{formatDate(event.date)}</span>
                <EventStatusPill status={event.status} />
              </span>
              <b>{event.title}</b>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
