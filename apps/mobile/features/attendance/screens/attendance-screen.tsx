import { ScrollView, Text, View } from "react-native";
import { colors } from "@/shared/theme/colors";
import { StatCard } from "@/features/attendance/components/stat-card";
import { AttendanceCalendar } from "@/features/attendance/components/attendance-calendar";
import { SectionLabel } from '@/shared/components/section-label';
import { VisitRow } from '@/features/attendance/components/visit-row';
import { useAttendance } from '@/features/attendance/context/attendance';
import { visitedDaysInMonth } from '@/features/attendance/data/visits';
import { DayDetailSheet } from '@/features/attendance/components/day-detail-sheet';


export function AttendanceScreen() {
  const { visits } = useAttendance();
  const now = new Date();
  const thisMonth = visitedDaysInMonth(visits, now.getFullYear(), now.getMonth()).size;

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
      <View style={{ gap: 4 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
          Tvoji dolasci
        </Text>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 34,
            fontWeight: "800",
            letterSpacing: 1,
          }}
        >
          EVIDENCIJA
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatCard value={thisMonth} label="Ovaj mjesec" />
        <StatCard value={visits.length} label="Ukupno" />
      </View>
      <AttendanceCalendar />

       <View style={{ gap: 12 }}>
        <SectionLabel>Povijest dolazaka</SectionLabel>
        {[...visits]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((visit) => (
            <VisitRow key={visit.id} date={visit.date} time={visit.time} />
          ))}
      </View>
      </ScrollView>
      <DayDetailSheet />
    </>
  );
}
