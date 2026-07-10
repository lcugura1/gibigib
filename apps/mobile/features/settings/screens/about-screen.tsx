import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Linking, Text, View } from 'react-native';
import { SubScreen } from '@/features/settings/components/sub-screen';
import { colors } from '@/shared/theme/colors';
import { SettingsCard } from '@/features/settings/components/settings-card';
import { SettingsRow } from '@/features/settings/components/settings-row';

const version = Constants.expoConfig?.version ?? '1.0.0';

export function AboutScreen() {
  return (
    <SubScreen title="O aplikaciji">
      <View style={{ alignItems: 'center', gap: 6, marginTop: 4 }}>
        <Image
          source={require('../../../assets/logo.jpg')}
          contentFit="contain"
          style={{ width: 168, height: 168 }}
        />
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Verzija {version}</Text>
      </View>

      <SettingsCard>
        <SettingsRow
          icon="document-text-outline"
          label="Uvjeti korištenja"
          external
          onPress={() => Linking.openURL('https://gibigib.com/uvjeti-koristenja')}
        />
        <SettingsRow
          icon="shield-checkmark-outline"
          label="Politika privatnosti"
          external
          onPress={() => Linking.openURL('https://gibigib.com/politika-privatnosti')}
        />
        <SettingsRow
          icon="star-outline"
          label="Ocijeni aplikaciju"
          external
          onPress={() => Linking.openURL('https://gibigib.com')}
        />
      </SettingsCard>

      <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
        © 2026 GibiGib. Sva prava pridržana.
      </Text>
    </SubScreen>
  );
}
