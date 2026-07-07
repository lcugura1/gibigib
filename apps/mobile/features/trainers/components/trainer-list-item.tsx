import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import type { Trainer } from '@/features/trainers/types/trainer';
import { colors } from '@/shared/theme/colors';

type Props = {
  trainer: Trainer;
  onPress?: () => void;
};

export function TrainerListItem({ trainer, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${trainer.name}, ${trainer.role}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Image
        source={{ uri: trainer.photo }}
        style={{ width: 56, height: 56, borderRadius: 28 }}
        contentFit="cover"
        transition={200}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: '600' }}>
          {trainer.name}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{trainer.role}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}
