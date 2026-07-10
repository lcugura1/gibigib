import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { GlassIconButton } from '@/features/home/components/glass-icon-button';

type Props = {
  avatarUrl: string | null;
  onPress: () => void;
};

const SIZE = 44;

export function AvatarButton({ avatarUrl, onPress }: Props) {
  if (!avatarUrl) {
    return <GlassIconButton name="person-outline" onPress={onPress} accessibilityLabel="Postavke" />;
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Postavke"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: 1,
          borderColor: colors.surfaceBorder,
        }}
        contentFit="cover"
        transition={200}
      />
    </Pressable>
  );
}
