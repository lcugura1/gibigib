import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  ScrollView,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/shared/components/back-button';
import { ScreenGradient } from '@/shared/components/screen-gradient';
import { colors } from '@/shared/theme/colors';

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function ScrollScreen({ children, contentContainerStyle }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const backTop = insets.top + 8;
  const backBottom = backTop + 44;
  const fadeEnd = backBottom + 32;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenGradient />

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
          contentContainerStyle={[
            {
              paddingHorizontal: 16,
              paddingTop: fadeEnd,
              paddingBottom: insets.bottom + 24,
              gap: 24,
            },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </MaskedView>

      <View style={{ position: 'absolute', top: backTop, left: 16 }}>
        <BackButton />
      </View>
    </View>
  );
}
