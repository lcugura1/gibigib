import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrainerListItem } from '@/features/trainers/components/trainer-list-item';
import { trainers } from '@/features/trainers/data/trainers';
import { BackButton } from '@/shared/components/back-button';
import { ScreenGradient } from '@/shared/components/screen-gradient';
import { colors } from '@/shared/theme/colors';

export function TrainersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenGradient />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700' }}>Treneri</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
            Odaberi trenera za prilagođeni trening 1 na 1
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          {trainers.map((trainer) => (
            <TrainerListItem
              key={trainer.id}
              trainer={trainer}
              onPress={() =>
                router.push({ pathname: '/trainers/[id]', params: { id: trainer.id } })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
