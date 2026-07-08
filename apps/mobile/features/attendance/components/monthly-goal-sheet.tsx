import { monthlyGoalInputSchema } from '@gibigib/types';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useKeyboardHeight } from '@/shared/use-keyboard-height';
import { colors } from '@/shared/theme/colors';
import { useAttendance } from '@/features/attendance/context/attendance';

export function MonthlyGoalSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {visible ? <GoalContent onClose={onClose} /> : null}
    </Modal>
  );
}

function GoalContent({ onClose }: { onClose: () => void }) {
  const { goal, setGoal } = useAttendance();
  const [value, setValue] = useState(goal ? String(goal) : '');
  const [error, setError] = useState<string | null>(null);
  const keyboardHeight = useKeyboardHeight();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 220 });
  }, [progress]);

  const close = () => {
    Keyboard.dismiss();
    progress.value = withTiming(0, { duration: 180 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const save = () => {
    const parsed = value === '' ? Number.NaN : Number.parseInt(value, 10);
    const result = monthlyGoalInputSchema.safeParse({ goal: parsed });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Neispravan cilj');
      return;
    }
    setGoal(result.data.goal);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    close();
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 24 }],
  }));

  return (
    <Pressable onPress={close} style={{ flex: 1 }}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, backdropStyle]}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
      </Animated.View>

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
            <View style={{ gap: 6, alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontWeight: '600',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Mjesečni cilj
              </Text>
              <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700', textAlign: 'center' }}>
                Koliko dolazaka mjesečno?
              </Text>
            </View>

            <TextInput
              value={value}
              onChangeText={(text) => {
                setValue(text.replace(/[^0-9]/g, ''));
                setError(null);
              }}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="npr. 12"
              placeholderTextColor={colors.textSecondary}
              style={{
                height: 64,
                borderRadius: 16,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: error ? colors.danger : colors.surfaceBorder,
                backgroundColor: colors.background,
                color: colors.textPrimary,
                fontSize: 30,
                fontWeight: '800',
                textAlign: 'center',
              }}
            />
            {error ? (
              <Text style={{ color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: -8 }}>
                {error}
              </Text>
            ) : null}

            <Pressable onPress={save}>
              <LinearGradient
                colors={[colors.buttonPrimaryFrom, colors.buttonPrimaryTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 52,
                  borderRadius: 16,
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
