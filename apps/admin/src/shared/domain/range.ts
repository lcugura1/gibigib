import type { AnalyticsRange } from '@gibigib/types';
import type { SegmentOption } from '../components/segmented-control';

export const RANGE_OPTIONS: readonly SegmentOption<AnalyticsRange>[] = [
  { value: 'today', label: 'Danas' },
  { value: '7d', label: '7 dana' },
  { value: '30d', label: '30 dana' },
  { value: '12m', label: '12 mj.' },
];

export const RANGE_COMPARISON: Record<AnalyticsRange, string> = {
  today: 'od jučer',
  '7d': 'od prošlih 7 dana',
  '30d': 'od prošlih 30 dana',
  '12m': 'od prošlih 12 mj.',
};

export const RANGE_PREVIOUS: Record<AnalyticsRange, string> = {
  today: 'jučer',
  '7d': 'prethodnih 7 dana',
  '30d': 'prethodnih 30 dana',
  '12m': 'prethodnih 12 mj.',
};

export const RANGE_SPAN: Record<AnalyticsRange, string> = {
  today: 'danas',
  '7d': 'zadnjih 7 dana',
  '30d': 'zadnjih 30 dana',
  '12m': 'zadnjih 12 mj.',
};

export const RANGE_SHORT: Record<AnalyticsRange, string> = {
  today: 'danas',
  '7d': '7 dana',
  '30d': '30 dana',
  '12m': '12 mj.',
};
