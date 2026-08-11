import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/shared/components/back-button';
import { ScrollEdgeFade, useScrollEdge } from '@/shared/components/scroll-edge-fade';
import { colors } from '@/shared/theme/colors';

type Props = {
  title: string;
  children: ReactNode;
};

const BACK_TOP = 14;

export function SubScreen({ title, children }: Props) {
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useScrollEdge();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: BACK_TOP + 44 + 22,
          paddingBottom: insets.bottom + 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: '800',
            letterSpacing: 0.3,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        {children}
      </Animated.ScrollView>

      <ScrollEdgeFade scrollY={scrollY} height={BACK_TOP + 44} />

      <View style={{ position: 'absolute', top: BACK_TOP, left: 16 }}>
        <BackButton icon="chevron-down" />
      </View>
    </View>
  );
}
