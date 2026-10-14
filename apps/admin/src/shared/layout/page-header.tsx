import { Icon } from '../components/icon';
import styles from './page-header.module.css';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <label className={styles.search}>
        <Icon name="search" />
        <input type="search" placeholder="Pretraži članove" aria-label="Pretraži članove" />
      </label>
      <button className={styles.profile} type="button" aria-label="Profil vlasnika">
        <Icon name="person" />
      </button>
    </header>
  );
}
