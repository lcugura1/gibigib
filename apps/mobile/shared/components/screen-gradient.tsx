import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export function ScreenGradient() {
  return (
    <LinearGradient
      colors={['#1A1B1F', '#0C0C0E', '#000000']}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
