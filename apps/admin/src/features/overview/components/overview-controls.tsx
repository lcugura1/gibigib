import type { GymLiveDto, OverviewRange } from '@gibigib/types';
import { SegmentedControl } from '../../../shared/components/segmented-control';
import { RANGE_OPTIONS, RANGE_PREVIOUS } from '../range';
import { ALL_GYMS, selectRange, selectScope } from '../services/overview-state';
import styles from './overview-controls.module.css';

interface OverviewControlsProps {
  gyms: readonly GymLiveDto[];
  scope: string;
  range: OverviewRange;
}

export function OverviewControls({ gyms, scope, range }: OverviewControlsProps) {
  const scopeOptions = [
    { value: ALL_GYMS, label: 'Sve teretane' },
    ...gyms.map((gym) => ({ value: gym.id, label: gym.name })),
  ];

  return (
    <div className={styles.controls}>
      <SegmentedControl label="Teretana" options={scopeOptions} value={scope} onChange={selectScope} />
      <SegmentedControl label="Razdoblje" options={RANGE_OPTIONS} value={range} onChange={selectRange} />
      <p className={styles.comparison}>Usporedba: {RANGE_PREVIOUS[range]}</p>
    </div>
  );
}
