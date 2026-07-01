import { ScrollView, Text, View } from "react-native";
import { colors } from "@/shared/theme/colors";
import { StatCard } from "@/features/attendance/components/stat-card";
import { AttendanceCalendar } from "@/features/attendance/components/attendance-calendar";
import { SectionLabel } from "@/shared/components/section-label";
import { useAttendance } from "@/features/attendance/context/attendance";
import {
  visitedDaysInMonth,
  tagStats,
} from "@/features/attendance/data/visits";
import { DayDetailSheet } from "@/features/attendance/components/day-detail-sheet";
import { TrainingChart } from "@/features/attendance/components/training-chart";

export function AttendanceScreen() {
  const { visits } = useAttendance();
  const now = new Date();
  const thisMonth = visitedDaysInMonth(
    visits,
    now.getFullYear(),
    now.getMonth(),
  ).size;
  const tags = tagStats(visits);
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

        <View style={{ flexDirection: "row", gap: 12 }}>
          <StatCard value={thisMonth} label="Ovaj mjesec" />
          <StatCard value={visits.length} label="Ukupno" />
        </View>
        <AttendanceCalendar />

        <View style={{ gap: 12 }}>
          <SectionLabel>Najčešći treninzi</SectionLabel>
          <TrainingChart tags={tags} />
        </View>
      </ScrollView>
      <DayDetailSheet />
    </>
  );
}
