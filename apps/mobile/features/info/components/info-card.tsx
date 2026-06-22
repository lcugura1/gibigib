import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/shared/theme/colors';

export function InfoCard({
  children,
  light = false,
  style,
}: {
  children: ReactNode;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const gradient: readonly [string, string] = light
    ? [colors.textPrimary, colors.textPrimary]
    : [colors.cardGradientFrom, colors.cardGradientTo];

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: 24,
          borderCurve: 'continuous',
          borderWidth: light ? 0 : 1,
          borderColor: colors.cardBorder,
          padding: 20,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
