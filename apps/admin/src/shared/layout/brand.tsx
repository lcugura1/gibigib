import { Link } from 'react-router';
import styles from './brand.module.css';

interface BrandProps {
  className?: string;
}

export function Brand({ className }: BrandProps) {
  return (
    <Link className={`${styles.brand} ${className ?? ''}`} to="/">
      GIBI GIB<small>ADMIN</small>
    </Link>
  );
}
