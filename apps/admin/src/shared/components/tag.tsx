import styles from './tag.module.css';

export function TagList({ values, label }: { values: readonly string[]; label: string }) {
  return (
    <ul className={styles.list} aria-label={label}>
      {values.map((value) => (
        <li key={value} className={styles.tag}>
          {value}
        </li>
      ))}
    </ul>
  );
}
