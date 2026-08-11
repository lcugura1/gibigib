import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FADE_IN_DISTANCE = 24;
const HEADER_HEIGHT = 52;
const RAMP_HEIGHT = 44;
const LAYERS = 6;
const LAYER_INTENSITY = 10;

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
  const solidHeight = height ?? insets.top + HEADER_HEIGHT;
  const totalHeight = solidHeight + RAMP_HEIGHT;
  const rampStart = solidHeight / totalHeight;
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
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, height: totalHeight },
        animatedStyle,
      ]}
    >
      {Array.from({ length: LAYERS }, (_, index) => {
        const step = (1 - rampStart) / LAYERS;
        const fadeStart = rampStart + step * (LAYERS - 1 - index);

        return (
          <MaskedView
            key={index}
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                colors={['black', 'black', 'transparent']}
                locations={[0, fadeStart, fadeStart + step]}
                style={StyleSheet.absoluteFill}
              />
            }
          >
            <BlurView intensity={LAYER_INTENSITY} tint="dark" style={StyleSheet.absoluteFill} />
          </MaskedView>
        );
      })}
    </Animated.View>
  );
}
