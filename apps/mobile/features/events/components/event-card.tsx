import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { GymEvent } from '@/features/events/data/events';

export function EventCard({ event }: { event: GymEvent }) {
  return (
    <View
      style={{
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        overflow: 'hidden',
      }}
    >
      <View>
        <Image source={event.image} contentFit="cover" style={{ width: '100%', height: 190 }} />
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96 }}
        />

        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
          }}
        >
          <Ionicons name="calendar-outline" size={13} color={colors.accent} />
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 12.5,
              fontWeight: '600',
              letterSpacing: 0.2,
            }}
          >
            {event.date}
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={[colors.cardGradientFrom, colors.cardGradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16, gap: 10 }}
      >
        <Text
          style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 0.3 }}
        >
          {event.title}
        </Text>

        <Text
          style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 21 }}
          numberOfLines={2}
        >
          {event.description}
        </Text>

        <View style={{ height: 1, backgroundColor: colors.cardBorder, marginTop: 4 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '700' }}>
            Pročitaj više
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textPrimary} />
        </View>
      </LinearGradient>
    </View>
  );
}
