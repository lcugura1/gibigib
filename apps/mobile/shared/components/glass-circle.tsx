import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  diameter: number;
  interactive?: boolean;
  elevated?: boolean;
  colorScheme?: 'auto' | 'light' | 'dark';
  children: ReactNode;
};

export function GlassCircle({
  diameter,
  interactive = false,
  elevated = false,
  colorScheme = 'auto',
  children,
}: Props) {
  const radius = diameter / 2;

  if (isLiquidGlassAvailable()) {
    const glass = (
      <GlassView isInteractive={interactive} colorScheme={colorScheme} style={{ borderRadius: radius }}>
        {children}
      </GlassView>
    );

    if (!elevated) {
      return glass;
    }

    return (
      <View
        style={{
          borderRadius: radius,
          backgroundColor: colors.textPrimary,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }}
      >
        {glass}
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: radius,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
      }}
    >
      {children}
    </View>
  );
}
