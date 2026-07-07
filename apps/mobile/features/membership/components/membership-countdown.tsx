import { Pressable, Text } from 'react-native';
import { GlassCircle } from '@/shared/components/glass-circle';
import { colors } from '@/shared/theme/colors';

const DIAMETER = 44;

type Props = {
  label: string;
  onPress?: () => void;
};

export function MembershipCountdown({ label, onPress }: Props) {
  return (
    <GlassCircle diameter={DIAMETER} elevated>
      <Pressable
        onPress={onPress}
        hitSlop={8}
        style={({ pressed }) => ({
          width: DIAMETER,
          height: DIAMETER,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Text style={{ color: colors.textOnLight, fontSize: 15, fontWeight: '700' }}>
          {label}
        </Text>
      </Pressable>
    </GlassCircle>
  );
}
