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
import { colors } from '@/shared/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MembershipExpiryScreen() {
  const router = useRouter();
  const { membership, longLabel } = useMembershipCountdown();

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
              borderRadius: 28,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              paddingVertical: 30,
              paddingHorizontal: 36,
              marginHorizontal: 24,
              alignItems: 'center',
              gap: 10,
            },
            cardStyle,
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              fontWeight: '600',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Aktivan plan
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
          {longLabel ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
                Ističe za {longLabel}
              </Text>
            </View>
          ) : null}
        </Animated.View>
      ) : null}
    </View>
  );
}
