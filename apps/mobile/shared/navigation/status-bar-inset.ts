import { initialWindowMetrics } from 'react-native-safe-area-context';

export const statusBarInset = initialWindowMetrics?.insets.top ?? 0;
