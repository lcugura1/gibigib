import { Icon } from './icon';
import styles from './load-error.module.css';

interface LoadErrorProps {
  onRetry: () => void;
  title?: string;
  note?: string;
  framed?: boolean;
}

export function LoadError({ onRetry, title = 'Podaci se nisu učitali', note, framed = true }: LoadErrorProps) {
  return (
    <section className={framed ? `${styles.error} ${styles.framed}` : styles.error} role="alert">
      <span className={styles.icon}>
        <Icon name="cloudOff" />
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>Nije moguće povezati se s poslužiteljem. Pokušaj ponovno.</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        <Icon name="refresh" />
        Pokušaj ponovno
      </button>
      {note && <p className={styles.note}>{note}</p>}
    </section>
  );
}
