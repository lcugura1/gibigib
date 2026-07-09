import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';
import { SectionLabel } from '@/shared/components/section-label';
import { cities, cityCameras, locations } from '@/features/info/data/gym';
import { CityTabs } from '@/features/info/components/city-tabs';
import { GymIntro } from '@/features/info/components/gym-intro';
import { LocationCard } from '@/features/info/components/location-card';
import { LocationsMap } from '@/features/info/components/locations-map';
import { SocialCard } from '@/features/info/components/social-card';

export function InfoScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollViewOffset(scrollRef);

  const [cityIndex, setCityIndex] = useState(0);
  const activeCity = cities[cityIndex];
  const cityLocations = locations.filter((location) => location.city === activeCity);

  const introStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.value, [0, 120], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(offset.value, [0, 120], [0, -12], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <Animated.ScrollView
      ref={scrollRef}
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
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 30,
          fontWeight: '800',
          letterSpacing: 0.5,
          textAlign: 'center',
        }}
      >
        O Gibiju
      </Text>

      <Animated.View style={introStyle}>
        <GymIntro />
      </Animated.View>

      <View style={{ gap: 12 }}>
        <SectionLabel>Lokacije</SectionLabel>
        <CityTabs
          segments={cities.map((city) => ({
            label: city,
            count: locations.filter((location) => location.city === city).length,
          }))}
          activeIndex={cityIndex}
          onChange={setCityIndex}
        />
        <LocationsMap cameraPosition={cityCameras[cityIndex]} />
        <Animated.View key={activeCity} entering={FadeIn.duration(200)} style={{ gap: 12 }}>
          {cityLocations.map((location) => (
            <LocationCard key={location.name} location={location} />
          ))}
        </Animated.View>
      </View>

      <View style={{ gap: 12 }}>
        <SectionLabel>Društvene mreže</SectionLabel>
        <SocialCard />
      </View>
    </Animated.ScrollView>
  );
}
