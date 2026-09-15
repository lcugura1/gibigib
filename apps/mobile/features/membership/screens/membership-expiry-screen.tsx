import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useMembershipCountdown } from '@/features/membership/hooks/use-membership-countdown';
import {
  formatDayMonth,
  formatDays,
  useMembershipPause,
} from '@/features/membership/hooks/use-membership-pause';
import { colors } from '@/shared/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function InfoRow({
  icon,
  iconColor = colors.textSecondary,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  children: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text style={{ color: colors.textSecondary, fontSize: 15 }}>{children}</Text>
    </View>
  );
}

export function MembershipExpiryScreen() {
  const router = useRouter();
  const { membership, longLabel } = useMembershipCountdown();
  const pause = useMembershipPause();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const dismiss = () => {
    progress.value = withTiming(
      0,
      { duration: 220, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) {
          scheduleOnRN(router.back);
        }
      },
    );
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1]) }],
  }));

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AnimatedPressable style={[StyleSheet.absoluteFill, backdropStyle]} onPress={dismiss}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
      </AnimatedPressable>

      {membership ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              backgroundColor: colors.surface,
              borderRadius: 24,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              padding: 24,
              marginHorizontal: 24,
              alignItems: 'center',
              gap: 20,
            },
            cardStyle,
          ]}
        >
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {pause.paused ? 'Pauziran plan' : 'Aktivan plan'}
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 24,
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              {membership.program.name}
            </Text>
          </View>

          {pause.paused ? (
            <View style={{ alignItems: 'center', gap: 6 }}>
              <InfoRow icon="pause-circle-outline" iconColor={colors.accent}>
                {`Nastavlja se za ${formatDays(pause.remainingDays)}`}
              </InfoRow>
              {pause.endDateAfterFullPause ? (
                <InfoRow icon="calendar-outline">
                  {`Nakon pauze ističe ${formatDayMonth(pause.endDateAfterFullPause)}`}
                </InfoRow>
              ) : null}
            </View>
          ) : longLabel ? (
            <InfoRow icon="time-outline">{`Ističe za ${longLabel}`}</InfoRow>
          ) : null}
        </Animated.View>
      ) : null}
    </View>
  );
}
