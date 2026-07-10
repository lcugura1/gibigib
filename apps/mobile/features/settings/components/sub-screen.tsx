import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/shared/components/back-button';
import { colors } from '@/shared/theme/colors';

type Props = {
  title: string;
  children: ReactNode;
};

const BACK_TOP = 14;

export function SubScreen({ title, children }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const backBottom = BACK_TOP + 44;
  const fadeEnd = backBottom + 22;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <LinearGradient
            colors={['transparent', 'transparent', 'black', 'black']}
            locations={[0, backBottom / height, fadeEnd / height, 1]}
            style={{ flex: 1 }}
          />
        }
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: fadeEnd,
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
      </MaskedView>

      <View style={{ position: 'absolute', top: BACK_TOP, left: 16 }}>
        <BackButton icon="chevron-down" />
      </View>
    </View>
  );
}
