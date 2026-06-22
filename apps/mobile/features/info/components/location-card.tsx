import { Linking, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { SectionLabel } from '@/shared/components/section-label';
import { GymLocation } from '@/features/info/data/gym';
import { InfoCard } from '@/features/info/components/info-card';
import { InfoRow } from '@/features/info/components/info-row';

export function LocationCard({
  location,
  light = false,
}: {
  location: GymLocation;
  light?: boolean;
}) {
  const fg = light ? colors.textOnLight : colors.textPrimary;
  const muted = light ? colors.textOnLightSecondary : colors.textSecondary;
  const divider = light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';

  const openMaps = () =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`,
    );

  return (
    <InfoCard light={light}>
      <View style={{ gap: 18 }}>
        <View style={{ gap: 2 }}>
          <Text style={{ color: fg, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 }}>
            {location.name}
          </Text>
          <Text style={{ color: muted, fontSize: 13 }}>{location.city}</Text>
        </View>

        <View style={{ gap: 16 }}>
          <InfoRow
            light={light}
            icon="location-outline"
            label="Adresa"
            value={location.address}
            onPress={openMaps}
          />
          <InfoRow
            light={light}
            icon="call-outline"
            label="Telefon"
            value={location.phone}
            onPress={() => Linking.openURL(`tel:${location.tel}`)}
          />
          <InfoRow
            light={light}
            icon="mail-outline"
            label="Email"
            value={location.email}
            onPress={() => Linking.openURL(`mailto:${location.email}`)}
          />
        </View>

        <View style={{ height: 1, backgroundColor: divider }} />

        <View style={{ gap: 6 }}>
          <SectionLabel color={muted}>Radno vrijeme</SectionLabel>
          {location.hours.map((entry, index) => (
            <View
              key={entry.day}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: divider,
              }}
            >
              <Text style={{ color: muted, fontSize: 14 }}>{entry.day}</Text>
              <Text style={{ color: fg, fontSize: 14, fontWeight: '700' }}>{entry.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </InfoCard>
  );
}
