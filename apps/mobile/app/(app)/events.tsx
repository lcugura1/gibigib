import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/shared/theme/colors';

export default function Events() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + 16,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '700' }}>
        Događaji
      </Text>
    </View>
  );
}
