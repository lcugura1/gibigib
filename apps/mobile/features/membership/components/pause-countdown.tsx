import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

const DIAMETER = 44;

type Props = {
  label: string;
  onPress?: () => void;
};

export function PauseCountdown({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Detalji pauze"
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}
    >
      {({ pressed }) => (
        <View
          style={{
            width: DIAMETER,
            height: DIAMETER,
            borderRadius: DIAMETER / 2,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Text
            style={{
              color: colors.accent,
              fontSize: 15,
              fontWeight: '700',
              opacity: pressed ? 0.5 : 1,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
