import { Text } from 'react-native';
import { colors } from '@/shared/theme/colors';

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}
