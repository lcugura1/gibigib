import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { GlassCircle } from '@/shared/components/glass-circle';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  interactive?: boolean;
  elevated?: boolean;
  muted?: boolean;
  accessibilityLabel?: string;
};

const DIAMETER = 44;

export function GlassIconButton({
  name,
  onPress,
  color = colors.textPrimary,
  interactive = true,
  elevated = false,
  muted = false,
  accessibilityLabel,
}: Props) {
  if (interactive) {
    return (
      <GlassCircle diameter={DIAMETER} interactive elevated={elevated}>
        <Pressable
          onPress={onPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={{ width: DIAMETER, height: DIAMETER, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name={name} size={20} color={color} />
        </Pressable>
      </GlassCircle>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}
    >
      {({ pressed }) => {
        const icon = (
          <View
            style={{
              width: DIAMETER,
              height: DIAMETER,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.5 : 1,
            }}
          >
            <Ionicons name={name} size={20} color={muted ? colors.textOnLightSecondary : color} />
          </View>
        );

        if (muted) {
          return (
            <View
              style={{
                borderRadius: DIAMETER / 2,
                backgroundColor: colors.surfaceOnLightMuted,
              }}
            >
              {icon}
            </View>
          );
        }

        return (
          <GlassCircle diameter={DIAMETER} elevated={elevated}>
            {icon}
          </GlassCircle>
        );
      }}
    </Pressable>
  );
}
