import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { colors } from '@/shared/theme/colors';
import { CountUp } from '@/shared/components/count-up';

const CHART_H = 52;
const PAD = 6;

type Props = {
  total: number;
  trend: number[];
};

function buildPaths(trend: number[], width: number) {
  const n = trend.length;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;

  const points = trend.map((value, i) => {
    const x = n === 1 ? width : (i / (n - 1)) * width;
    const y = CHART_H - PAD - ((value - min) / range) * (CHART_H - 2 * PAD);
    return { x, y };
  });

  const poly = points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  const line = `M ${poly}`;
  const area = `M ${points[0].x.toFixed(1)} ${CHART_H} L ${poly} L ${points[n - 1].x.toFixed(1)} ${CHART_H} Z`;
  const end = points[n - 1];

  return { line, area, end };
}

export function TotalTrendCard({ total, trend }: Props) {
  const [width, setWidth] = useState(0);

  return (
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
        overflow: 'hidden',
      }}
    >
      <View style={{ gap: 2 }}>
        <CountUp
          value={total}
          style={{ color: colors.textPrimary, fontSize: 52, fontWeight: '800', letterSpacing: -1.5 }}
        />
        <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Ukupno</Text>
      </View>

      <View
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={{ flex: 1, minHeight: CHART_H, justifyContent: 'flex-end', marginHorizontal: -18, marginBottom: -18 }}
      >
        {width > 0
          ? (() => {
              const { line, area, end } = buildPaths(trend, width);
              return (
                <Svg width={width} height={CHART_H}>
                  <Defs>
                    <SvgGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={colors.accent} stopOpacity={0.28} />
                      <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
                    </SvgGradient>
                  </Defs>
                  <Path d={area} fill="url(#trendFill)" />
                  <Path
                    d={line}
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <Circle cx={Math.min(end.x, width - 4)} cy={end.y} r={3} fill={colors.accent} />
                </Svg>
              );
            })()
          : null}
      </View>
    </LinearGradient>
  );
}
