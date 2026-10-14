import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

const wallet =
  process.env.EXPO_OS === 'android'
    ? { label: 'Google Pay', icon: 'logo-google' as const }
    : { label: 'Apple Pay', icon: 'logo-apple' as const };

function formatEur(amount: number) {
  return `${amount.toFixed(2).replace('.', ',')} €`;
}

type Props = {
  amount: number;
  onPay: () => void;
  submitting?: boolean;
};

// Stripe's payment sheet offers the card and wallet options itself, so this only starts it.
export function PaymentSection({ amount, onPay, submitting = false }: Props) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700' }}>Plaćanje</Text>

      <View
        style={{
          gap: 10,
          padding: 16,
          borderRadius: 16,
          borderCurve: 'continuous',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.surfaceBorder,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="card-outline" size={22} color={colors.textPrimary} />
          <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 15 }}>Kreditna / debitna kartica</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name={wallet.icon} size={22} color={colors.textPrimary} />
          <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 15 }}>{wallet.label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textSecondary} />
          <Text style={{ flex: 1, color: colors.textSecondary, fontSize: 13 }}>
            Sigurno plaćanje preko Stripea. Podatke o kartici ne spremamo.
          </Text>
        </View>
      </View>

      <Pressable onPress={onPay} disabled={submitting} style={{ marginTop: 4 }}>
        <LinearGradient
          colors={[colors.buttonPrimaryFrom, colors.buttonPrimaryTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 52,
            borderRadius: 16,
            borderCurve: 'continuous',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          <Text style={{ color: colors.buttonPrimaryText, fontSize: 17, fontWeight: '700' }}>
            {submitting ? 'Obrada...' : `Plati ${formatEur(amount)}`}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
