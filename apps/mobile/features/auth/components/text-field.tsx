import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';

type Props = TextInputProps & {
  label: string;
  secureToggle?: boolean;
  error?: string;
};

export function TextField({ label, secureToggle, error, style, onFocus, onBlur, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const errorProgress = useSharedValue(error ? 1 : 0);

  useEffect(() => {
    errorProgress.value = withTiming(error ? 1 : 0, { duration: 200 });
  }, [error, errorProgress]);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      errorProgress.value,
      [0, 1],
      [focused ? colors.borderFocused : colors.border, colors.danger],
    ),
  }));

  return (
    <Animated.View style={{ gap: 8 }} layout={LinearTransition.duration(200)}>
      <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{label}</Text>
      <Animated.View
        style={[
          {
            height: 56,
            borderRadius: 12,
            borderCurve: 'continuous',
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          },
          animatedBorder,
        ]}
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
      </Animated.View>
      {error ? (
        <Animated.Text
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={{ color: colors.danger, fontSize: 13 }}
        >
          {error}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
}
