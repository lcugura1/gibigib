import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MEMBERSHIP_PAUSE_MAX_DAYS } from '@gibigib/types';
import { formatDays } from '@/features/membership/hooks/use-membership-pause';
import { colors } from '@/shared/theme/colors';

const SEGMENT_STAGGER_MS = 30;
const SEGMENTS_DELAY_MS = 380;

export function PauseBlock({ days }: { days: number }) {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${formatDays(days)} do automatskog nastavka`}
      style={{
        width: 232,
        height: 232,
        paddingTop: 24,
        paddingHorizontal: 22,
        paddingBottom: 26,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Ionicons name="pause-outline" size={24} color={colors.accent} />

      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 46,
            lineHeight: 48,
            fontWeight: '800',
            letterSpacing: -0.5,
          }}
        >
          {formatDays(days)}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>do automatskog nastavka</Text>
      </View>

      <View style={{ alignSelf: 'stretch', flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: MEMBERSHIP_PAUSE_MAX_DAYS }, (_, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.duration(200).delay(SEGMENTS_DELAY_MS + index * SEGMENT_STAGGER_MS)}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: index < days ? colors.accent : colors.surfaceBorder,
            }}
          />
        ))}
      </View>
    </View>
  );
}
