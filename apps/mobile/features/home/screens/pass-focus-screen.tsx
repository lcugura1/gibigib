import { BlurView } from 'expo-blur';
import * as Brightness from 'expo-brightness';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useEntryToken } from '@/features/home/hooks/use-entry-token';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SCREEN_WIDTH = Dimensions.get('window').width;
const QR_SIZE = Math.min(SCREEN_WIDTH - 96, 300);

export function PassFocusScreen() {
  const { value = 'demo' } = useLocalSearchParams<{ value: string }>();
  const { qrValue } = useEntryToken(true);
  const router = useRouter();
  const originalBrightness = useRef<number | null>(null);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await Brightness.getBrightnessAsync();
        if (active) originalBrightness.current = current;
        await Brightness.setBrightnessAsync(1);
      } catch {}
    })();
    return () => {
      active = false;
      if (originalBrightness.current != null) {
        Brightness.setBrightnessAsync(originalBrightness.current).catch(() => {});
      }
    };
  }, []);

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

      <Animated.View
        pointerEvents="none"
        style={[{ alignItems: 'center', gap: 24, paddingHorizontal: 24 }, cardStyle]}
      >
        <View
          style={{
            padding: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            borderCurve: 'continuous',
          }}
        >
          <QRCode value={qrValue ?? value} size={QR_SIZE} color="#000000" backgroundColor="#FFFFFF" />
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>
          Skeniraj kod na ulazu
        </Text>
      </Animated.View>
    </View>
  );
}
