import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../../assets/logo.jpg');

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#000000', paddingHorizontal: 16 }}>
      {/* Logo — visible immediately, centred */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={logo}
          contentFit="contain"
          style={{ width: 240, height: 240 }}
        />
      </View>

      {/* Buttons — rise up from the bottom, staggered */}
      <View style={{ gap: 8, paddingBottom: insets.bottom + 16 }}>
        <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
          <Link href="/login" asChild>
            <Pressable>
              <LinearGradient
                colors={['#FFFFFF', '#CFCFCF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 48,
                  borderRadius: 14,
                  borderCurve: 'continuous',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#000000', fontSize: 17, fontWeight: '600' }}>
                  Prijavi se
                </Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(320).duration(600).springify()}>
          <Link href="/register" asChild>
            <Pressable
              style={{
                height: 48,
                borderRadius: 14,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: '#3A3A3A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600' }}>
                Registriraj se
              </Text>
            </Pressable>
          </Link>
        </Animated.View>
      </View>
    </View>
  );
}
