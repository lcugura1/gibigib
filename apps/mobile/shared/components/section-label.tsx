import { Text } from 'react-native';
import { colors } from '@/shared/theme/colors';

export function SectionLabel({
  children,
  color = colors.textSecondary,
}: {
  children: string;
  color?: string;
}) {
  return (
    <Text
      style={{
        color,
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
