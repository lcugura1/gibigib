import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  onPress?: () => void;
  light?: boolean;
};

export function InfoRow({ icon, label, value, onPress, light = false }: Props) {
  const fg = light ? colors.textOnLight : colors.textPrimary;
  const muted = light ? colors.textOnLightSecondary : colors.textSecondary;
  const iconBg = light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          borderCurve: 'continuous',
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={fg} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: muted,
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <Text style={{ color: fg, fontSize: 15, fontWeight: '600' }}>{value}</Text>
      </View>
      {onPress ? <Ionicons name="open-outline" size={18} color={muted} /> : null}
    </Pressable>
  );
}
