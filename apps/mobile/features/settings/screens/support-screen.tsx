import { Linking, Text, View } from 'react-native';
import { SubScreen } from '@/features/settings/components/sub-screen';
import { SectionLabel } from '@/shared/components/section-label';
import { colors } from '@/shared/theme/colors';
import { SettingsCard } from '@/features/settings/components/settings-card';
import { SettingsRow } from '@/features/settings/components/settings-row';
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_LABEL,
  SUPPORT_WEB,
  faq,
} from '@/features/settings/data/support';

export function SupportScreen() {
  return (
    <SubScreen title="Pomoć i podrška">
      <View style={{ gap: 10 }}>
        <SectionLabel>Kontakt</SectionLabel>
        <SettingsCard>
          <SettingsRow
            icon="mail-outline"
            label="E-pošta"
            value={SUPPORT_EMAIL}
            external
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          />
          <SettingsRow
            icon="call-outline"
            label="Telefon"
            value={SUPPORT_PHONE_LABEL}
            external
            onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`)}
          />
          <SettingsRow
            icon="globe-outline"
            label="Web"
            value="gibigib.com"
            external
            onPress={() => Linking.openURL(SUPPORT_WEB)}
          />
        </SettingsCard>
      </View>

      <View style={{ gap: 10 }}>
        <SectionLabel>Česta pitanja</SectionLabel>
        <View style={{ gap: 12 }}>
          {faq.map((item) => (
            <View
              key={item.question}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
                padding: 16,
                gap: 6,
              }}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '700' }}>
                {item.question}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
                {item.answer}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SubScreen>
  );
}
