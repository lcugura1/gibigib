import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTrainer } from '@/features/trainers/data/trainers';
import { BackButton } from '@/shared/components/back-button';
import { ScreenGradient } from '@/shared/components/screen-gradient';
import { SectionLabel } from '@/shared/components/section-label';
import { colors } from '@/shared/theme/colors';

export function TrainerProfileScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const trainer = getTrainer(id);

  if (!trainer) return null;

  const sendEmail = () => {
    const subject = encodeURIComponent('Upit za prilagođeni trening');
    Linking.openURL(`mailto:${trainer.email}?subject=${subject}`);
  };

  const openInstagram = () => {
    if (trainer.instagram) {
      Linking.openURL(`https://instagram.com/${trainer.instagram}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenGradient />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        <View style={{ alignItems: 'center', gap: 14 }}>
          <Image
            source={{ uri: trainer.photo }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
            contentFit="cover"
            transition={200}
          />
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: '700' }}>
              {trainer.name}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{trainer.role}</Text>
          </View>
          {trainer.instagram ? (
            <Pressable
              onPress={openInstagram}
              hitSlop={8}
              accessibilityRole="link"
              accessibilityLabel={`Instagram profil trenera ${trainer.name}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Ionicons name="logo-instagram" size={18} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                @{trainer.instagram}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={{ gap: 10 }}>
          <SectionLabel>Specijalnosti</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {trainer.specialties.map((specialty) => (
              <View
                key={specialty}
                style={{
                  backgroundColor: 'rgba(197,242,61,0.1)',
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                }}
              >
                <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '600' }}>
                  {specialty}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <SectionLabel>Iskustvo i certifikati</SectionLabel>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 18,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              padding: 16,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="barbell-outline" size={20} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                {trainer.experienceYears} godina iskustva
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="ribbon-outline" size={20} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: 15, flex: 1 }}>
                {trainer.certifications.join(' · ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <SectionLabel>O treneru</SectionLabel>
          <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 22 }}>
            {trainer.bio}
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Pressable
            onPress={sendEmail}
            accessibilityRole="button"
            accessibilityLabel={`Pošalji email treneru ${trainer.name}`}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 16,
              borderRadius: 18,
              borderCurve: 'continuous',
              backgroundColor: colors.buttonPrimaryFrom,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Ionicons name="mail-outline" size={20} color={colors.buttonPrimaryText} />
            <Text style={{ color: colors.buttonPrimaryText, fontSize: 16, fontWeight: '700' }}>
              Pošalji email
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 16,
              borderRadius: 18,
              borderCurve: 'continuous',
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              opacity: 0.6,
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>
              Rezerviraj termin
            </Text>
            <View
              style={{
                backgroundColor: colors.surfaceBorder,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}
              >
                USKORO
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
