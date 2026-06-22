import { Linking, View } from 'react-native';
import { socials } from '@/features/info/data/gym';
import { InfoCard } from '@/features/info/components/info-card';
import { InfoRow } from '@/features/info/components/info-row';

export function SocialCard() {
  return (
    <InfoCard light>
      <View style={{ gap: 16 }}>
        {socials.map((social) => (
          <InfoRow
            key={social.url}
            light
            icon={social.icon}
            label={social.label}
            value={social.value}
            onPress={() => Linking.openURL(social.url)}
          />
        ))}
      </View>
    </InfoCard>
  );
}
