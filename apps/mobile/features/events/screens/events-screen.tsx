import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';
import { events } from '@/features/events/data/events';
import { EventCard } from '@/features/events/components/event-card';
import { statusBarInset } from '@/shared/navigation/status-bar-inset';

export function EventsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="never"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: statusBarInset + 8,
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
    </View>
  );
}
