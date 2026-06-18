import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  value: number | string;
  label: string;
};

export function StatCard({ value, label }: Props) {
  return (
    <LinearGradient
      colors={[colors.cardLightGradientFrom, colors.cardLightGradientTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        borderRadius: 24,
        borderCurve: 'continuous',
        padding: 20,
        gap: 6,
      }}
    >
      <Text style={{ color: colors.textOnLight, fontSize: 40, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: colors.textOnLightSecondary, fontSize: 14 }}>{label}</Text>
    </LinearGradient>
  );
}
