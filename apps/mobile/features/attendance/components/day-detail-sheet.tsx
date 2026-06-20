import { visitTagSchema } from '@gibigib/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useKeyboardHeight } from '@/shared/use-keyboard-height';
import { SectionLabel } from '@/shared/components/section-label';
import { colors } from '@/shared/theme/colors';
import { toFieldErrors } from '@/shared/zod-errors';
import { useAttendance } from '@/features/attendance/context/attendance';
import { formatVisitDate, labelForColor } from '@/features/attendance/data/visits';

export function DayDetailSheet() {
  const { selectedDate, clearSelection } = useAttendance();

  return (
    <Modal
      visible={selectedDate !== null}
      transparent
      animationType="none"
      onRequestClose={clearSelection}
    >
      {selectedDate ? <DayDetailContent key={selectedDate} date={selectedDate} /> : null}
    </Modal>
  );
}

function DayDetailContent({ date }: { date: string }) {
  const { visits, colorOptions, colorLabels, tagVisit, clearSelection } = useAttendance();
  const visit = visits.find((item) => item.date === date);

  const initialColor = visit?.color ?? colorOptions[0];
  const [color, setColor] = useState(initialColor);
  const [label, setLabel] = useState(visit?.label ?? labelForColor(colorLabels, initialColor));
  const [focused, setFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const keyboardHeight = useKeyboardHeight();

  const errorProgress = useSharedValue(0);
  const progress = useSharedValue(0);

  const validate = () => {
    const result = visitTagSchema.safeParse({ label });
    setErrors(result.success ? {} : toFieldErrors(result.error));
    return result.success ? result.data : null;
  };

  useEffect(() => {
    if (submitted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, label]);

  useEffect(() => {
    errorProgress.value = withTiming(errors.label ? 1 : 0, { duration: 200 });
  }, [errors.label, errorProgress]);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      errorProgress.value,
      [0, 1],
      [focused ? colors.borderFocused : colors.surfaceBorder, colors.danger],
    ),
  }));

  useEffect(() => {
    progress.value = withSpring(1, { damping: 16, stiffness: 180, mass: 0.9 });
  }, [progress]);

  const close = () => {
    Keyboard.dismiss();
    progress.value = withTiming(0, { duration: 180 }, (finished) => {
      if (finished) runOnJS(clearSelection)();
    });
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 24 }],
  }));

  const save = () => {
    setSubmitted(true);
    if (!validate()) return;
    tagVisit(date, color, label);
    close();
  };

  return (
    <Pressable onPress={close} style={{ flex: 1 }}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, backdropStyle]}
      />
      <View
        pointerEvents="box-none"
        style={{
          flex: 1,
          justifyContent: keyboardHeight > 0 ? 'flex-end' : 'center',
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 24,
        }}
      >
        <Animated.View style={cardStyle}>
          <Pressable
            onPress={() => Keyboard.dismiss()}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              padding: 24,
              gap: 20,
            }}
          >
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
              {formatVisitDate(date)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Dolazak u {visit?.time}</Text>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <SectionLabel>Boja</SectionLabel>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {colorOptions.map((option) => {
                const active = option === color;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setColor(option);
                      setLabel(labelForColor(colorLabels, option));
                    }}
                    hitSlop={6}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: option,
                        borderWidth: active ? 3 : 0,
                        borderColor: colors.textPrimary,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <SectionLabel>Oznaka</SectionLabel>
            <Animated.View
              style={[
                {
                  height: 50,
                  borderRadius: 14,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  backgroundColor: colors.background,
                  paddingHorizontal: 14,
                  justifyContent: 'center',
                },
                animatedBorder,
              ]}
            >
              <TextInput
                value={label}
                onChangeText={setLabel}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="npr. Push, Pull, Legs, Upper, Lower…"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="done"
                onSubmitEditing={save}
                style={{ color: colors.textPrimary, fontSize: 16 }}
              />
            </Animated.View>
            {errors.label ? (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={{ color: colors.danger, fontSize: 13 }}
              >
                {errors.label}
              </Animated.Text>
            ) : null}
          </View>

          <Pressable onPress={save}>
            <LinearGradient
              colors={[colors.buttonPrimaryFrom, colors.buttonPrimaryTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 50,
                borderRadius: 14,
                borderCurve: 'continuous',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.buttonPrimaryText, fontSize: 16, fontWeight: '700' }}>Spremi</Text>
            </LinearGradient>
          </Pressable>
          </Pressable>
        </Animated.View>
      </View>
    </Pressable>
  );
}
