import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';
import {
  MONTHS_HR,
  WEEKDAYS_HR,
  buildMonthGrid,
  visitedDaysInMonth,
} from '@/features/attendance/data/visits';

const COLUMNS = 7;
const COLUMN_WIDTH = `${100 / COLUMNS}%` as const;
const SHIFT = 16;

export function AttendanceCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildMonthGrid(year, month);
  const visitedDays = visitedDaysInMonth(year, month);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const opacity = useSharedValue(1);
  const offset = useSharedValue(0);

  const gridStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: offset.value }],
  }));

  const applyMonth = (time: number) => setViewDate(new Date(time));

  const changeMonth = (delta: number) => {
    const nextTime = new Date(year, month + delta, 1).getTime();
    offset.value = withTiming(delta * -SHIFT, { duration: 140 });
    opacity.value = withTiming(0, { duration: 140 }, (finished) => {
      if (finished) {
        runOnJS(applyMonth)(nextTime);
        offset.value = delta * SHIFT;
        offset.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });
      }
    });
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: 20,
        gap: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => changeMonth(-1)} hitSlop={8} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {MONTHS_HR[month]} {year}
        </Text>
        <Pressable onPress={() => changeMonth(1)} hitSlop={8} style={{ padding: 4 }}>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <Animated.View style={[{ gap: 16 }, gridStyle]}>
        <View style={{ flexDirection: 'row' }}>
          {WEEKDAYS_HR.map((weekday) => (
            <Text
              key={weekday}
              style={{
                width: COLUMN_WIDTH,
                textAlign: 'center',
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {weekday}
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 }}>
          {cells.map((day, index) => {
            if (day === null) {
              return <View key={`blank-${index}`} style={{ width: COLUMN_WIDTH, height: 38 }} />;
            }

            const visited = visitedDays.has(day);
            const isToday = isCurrentMonth && today.getDate() === day;

            return (
              <View key={day} style={{ width: COLUMN_WIDTH, alignItems: 'center' }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: visited ? colors.textPrimary : 'transparent',
                    borderWidth: isToday ? 2 : 0,
                    borderColor: colors.accent,
                  }}
                >
                  <Text
                    style={{
                      color: visited ? colors.textOnLight : colors.textPrimary,
                      fontSize: 15,
                      fontWeight: visited || isToday ? '700' : '400',
                    }}
                  >
                    {day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Animated.View>

      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
        <LegendItem filled label="Posjećeno" />
        <LegendItem label="Danas" />
      </View>
    </View>
  );
}

function LegendItem({ filled = false, label }: { filled?: boolean; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          backgroundColor: filled ? colors.textPrimary : 'transparent',
          borderWidth: filled ? 0 : 2,
          borderColor: colors.accent,
        }}
      />
      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{label}</Text>
    </View>
  );
}
