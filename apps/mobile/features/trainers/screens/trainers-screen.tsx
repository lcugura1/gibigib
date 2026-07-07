import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { TrainerListItem } from '@/features/trainers/components/trainer-list-item';
import { trainers } from '@/features/trainers/data/trainers';
import { ScrollScreen } from '@/shared/components/scroll-screen';
import { colors } from '@/shared/theme/colors';

export function TrainersScreen() {
  const router = useRouter();

  return (
    <ScrollScreen contentContainerStyle={{ gap: 20 }}>
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
    </ScrollScreen>
  );
}
