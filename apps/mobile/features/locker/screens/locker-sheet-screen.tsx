import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LockerDto } from '@gibigib/types';
import { fetchLockers } from '@/features/locker/services/locker';
import { colors } from '@/shared/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SCREEN_HEIGHT = Dimensions.get('window').height;
const POLL_INTERVAL_MS = 2000;

export function LockerSheetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [lockers, setLockers] = useState<LockerDto[]>([]);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) });
    backdropOpacity.value = withTiming(1, { duration: 280 });
  }, [backdropOpacity, translateY]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchLockers();
        if (active) setLockers(data);
      } catch {}
    };

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const dismiss = () => {
    backdropOpacity.value = withTiming(0, { duration: 260 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 300, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) {
          scheduleOnRN(router.back);
        }
      },
    );
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const blockStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <AnimatedPressable
        style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }, backdropStyle]}
        onPress={dismiss}
        accessibilityRole="button"
        accessibilityLabel="Zatvori"
      />

      <Animated.View
        style={[
          {
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderCurve: 'continuous',
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: insets.bottom + 16,
            gap: 16,
          },
          blockStyle,
        ]}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 5,
            borderRadius: 3,
            backgroundColor: '#48484A',
            marginBottom: 2,
          }}
        />

        <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
          Ormarići
        </Text>

        {lockers.map((locker) => {
          const locked = locker.status === 'LOCKED';
          return (
            <View
              key={locker.number}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: 18,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
              }}
            >
              <Ionicons
                name={locked ? 'lock-closed-outline' : 'lock-open-outline'}
                size={22}
                color={locked ? colors.danger : colors.accent}
              />
              <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>
                Ormarić {locker.number}
              </Text>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: locked ? 'rgba(239,68,68,0.16)' : 'rgba(197,242,61,0.16)',
                }}
              >
                <Text
                  style={{
                    color: locked ? colors.danger : colors.accent,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  {locked ? 'Zaključan' : 'Otključan'}
                </Text>
              </View>
            </View>
          );
        })}

        <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
          Prisloni telefon na NFC oznaku na ormariću za zaključavanje ili otključavanje.
        </Text>
      </Animated.View>
    </View>
  );
}
