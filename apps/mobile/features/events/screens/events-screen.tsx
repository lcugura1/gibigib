import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';
import { events } from '@/features/events/data/events';
import { EventCard } from '@/features/events/components/event-card';
import { ScrollEdgeFade, useScrollEdge } from '@/shared/components/scroll-edge-fade';

export function EventsScreen() {
  const { scrollY, onScroll } = useScrollEdge();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
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
          Događaji
        </Text>

        <View style={{ gap: 16 }}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      </Animated.ScrollView>

      <ScrollEdgeFade scrollY={scrollY} insetAdjusted />
    </View>
  );
}
