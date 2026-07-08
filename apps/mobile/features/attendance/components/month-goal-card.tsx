import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/shared/theme/colors';
import { CountUp } from '@/shared/components/count-up';

const SIZE = 120;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  count: number;
  goal: number | null;
  onPress: () => void;
};

export function MonthGoalCard({ count, goal, onPress }: Props) {
  const ratio = goal ? Math.min(count / goal, 1) : 0;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress, ratio]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      {({ pressed }) => (
        <LinearGradient
          colors={[colors.cardGradientFrom, colors.cardGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            borderRadius: 24,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.cardBorder,
            padding: 18,
            alignItems: 'center',
            gap: 12,
            opacity: pressed ? 0.9 : 1,
          }}
        >
          <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={colors.cardBorder}
                strokeWidth={STROKE}
                fill="none"
              />
              <AnimatedCircle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={colors.accent}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                animatedProps={ringProps}
                fill="none"
              />
            </Svg>
            <View style={{ position: 'absolute', flexDirection: 'row', alignItems: 'baseline' }}>
              <CountUp
                value={count}
                style={{ color: colors.textPrimary, fontSize: 42, fontWeight: '800', letterSpacing: -1 }}
              />
              {goal ? (
                <Text style={{ color: colors.textSecondary, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>
                  /{goal}
                </Text>
              ) : null}
            </View>
          </View>

          {goal ? (
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Ovaj mjesec</Text>
          ) : (
            <Text style={{ color: colors.accent, fontSize: 15, fontWeight: '700' }}>Postavi cilj</Text>
          )}
        </LinearGradient>
      )}
    </Pressable>
  );
}
