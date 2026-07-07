import { Text, View } from 'react-native';
import { GlassCircle } from '@/shared/components/glass-circle';
import { colors } from '@/shared/theme/colors';

const DIAMETER = 44;

type Props = {
  label: string;
};

export function MembershipCountdown({ label }: Props) {
  return (
    <GlassCircle diameter={DIAMETER} elevated>
      <View
        style={{
          width: DIAMETER,
          height: DIAMETER,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.textOnLight, fontSize: 15, fontWeight: '700' }}>
          {label}
        </Text>
      </View>
    </GlassCircle>
  );
}
