import { ScrollView, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { SectionLabel } from '@/shared/components/section-label';
import { locations } from '@/features/info/data/gym';
import { GymHero } from '@/features/info/components/gym-hero';
import { LocationCard } from '@/features/info/components/location-card';
import { SocialCard } from '@/features/info/components/social-card';

export function InfoScreen() {
  return (
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
        <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Gdje nas pronaći</Text>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 34,
            fontWeight: '800',
            letterSpacing: 1,
          }}
        >
          INFORMACIJE
        </Text>
      </View>

      <GymHero />

      <View style={{ gap: 12 }}>
        <SectionLabel>Lokacije</SectionLabel>
        {locations.map((location, index) => (
          <LocationCard key={location.name} location={location} light={index % 2 === 0} />
        ))}
      </View>

      <View style={{ gap: 12 }}>
        <SectionLabel>Društvene mreže</SectionLabel>
        <SocialCard />
      </View>
    </ScrollView>
  );
}
