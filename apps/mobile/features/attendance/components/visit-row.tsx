import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { formatVisitDate } from '@/features/attendance/data/visits';

type Props = {
  date: string;
  time: string;
};

export function VisitRow({ date, time }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
      }}
    >
      <View style={{ gap: 2 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '600' }}>
          {formatVisitDate(date)}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{date.slice(0, 4)}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
        <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>{time}</Text>
      </View>
    </View>
  );
}
