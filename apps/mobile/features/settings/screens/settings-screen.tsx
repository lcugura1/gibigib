import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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
import { useAuth } from '@/features/auth/context/auth';
import { colors } from '@/shared/theme/colors';
import { SettingsCard } from '@/features/settings/components/settings-card';
import { SettingsRow } from '@/features/settings/components/settings-row';
import { LanguagePicker } from '@/features/settings/components/language-picker';
import { useLanguage } from '@/features/settings/hooks/use-language';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
};

type Group = {
  title: string;
  rows: Row[];
};

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { language, label: languageLabel, changeLanguage } = useLanguage();
  const [languageOpen, setLanguageOpen] = useState(false);
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

  const groups: Group[] = [
    {
      title: 'Račun',
      rows: [
        {
          icon: 'person-outline',
          label: 'Uredi profil',
          onPress: () => router.push('/edit-profile'),
        },
      ],
    },
    {
      title: 'Aplikacija',
      rows: [
        {
          icon: 'language-outline',
          label: 'Jezik',
          value: languageLabel,
          onPress: () => setLanguageOpen(true),
        },
      ],
    },
    {
      title: 'Podrška',
      rows: [
        {
          icon: 'help-circle-outline',
          label: 'Pomoć i podrška',
          onPress: () => router.push('/support'),
        },
        {
          icon: 'information-circle-outline',
          label: 'O aplikaciji',
          onPress: () => router.push('/about'),
        },
      ],
    },
  ];

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

        <Pressable
          onPress={() => router.push('/edit-profile')}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: 18,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.surfaceBorder,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
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
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '600' }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{user?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>

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
            <SettingsCard>
              {group.rows.map((row) => (
                <SettingsRow
                  key={row.label}
                  icon={row.icon}
                  label={row.label}
                  value={row.value}
                  onPress={row.onPress}
                />
              ))}
            </SettingsCard>
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

      {languageOpen ? (
        <LanguagePicker
          current={language}
          onSelect={(code) => {
            changeLanguage(code);
            setLanguageOpen(false);
          }}
          onClose={() => setLanguageOpen(false)}
        />
      ) : null}
    </View>
  );
}
