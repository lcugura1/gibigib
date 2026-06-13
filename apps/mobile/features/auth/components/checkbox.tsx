import { Ionicons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function Checkbox({ checked, onToggle, children }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: checked ? colors.borderFocused : colors.border,
          backgroundColor: checked ? colors.textPrimary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? <Ionicons name="checkmark" size={16} color={colors.background} /> : null}
      </View>
      {children}
    </Pressable>
  );
}
