import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/shared/theme/colors';
import type { TagStat } from '@/features/attendance/data/visits';

const SIZE = 240;
const CENTER = SIZE / 2;
const OUTER = 104;
const INNER = 60;
const POP = 10;
const GAP = 2.5;

function polar(angle: number, radius: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(a), y: CENTER + radius * Math.sin(a) };
}

function segmentPath(startAngle: number, endAngle: number, outerR: number) {
  const a0 = startAngle + GAP / 2;
  const a1 = endAngle - GAP / 2;
  const o0 = polar(a0, outerR);
  const o1 = polar(a1, outerR);
  const i1 = polar(a1, INNER);
  const i0 = polar(a0, INNER);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${o0.x} ${o0.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ');
}

type Props = {
  tags: TagStat[];
};

export function TrainingChart({ tags }: Props) {
  const [selected, setSelected] = useState<string | null>(tags[0]?.label ?? null);

  const total = tags.reduce((sum, tag) => sum + tag.count, 0);

  if (tags.length === 0 || total === 0) {
    return (
      <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
        Označi dolaske u kalendaru da vidiš statistiku treninga.
      </Text>
    );
  }

  const active = tags.find((tag) => tag.label === selected) ?? tags[0];
  const activePct = Math.round((active.count / total) * 100);

  let cursor = 0;
  const segments = tags.map((tag) => {
    const start = cursor;
    const end = cursor + (tag.count / total) * 360;
    cursor = end;
    return { tag, start, end };
  });

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: 20,
        alignItems: 'center',
        gap: 18,
      }}
    >
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {segments.map(({ tag, start, end }) => {
            const isActive = tag.label === active.label;
            return (
              <Path
                key={tag.label}
                d={segmentPath(start, end, isActive ? OUTER + POP : OUTER)}
                fill={tag.color}
                opacity={isActive ? 1 : 0.4}
                onPress={() => setSelected(tag.label)}
              />
            );
          })}
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

      <View style={{ width: '100%', gap: 10 }}>
        {tags.map((tag) => {
          const isActive = tag.label === active.label;
          const pct = Math.round((tag.count / total) * 100);
          return (
            <Pressable
              key={tag.label}
              onPress={() => setSelected(tag.label)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, opacity: isActive ? 1 : 0.55 }}
            >
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: tag.color }} />
              <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 15, fontWeight: isActive ? '700' : '400' }}>
                {tag.label}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{pct}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
