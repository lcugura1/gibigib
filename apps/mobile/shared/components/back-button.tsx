import { Ionicons } from '@expo/vector-icons';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { colors } from '@/shared/theme/colors';

const SIZE = 44;

type Props = {
  onPress?: () => void;
};

export function BackButton({ onPress }: Props) {
  const router = useRouter();
  const handlePress = () => (onPress ? onPress() : router.back());
  const icon = <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />;

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        isInteractive
        style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignSelf: 'flex-start' }}
      >
        <Pressable
          onPress={handlePress}
          hitSlop={8}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          {icon}
        </Pressable>
      </GlassView>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(120, 120, 128, 0.32)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }}
    >
      {icon}
    </Pressable>
  );
}
