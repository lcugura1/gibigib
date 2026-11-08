import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenGradient } from '@/shared/components/screen-gradient';
import { colors } from '@/shared/theme/colors';

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
};

export function ScrollScreen({ children, contentContainerStyle, footer }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenGradient />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        contentContainerStyle={[
          {
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: footer ? 24 : insets.bottom + 24,
            gap: 24,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {footer ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
