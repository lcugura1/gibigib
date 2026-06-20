import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/shared/theme/colors";
import {
  MONTHS_HR,
  WEEKDAYS_HR,
  buildMonthGrid,
  tagStats,
  toISODate,
  visitsByDayInMonth,
} from "@/features/attendance/data/visits";
import { useAttendance } from "@/features/attendance/context/attendance";

const COLUMNS = 7;
const COLUMN_WIDTH = `${100 / COLUMNS}%` as const;
const SHIFT = 16;

export function AttendanceCalendar() {
  const today = new Date();
  const { visits, selectDate } = useAttendance();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildMonthGrid(year, month);
  const monthVisits = visitsByDayInMonth(visits, year, month);
  const tags = tagStats(visits);
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

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
    <LinearGradient
      colors={[colors.cardLightGradientFrom, colors.cardLightGradientTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        borderCurve: "continuous",
        padding: 20,
        gap: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => changeMonth(-1)}
          hitSlop={8}
          style={{ padding: 4 }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textOnLight}
          />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: colors.textOnLight,
            fontSize: 18,
            fontWeight: "700",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {MONTHS_HR[month]} {year}
        </Text>
        <Pressable
          onPress={() => changeMonth(1)}
          hitSlop={8}
          style={{ padding: 4 }}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textOnLight}
          />
        </Pressable>
      </View>

      <Animated.View style={[{ gap: 16 }, gridStyle]}>
        <View style={{ flexDirection: "row" }}>
          {WEEKDAYS_HR.map((weekday) => (
            <Text
              key={weekday}
              style={{
                width: COLUMN_WIDTH,
                textAlign: "center",
                color: colors.textOnLight,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {weekday}
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8 }}>
          {cells.map((day, index) => {
            if (day === null) {
              return (
                <View
                  key={`blank-${index}`}
                  style={{ width: COLUMN_WIDTH, height: 38 }}
                />
              );
            }

            const visit = monthVisits.get(day);
            const visited = visit != null;
            const dayColor = visit?.color ?? colors.textOnLightSecondary;
            const isToday = isCurrentMonth && today.getDate() === day;

            const chip = (
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: visited ? dayColor : "transparent",
                  borderWidth: isToday ? 2 : 0,
                  borderColor: colors.textOnLight,
                }}
              >
                <Text
                  style={{
                    color: colors.textOnLight,
                    fontSize: 15,
                    fontWeight: visited || isToday ? "700" : "400",
                  }}
                >
                  {day}
                </Text>
              </View>
            );

            return (
              <View
                key={day}
                style={{ width: COLUMN_WIDTH, alignItems: "center" }}
              >
                {visited ? (
                  <Pressable
                    onPress={() => selectDate(toISODate(year, month, day))}
                  >
                    {chip}
                  </Pressable>
                ) : (
                  chip
                )}
              </View>
            );
          })}
        </View>
      </Animated.View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 14,
          marginTop: 4,
        }}
      >
        {tags.map((tag) => (
          <LegendItem key={tag.label} color={tag.color} label={tag.label} />
        ))}
        <LegendItem ring label="Danas" />
      </View>
    </LinearGradient>
  );
}

function LegendItem({
  color,
  label,
  ring = false,
}: {
  color?: string;
  label: string;
  ring?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          backgroundColor: ring ? "transparent" : color,
          borderWidth: ring ? 2 : 0,
          borderColor: colors.textOnLight,
        }}
      />
      <Text style={{ color: colors.textOnLight, fontSize: 13 }}>{label}</Text>
    </View>
  );
}
