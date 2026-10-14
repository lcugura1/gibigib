import type { AnalyticsRange } from '@gibigib/types';
import { SegmentedControl } from './segmented-control';
import { SelectField } from './select-field';
import { useViewport } from '../layout/viewport';
import { RANGE_OPTIONS } from '../domain/range';
import { ALL_GYMS } from '../domain/scope';
import styles from './scope-range-controls.module.css';

interface ScopeControl {
  gyms: readonly { id: string; name: string }[];
  value: string;
  onChange: (scope: string) => void;
}

interface ScopeRangeControlsProps {
  scope?: ScopeControl;
  range: AnalyticsRange;
  onRange: (range: AnalyticsRange) => void;
  comparison?: string;
}

const ALL_GYMS_LABEL = 'Sve teretane';

export function ScopeRangeControls({ scope, range, onRange, comparison }: ScopeRangeControlsProps) {
  const viewport = useViewport();

  if (viewport === 'phone') {
    return (
      <div className={styles.phone}>
        {scope && (
          <SelectField
            label="Teretana"
            value={scope.value}
            options={[
              { value: ALL_GYMS, label: ALL_GYMS_LABEL },
              ...scope.gyms.map((gym) => ({ value: gym.id, label: gym.name })),
            ]}
            onChange={scope.onChange}
          />
        )}
        <SegmentedControl
          label="Razdoblje"
          options={RANGE_OPTIONS}
          value={range}
          onChange={onRange}
          size="small"
          fill
        />
      </div>
    );
  }

  const size = viewport === 'tablet' ? 'small' : 'regular';

  return (
    <div className={styles.controls}>
      {scope && (
        <SegmentedControl
          className={styles.scope}
          label="Teretana"
          options={[
            {
              value: ALL_GYMS,
              label: (
                <>
                  Sve<span className={styles.allRest}> teretane</span>
                </>
              ),
            },
            ...scope.gyms.map((gym) => ({ value: gym.id, label: gym.name })),
          ]}
          value={scope.value}
          onChange={scope.onChange}
          size={size}
        />
      )}
      <SegmentedControl label="Razdoblje" options={RANGE_OPTIONS} value={range} onChange={onRange} size={size} />
      {comparison && <p className={styles.comparison}>{comparison}</p>}
    </div>
  );
}
