import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

export function MembershipCtaCard() {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: 24,
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Ionicons name="qr-code-outline" size={40} color={colors.textSecondary} />
      <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700' }}>
        Nemaš aktivnu članarinu
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 15,
          lineHeight: 22,
          textAlign: 'center',
        }}
      >
        Odaberi jedan od planova u nastavku i aktiviraj svoju digitalnu ulaznicu.
      </Text>
    </View>
  );
}
