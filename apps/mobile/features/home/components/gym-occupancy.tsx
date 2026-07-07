import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlassIconButton } from '@/features/home/components/glass-icon-button';
import { colors } from '@/shared/theme/colors';

type Props = {
  count: number;
  capacity: number;
};

function levelFor(ratio: number) {
  if (ratio < 0.5) return { label: 'Ugodno za trening', color: colors.accent };
  if (ratio < 0.8) return { label: 'Umjerena gužva', color: '#FF9F0A' };
  return { label: 'Velika gužva', color: colors.danger };
}

function CountUp({
  value,
  accessibilityLabel,
  style,
}: {
  value: number;
  accessibilityLabel?: string;
  style?: StyleProp<TextStyle>;
}) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    let raf = 0;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / 900, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (value - from) * eased);
      setDisplay(current);
      fromRef.current = current;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <Text accessibilityLabel={accessibilityLabel} style={style}>
      {display}
    </Text>
  );
}

function OccupancyBar({ ratio, color }: { ratio: number; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [progress, ratio]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.surfaceBorder,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[{ height: '100%', borderRadius: 4, backgroundColor: color }, fillStyle]}
      />
    </View>
  );
}

export function GymOccupancy({ count, capacity }: Props) {
  const ratio = Math.min(count / capacity, 1);
  const level = levelFor(ratio);
  const [notify, setNotify] = useState(false);

  const toggleNotify = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotify((value) => !value);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: 16,
        gap: 12,
      }}
    >
      <View style={{ position: 'absolute', top: 14, right: 14, zIndex: 1 }}>
        <GlassIconButton
          name={notify ? 'notifications' : 'notifications-outline'}
          color={notify ? colors.accent : colors.textPrimary}
          interactive={false}
          onPress={toggleNotify}
          accessibilityLabel={
            notify ? 'Isključi obavijest kad je gužva manja' : 'Obavijesti me kad je gužva manja'
          }
        />
      </View>

      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 13,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        Broj ljudi u teretani
      </Text>

      <View style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <CountUp
            value={count}
            accessibilityLabel={`${count} ljudi u teretani, ${level.label}`}
            style={{
              color: colors.textPrimary,
              fontSize: 46,
              fontWeight: '800',
              lineHeight: 48,
            }}
          />
          <View
            style={{
              backgroundColor: `${level.color}26`,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              borderCurve: 'continuous',
              marginBottom: 6,
            }}
          >
            <Text style={{ color: level.color, fontSize: 13, fontWeight: '700' }}>
              {level.label}
            </Text>
          </View>
        </View>

        <OccupancyBar ratio={ratio} color={level.color} />
      </View>
    </View>
  );
}
