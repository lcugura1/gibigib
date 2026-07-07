import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { GlassCircle } from '@/shared/components/glass-circle';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  interactive?: boolean;
  elevated?: boolean;
  accessibilityLabel?: string;
};

const DIAMETER = 44;

export function GlassIconButton({
  name,
  onPress,
  color = colors.textPrimary,
  interactive = true,
  elevated = false,
  accessibilityLabel,
}: Props) {
  return (
    <GlassCircle diameter={DIAMETER} interactive={interactive} elevated={elevated}>
      <Pressable
        onPress={onPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
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
    </GlassCircle>
  );
}
