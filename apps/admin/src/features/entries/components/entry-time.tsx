import { formatDayMonth } from '../../../shared/lib/format';
import styles from './entry-time.module.css';

const sameDay = (a: string, b: string) => a.slice(0, 10) === b.slice(0, 10);

interface EntryTimeProps {
  at: string;
  now: string;
  seconds: boolean;
}

export function EntryTime({ at, now, seconds }: EntryTimeProps) {
  const clock = at.slice(11, 16);
  return (
    <time className={styles.time} dateTime={at}>
      {!sameDay(at, now) && <span className={styles.day}>{formatDayMonth(at)} </span>}
      {clock}
      {seconds && <span className={styles.seconds}>{at.slice(16, 19)}</span>}
    </time>
  );
}
