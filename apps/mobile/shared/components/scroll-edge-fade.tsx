import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme/colors';

const FADE_IN_DISTANCE = 24;
const SCRIM_HEIGHT = 28;
const HEADER_HEIGHT = 52;

type Props = {
  scrollY: SharedValue<number>;
  height?: number;
  /** For scroll views with contentInsetAdjustmentBehavior="automatic", where the resting offset is -insets.top. */
  insetAdjusted?: boolean;
};

export function useScrollEdge() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return { scrollY, onScroll };
}

export function ScrollEdgeFade({ scrollY, height, insetAdjusted = false }: Props) {
  const insets = useSafeAreaInsets();
  const barHeight = height ?? insets.top + HEADER_HEIGHT;
  const restingOffset = insetAdjusted ? -insets.top : 0;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [restingOffset, restingOffset + FADE_IN_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', top: 0, left: 0, right: 0 }, animatedStyle]}
    >
      {isLiquidGlassAvailable() ? (
        <GlassView style={{ height: barHeight }} colorScheme="dark" />
      ) : (
        <BlurView intensity={60} tint="dark" style={{ height: barHeight }} />
      )}
      <LinearGradient colors={[colors.background, 'transparent']} style={{ height: SCRIM_HEIGHT }} />
    </Animated.View>
  );
}
