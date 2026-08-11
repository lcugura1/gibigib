import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/shared/components/back-button';
import { ScreenGradient } from '@/shared/components/screen-gradient';
import { ScrollEdgeFade, useScrollEdge } from '@/shared/components/scroll-edge-fade';
import { colors } from '@/shared/theme/colors';

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
};

export function ScrollScreen({ children, contentContainerStyle, footer }: Props) {
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useScrollEdge();
  const backTop = insets.top + 8;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenGradient />

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          {
            paddingHorizontal: 16,
            paddingTop: backTop + 44 + 24,
            paddingBottom: footer ? 24 : insets.bottom + 24,
            gap: 24,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>

      <ScrollEdgeFade scrollY={scrollY} />

      {footer ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
          {footer}
        </View>
      ) : null}

      <View style={{ position: 'absolute', top: backTop, left: 16 }}>
        <BackButton />
      </View>
    </View>
  );
}
