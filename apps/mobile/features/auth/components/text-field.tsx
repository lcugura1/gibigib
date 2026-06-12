import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = TextInputProps & {
  label: string;
  secureToggle?: boolean;
  error?: string;
};

export function TextField({ label, secureToggle, error, style, onFocus, onBlur, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? colors.danger : focused ? colors.borderFocused : colors.border;

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
      <View
        style={{
          height: 56,
          borderRadius: 12,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          {...inputProps}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          secureTextEntry={secureToggle ? hidden : inputProps.secureTextEntry}
          placeholderTextColor={colors.textSecondary}
          style={[{ flex: 1, color: colors.textPrimary, fontSize: 16 }, style]}
        />
        {secureToggle ? (
          <Pressable onPress={() => setHidden((value) => !value)} hitSlop={8}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
    </View>
  );
}
