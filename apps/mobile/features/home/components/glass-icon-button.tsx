import { Ionicons } from '@expo/vector-icons';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Pressable, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

const DIAMETER = 44;

export function GlassIconButton({ name, onPress }: Props) {
  const content = (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: DIAMETER,
        height: DIAMETER,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={20} color={colors.textPrimary} />
    </Pressable>
  );

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView isInteractive style={{ borderRadius: DIAMETER / 2 }}>
        {content}
      </GlassView>
    );
  }

  return (
    <View
      style={{
        borderRadius: DIAMETER / 2,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
      }}
    >
      {content}
    </View>
  );
}
