import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';

type Segment = { label: string; count: number };

const GUTTER = 4;

export function CityTabs({
  segments,
  activeIndex,
  onChange,
}: {
  segments: Segment[];
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useSharedValue(0);
  const segmentWidth = trackWidth > 0 ? (trackWidth - GUTTER * 2) / segments.length : 0;

  useEffect(() => {
    x.value = withTiming(activeIndex * segmentWidth, { duration: 220 });
  }, [activeIndex, segmentWidth, x]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)}
      style={{
        flexDirection: 'row',
        padding: GUTTER,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: GUTTER,
              bottom: GUTTER,
              left: GUTTER,
              width: segmentWidth,
              borderRadius: 12,
              borderCurve: 'continuous',
              backgroundColor: colors.textPrimary,
            },
            indicatorStyle,
          ]}
        />
      ) : null}

      {segments.map((segment, index) => {
        const active = index === activeIndex;
        return (
          <Pressable
            key={segment.label}
            onPress={() => onChange(index)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              paddingVertical: 11,
            }}
          >
            <Text
              style={{
                color: active ? colors.textOnLight : colors.textPrimary,
                fontSize: 15,
                fontWeight: '700',
                letterSpacing: 0.3,
              }}
            >
              {segment.label}
            </Text>
            <View
              style={{
                minWidth: 20,
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: 999,
                alignItems: 'center',
                backgroundColor: active ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <Text
                style={{
                  color: active ? colors.textOnLight : colors.textSecondary,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {segment.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
