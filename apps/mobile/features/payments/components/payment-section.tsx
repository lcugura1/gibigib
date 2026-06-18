import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Method = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const wallet: Method =
  process.env.EXPO_OS === 'android'
    ? { id: 'gpay', label: 'Google Pay', icon: 'logo-google' }
    : { id: 'applepay', label: 'Apple Pay', icon: 'logo-apple' };

const METHODS: Method[] = [
  { id: 'card', label: 'Kreditna / debitna kartica', icon: 'card-outline' },
  wallet,
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
];

function formatEur(amount: number) {
  return `${amount.toFixed(2).replace('.', ',')} €`;
}

type Props = {
  amount: number;
  onPay: (methodId: string) => void;
  submitting?: boolean;
};

export function PaymentSection({ amount, onPay, submitting = false }: Props) {
  const [selected, setSelected] = useState(METHODS[0].id);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700' }}>Način plaćanja</Text>

      <View style={{ gap: 10 }}>
        {METHODS.map((method) => {
          const active = selected === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => setSelected(method.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                borderRadius: 16,
                borderCurve: 'continuous',
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: active ? colors.accent : colors.surfaceBorder,
              }}
            >
              <Ionicons name={method.icon} size={22} color={colors.textPrimary} />
              <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 15 }}>{method.label}</Text>
              <Ionicons
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={active ? colors.accent : colors.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => onPay(selected)} disabled={submitting} style={{ marginTop: 4 }}>
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
