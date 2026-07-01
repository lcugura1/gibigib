import { Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';
import { SectionLabel } from '@/shared/components/section-label';
import { locations } from '@/features/info/data/gym';
import { GymIntro } from '@/features/info/components/gym-intro';
import { LocationCard } from '@/features/info/components/location-card';
import { LocationsMap } from '@/features/info/components/locations-map';
import { SocialCard } from '@/features/info/components/social-card';

export function InfoScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollViewOffset(scrollRef);

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
        <LocationsMap />
        {locations.map((location, index) => (
          <LocationCard key={location.name} location={location} light={index % 2 === 1} />
        ))}
      </View>

      <View style={{ gap: 12 }}>
        <SectionLabel>Društvene mreže</SectionLabel>
        <SocialCard />
      </View>
    </Animated.ScrollView>
  );
}
