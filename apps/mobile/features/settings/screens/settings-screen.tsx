import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Switch, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/context/auth';
import { colors } from '@/shared/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  type: 'link' | 'toggle';
};

type Group = {
  title: string;
  rows: Row[];
};

const groups: Group[] = [
  {
    title: 'Račun',
    rows: [
      { icon: 'person-outline', label: 'Uredi profil', type: 'link' },
      { icon: 'card-outline', label: 'Način plaćanja', type: 'link' },
    ],
  },
  {
    title: 'Aplikacija',
    rows: [
      { icon: 'notifications-outline', label: 'Obavijesti', type: 'toggle' },
      { icon: 'language-outline', label: 'Jezik', type: 'link' },
    ],
  },
  {
    title: 'Podrška',
    rows: [
      { icon: 'help-circle-outline', label: 'Pomoć i podrška', type: 'link' },
      { icon: 'information-circle-outline', label: 'O aplikaciji', type: 'link' },
    ],
  },
];

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) });
    backdropOpacity.value = withTiming(1, { duration: 280 });
  }, [backdropOpacity, translateY]);

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
            gap: 20,
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

        <View
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
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#1F1F22',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={24} color={colors.textPrimary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '600' }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{user?.email}</Text>
          </View>
        </View>

        {groups.map((group) => (
          <View key={group.title} style={{ gap: 8 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginLeft: 4,
              }}
            >
              {group.title}
            </Text>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 18,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
                overflow: 'hidden',
              }}
            >
              {group.rows.map((row, index) => (
                <View key={row.label}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      paddingHorizontal: 16,
                      paddingVertical: 13,
                    }}
                  >
                    <Ionicons name={row.icon} size={20} color={colors.textPrimary} />
                    <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 16 }}>
                      {row.label}
                    </Text>
                    {row.type === 'toggle' ? (
                      <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ true: colors.accent, false: '#39393D' }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#39393D"
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    )}
                  </View>
                  {index < group.rows.length - 1 ? (
                    <View
                      style={{ height: 1, backgroundColor: colors.surfaceBorder, marginLeft: 50 }}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}

        <Pressable
          onPress={signOut}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: 18,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.surfaceBorder,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '600' }}>Odjava</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
