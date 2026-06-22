import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { gym } from '@/features/info/data/gym';
import { InfoCard } from '@/features/info/components/info-card';

export function GymHero() {
  return (
    <InfoCard style={{ padding: 24 }}>
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 34,
          fontWeight: '900',
          letterSpacing: 1,
        }}
      >
        {gym.name}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginTop: 4,
        }}
      >
        {gym.tagline}
      </Text>
      <View
        style={{
          width: 48,
          height: 3,
          borderRadius: 2,
          backgroundColor: colors.accent,
          marginVertical: 18,
        }}
      />
      <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 22 }}>
        {gym.description}
      </Text>
    </InfoCard>
  );
}
