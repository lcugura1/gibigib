import type { CSSProperties } from 'react';
import type { CatalogDto, TrainerDto } from '@gibigib/types';
import { Link } from 'react-router';
import { Icon } from '../../../shared/components/icon';
import { TagList } from '../../../shared/components/tag';
import { gymColor } from '../../../shared/domain/palette';
import { initials } from '../../../shared/lib/format';
import styles from './trainer-list.module.css';

interface TrainerListProps {
  trainers: readonly TrainerDto[];
  catalog: CatalogDto;
  selected?: string;
  hrefOf: (id: string) => string;
}

export function TrainerPhoto({
  trainer,
  size = 'regular',
}: {
  trainer: Pick<TrainerDto, 'name' | 'photoUrl'>;
  size?: 'regular' | 'small';
}) {
  return (
    <span className={`${styles.photo} ${styles[size]}`} aria-hidden="true">
      {trainer.photoUrl ? <img src={trainer.photoUrl} alt="" /> : initials(trainer.name)}
    </span>
  );
}

export function TrainerGrid({ trainers, catalog, selected, hrefOf }: TrainerListProps) {
  const gymIds = catalog.gyms.map((gym) => gym.id);

  return (
    <ul className={styles.grid}>
      {trainers.map((trainer) => (
        <li key={trainer.id}>
          <Link
            className={trainer.id === selected ? `${styles.card} ${styles.selected}` : styles.card}
            to={hrefOf(trainer.id)}
            aria-current={trainer.id === selected ? 'true' : undefined}
          >
            <span className={styles.cardTop}>
              <TrainerPhoto trainer={trainer} />
              <span className={styles.years}>{trainer.experienceYears} god.</span>
            </span>
            <span className={styles.who}>
              <b>{trainer.name}</b>
              <span>{trainer.role}</span>
            </span>
            {trainer.specialties.length > 0 && <TagList values={trainer.specialties} label="Specijalnosti" />}
            <span className={styles.gym} style={{ '--tag': gymColor(gymIds, trainer.gymId) } as CSSProperties}>
              {catalog.gyms.find((gym) => gym.id === trainer.gymId)?.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TrainerRows({ trainers, hrefOf }: Omit<TrainerListProps, 'catalog' | 'selected'>) {
  return (
    <ul className={styles.rows}>
      {trainers.map((trainer) => (
        <li key={trainer.id}>
          <Link className={styles.row} to={hrefOf(trainer.id)}>
            <TrainerPhoto trainer={trainer} size="small" />
            <span className={styles.rowBody}>
              <span className={styles.who}>
                <b>{trainer.name}</b>
                <span>
                  {trainer.role} · <span className={styles.nowrap}>{trainer.experienceYears} god.</span>
                </span>
              </span>
              {trainer.specialties.length > 0 && <TagList values={trainer.specialties} label="Specijalnosti" />}
            </span>
            <Icon name="chevron" className={styles.chevron} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
