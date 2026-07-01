import { ScrollView, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { events } from '@/features/events/data/events';
import { EventCard } from '@/features/events/components/event-card';

export function EventsScreen() {
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
    </ScrollView>
  );
}
