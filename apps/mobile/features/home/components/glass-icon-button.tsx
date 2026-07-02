import { Ionicons } from '@expo/vector-icons';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Pressable, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  interactive?: boolean;
  elevated?: boolean;
};

const DIAMETER = 44;

export function GlassIconButton({
  name,
  onPress,
  color = colors.textPrimary,
  interactive = true,
  elevated = false,
}: Props) {
  const content = (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: DIAMETER,
        height: DIAMETER,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: !interactive && pressed ? 0.5 : 1,
      })}
    >
      <Ionicons name={name} size={20} color={color} />
    </Pressable>
  );

  if (isLiquidGlassAvailable()) {
    const glass = (
      <GlassView isInteractive={interactive} style={{ borderRadius: DIAMETER / 2 }}>
        {content}
      </GlassView>
    );

    if (!elevated) {
      return glass;
    }

    return (
      <View
        style={{
          borderRadius: DIAMETER / 2,
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
