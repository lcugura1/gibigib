import type { OverviewRange } from '@gibigib/types';
import type { SegmentOption } from '../../shared/components/segmented-control';

export const RANGE_OPTIONS: readonly SegmentOption<OverviewRange>[] = [
  { value: 'today', label: 'Danas' },
  { value: '7d', label: '7 dana' },
  { value: '30d', label: '30 dana' },
  { value: '12m', label: '12 mj.' },
];

export const RANGE_COMPARISON: Record<OverviewRange, string> = {
  today: 'od jučer',
  '7d': 'od prošlih 7 dana',
  '30d': 'od prošlih 30 dana',
  '12m': 'od prošlih 12 mj.',
};

export const RANGE_PREVIOUS: Record<OverviewRange, string> = {
  today: 'prethodni dan',
  '7d': 'prethodnih 7 dana',
  '30d': 'prethodnih 30 dana',
  '12m': 'prethodnih 12 mj.',
};

export const RANGE_SPAN: Record<OverviewRange, string> = {
  today: 'danas',
  '7d': 'zadnjih 7 dana',
  '30d': 'zadnjih 30 dana',
  '12m': 'zadnjih 12 mj.',
};
