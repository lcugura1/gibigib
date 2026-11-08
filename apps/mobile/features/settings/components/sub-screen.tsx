import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme/colors';

type Props = {
  title: string;
  children: ReactNode;
};

export function SubScreen({ title, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 14 + 44 + 22,
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
      </ScrollView>
    </View>
  );
}
