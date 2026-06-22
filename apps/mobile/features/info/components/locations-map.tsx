import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { locations } from '@/features/info/data/gym';

const markers = locations.map((location) => ({
  title: location.name,
  coordinates: location.coordinates,
}));

const cameraPosition = {
  coordinates: { latitude: 46.05, longitude: 16.14 },
  zoom: 7.4,
};

export function LocationsMap() {
  return (
    <View
      style={{
        height: 220,
        borderRadius: 24,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
    >
      {Platform.OS === 'ios' ? (
        <AppleMaps.View style={{ flex: 1 }} markers={markers} cameraPosition={cameraPosition} />
      ) : (
        <GoogleMaps.View style={{ flex: 1 }} markers={markers} cameraPosition={cameraPosition} />
      )}
    </View>
  );
}
