import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/shared/theme/colors';
import { SectionLabel } from '@/shared/components/section-label';
import type { TagStat } from '@/features/attendance/data/visits';

const SIZE = 240;
const CENTER = SIZE / 2;
const OUTER = 104;
const INNER = 76;
const POP = 10;
const GAP = 2.5;

const AnimatedPath = Animated.createAnimatedComponent(Path);

function polar(angle: number, radius: number) {
  'worklet';
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(a), y: CENTER + radius * Math.sin(a) };
}

function segmentPath(startAngle: number, endAngle: number, outerR: number) {
  'worklet';
  const a0 = startAngle + GAP / 2;
  const a1 = endAngle - GAP / 2;
  const o0 = polar(a0, outerR);
  const o1 = polar(a1, outerR);
  const i1 = polar(a1, INNER);
  const i0 = polar(a0, INNER);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${o0.x} ${o0.y} A ${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y} L ${i1.x} ${i1.y} A ${INNER} ${INNER} 0 ${large} 0 ${i0.x} ${i0.y} Z`;
}

type SliceProps = {
  start: number;
  end: number;
  color: string;
  isActive: boolean;
  onPress: () => void;
};

function Slice({ start, end, color, isActive, onPress }: SliceProps) {
  const t = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    t.value = withTiming(isActive ? 1 : 0, { duration: 240 });
  }, [isActive, t]);

  const animatedProps = useAnimatedProps(() => ({
    d: segmentPath(start, end, OUTER + POP * t.value),
    opacity: 0.4 + t.value * 0.6,
  }));

  return <AnimatedPath fill={color} animatedProps={animatedProps} onPress={onPress} />;
}

type Props = {
  tags: TagStat[];
};

export function TrainingChart({ tags }: Props) {
  const [selected, setSelected] = useState<string | null>(tags[0]?.color ?? null);

  const total = tags.reduce((sum, tag) => sum + tag.count, 0);

  if (tags.length === 0 || total === 0) {
    return (
      <View style={styles.card}>
        <SectionLabel>Najčešći treninzi</SectionLabel>
        <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
          Označi dolaske u kalendaru da vidiš statistiku treninga.
        </Text>
      </View>
    );
  }

  const active = tags.find((tag) => tag.color === selected) ?? tags[0];
  const activePct = Math.round((active.count / total) * 100);

  let cursor = 0;
  const segments = tags.map((tag) => {
    const start = cursor;
    const end = cursor + (tag.count / total) * 360;
    cursor = end;
    return { tag, start, end };
  });

  return (
    <View style={styles.card}>
      <SectionLabel>Najčešći treninzi</SectionLabel>

      <View style={{ alignItems: 'center' }}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            {segments.map(({ tag, start, end }) => (
              <Slice
                key={tag.color}
                start={start}
                end={end}
                color={tag.color}
                isActive={tag.color === active.color}
                onPress={() => setSelected(tag.color)}
              />
            ))}
          </Svg>

          <View
            pointerEvents="none"
            style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: active.color, fontSize: 15, fontWeight: '600' }}>{active.label}</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 40, fontWeight: '800' }}>{activePct}%</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {active.count} {active.count === 1 ? 'trening' : 'treninga'}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag) => {
          const isActive = tag.color === active.color;
          const pct = Math.round((tag.count / total) * 100);
          return (
            <Pressable
              key={tag.color}
              onPress={() => setSelected(tag.color)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: isActive ? tag.color : colors.surfaceBorder,
                backgroundColor: isActive ? `${tag.color}1F` : 'transparent',
              }}
            >
              <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: tag.color }} />
              <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: isActive ? '700' : '500' }}>
                {tag.label}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{pct}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 20,
    gap: 18,
  },
});
