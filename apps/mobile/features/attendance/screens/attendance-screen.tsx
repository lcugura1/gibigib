import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { colors } from "@/shared/theme/colors";
import { MonthGoalCard } from "@/features/attendance/components/month-goal-card";
import { TotalTrendCard } from "@/features/attendance/components/total-trend-card";
import { MonthlyGoalSheet } from "@/features/attendance/components/monthly-goal-sheet";
import { AttendanceCalendar } from "@/features/attendance/components/attendance-calendar";
import { useAttendance } from "@/features/attendance/context/attendance";
import {
  visitedDaysInMonth,
  tagStats,
  cumulativeTrend,
} from "@/features/attendance/data/visits";
import { DayDetailSheet } from "@/features/attendance/components/day-detail-sheet";
import { TrainingChart } from "@/features/attendance/components/training-chart";

export function AttendanceScreen() {
  const { visits, status, errorMessage, goal } = useAttendance();
  const [goalOpen, setGoalOpen] = useState(false);
  const now = new Date();
  const thisMonth = visitedDaysInMonth(
    visits,
    now.getFullYear(),
    now.getMonth(),
  ).size;
  const tags = tagStats(visits);
  const trend = cumulativeTrend(visits);
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 30,
            fontWeight: "800",
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          Evidencija
        </Text>

        {status === "loading" ? (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Učitavanje…
          </Text>
        ) : null}
        {errorMessage ? (
          <Text
            style={{ color: colors.danger, fontSize: 13, textAlign: "center" }}
          >
            {errorMessage}
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <MonthGoalCard
            count={thisMonth}
            goal={goal}
            onPress={() => setGoalOpen(true)}
          />
          <TotalTrendCard total={visits.length} trend={trend} />
        </View>
        <AttendanceCalendar />

        <TrainingChart tags={tags} />
      </ScrollView>
      <DayDetailSheet />
      <MonthlyGoalSheet visible={goalOpen} onClose={() => setGoalOpen(false)} />
    </>
  );
}
