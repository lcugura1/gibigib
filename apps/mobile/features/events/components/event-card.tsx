import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { GymEvent } from '@/features/events/data/events';

export function EventCard({ event }: { event: GymEvent }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        overflow: 'hidden',
      }}
    >
      <Image source={event.image} contentFit="cover" style={{ width: '100%', height: 190 }} />

      <View style={{ padding: 16, gap: 10 }}>
        <Text
          style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 0.3 }}
        >
          {event.title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{event.date}</Text>
        </View>

        <Text
          style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 21 }}
          numberOfLines={2}
        >
          {event.description}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '700' }}>
            Pročitaj više
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.textPrimary} />
        </View>
      </View>
    </View>
  );
}
