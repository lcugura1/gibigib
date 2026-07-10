import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  external?: boolean;
  tint?: string;
};

export function SettingsRow({ icon, label, value, onPress, external, tint }: Props) {
  const color = tint ?? colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        opacity: pressed && onPress ? 0.6 : 1,
      })}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={{ flex: 1, color, fontSize: 16 }}>{label}</Text>
      {value ? <Text style={{ color: colors.textSecondary, fontSize: 15 }}>{value}</Text> : null}
      {onPress ? (
        <Ionicons
          name={external ? 'open-outline' : 'chevron-forward'}
          size={18}
          color={colors.textSecondary}
        />
      ) : null}
    </Pressable>
  );
}
