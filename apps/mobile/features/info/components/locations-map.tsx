import { requireOptionalNativeModule } from 'expo';
import { Platform, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { Coordinates, locations } from '@/features/info/data/gym';

const markers = locations.map((location) => ({
  title: location.name,
  coordinates: location.coordinates,
}));

type CameraPosition = { coordinates: Coordinates; zoom: number };

const defaultCamera: CameraPosition = {
  coordinates: { latitude: 46.05, longitude: 16.14 },
  zoom: 7.4,
};

// expo-maps eagerly reads its native module at import time and throws when it
// isn't built in (Expo Go), taking the whole route down. Load it only when the
// native module is actually present.
const maps = requireOptionalNativeModule('ExpoMaps') ? require('expo-maps') : null;
const AppleMaps = maps?.AppleMaps;
const GoogleMaps = maps?.GoogleMaps;

export function LocationsMap({
  cameraPosition = defaultCamera,
}: {
  cameraPosition?: CameraPosition;
}) {
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
      {AppleMaps && GoogleMaps ? (
        Platform.OS === 'ios' ? (
          <AppleMaps.View style={{ flex: 1 }} markers={markers} cameraPosition={cameraPosition} />
        ) : (
          <GoogleMaps.View style={{ flex: 1 }} markers={markers} cameraPosition={cameraPosition} />
        )
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
            Karta trenutno nije dostupna
          </Text>
        </View>
      )}
    </View>
  );
}
