import type { NativeStackNavigationOptions } from 'expo-router';
import { colors } from '@/shared/theme/colors';

export const edgeScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerTransparent: true,
  headerTitle: '',
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  scrollEdgeEffects: { top: 'soft' },
  contentStyle: { backgroundColor: colors.background },
};

export function edgeSheetOptions({
  navigation,
}: {
  navigation: { goBack: () => void };
}): NativeStackNavigationOptions {
  return {
    ...edgeScreenOptions,
    presentation: 'modal',
    unstable_headerLeftItems: () => [
      {
        type: 'button',
        label: 'Zatvori',
        icon: { type: 'sfSymbol', name: 'chevron.down' },
        onPress: () => navigation.goBack(),
      },
    ],
  };
}
