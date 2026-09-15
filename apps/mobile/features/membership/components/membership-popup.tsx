import { useRouter } from 'expo-router';
import { useCallback, useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors } from '@/shared/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  locked?: boolean;
  children: (close: () => void) => ReactNode;
};

export function MembershipPopup({ locked = false, children }: Props) {
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, { damping: 16, stiffness: 180, mass: 0.9 });
  }, [progress]);

  const close = useCallback(() => {
    progress.value = withTiming(0, { duration: 180 }, (finished) => {
      if (finished) {
        scheduleOnRN(router.back);
      }
    });
  }, [progress, router]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 24 }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <AnimatedPressable
        disabled={locked}
        onPress={close}
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, backdropStyle]}
      />
      <View pointerEvents="box-none" style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Animated.View
          style={[
            {
              backgroundColor: colors.surface,
              borderRadius: 24,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              padding: 24,
              gap: 20,
            },
            cardStyle,
          ]}
        >
          {children(close)}
        </Animated.View>
      </View>
    </View>
  );
}
