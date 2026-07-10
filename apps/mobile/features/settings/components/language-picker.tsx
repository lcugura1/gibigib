import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LANGUAGE_LABELS, type LanguageCode } from '@/features/settings/hooks/use-language';
import { colors } from '@/shared/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const CODES: LanguageCode[] = ['hr', 'en'];

type Props = {
  current: LanguageCode;
  onSelect: (code: LanguageCode) => void;
  onClose: () => void;
};

export function LanguagePicker({ current, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' }}
    >
      <AnimatedPressable
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        onPress={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      />

      <Animated.View
        entering={SlideInDown.duration(320)}
        exiting={SlideOutDown.duration(240)}
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderCurve: 'continuous',
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: insets.bottom + 16,
          gap: 16,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 5,
            borderRadius: 3,
            backgroundColor: '#48484A',
          }}
        />

        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          Jezik
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 18,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: colors.surfaceBorder,
            overflow: 'hidden',
          }}
        >
          {CODES.map((code, index) => {
            const active = code === current;
            return (
              <Fragment key={code}>
                <Pressable
                  onPress={() => onSelect(code)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 15,
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <Text
                    style={{
                      color: active ? colors.accent : colors.textPrimary,
                      fontSize: 16,
                      fontWeight: active ? '700' : '400',
                    }}
                  >
                    {LANGUAGE_LABELS[code]}
                  </Text>
                  {active ? <Ionicons name="checkmark" size={20} color={colors.accent} /> : null}
                </Pressable>
                {index < CODES.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: colors.surfaceBorder, marginLeft: 16 }} />
                ) : null}
              </Fragment>
            );
          })}
        </View>

        <Pressable
          onPress={onClose}
          style={{
            padding: 16,
            borderRadius: 18,
            borderCurve: 'continuous',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.surfaceBorder,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>Odustani</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
