import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/context/auth';
import { colors } from '@/shared/theme/colors';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <Text
        style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '700', textAlign: 'center' }}
      >
        Dobrodošao, {user?.firstName}
      </Text>
      <Pressable onPress={signOut} hitSlop={8}>
        <Text style={{ color: colors.danger, fontSize: 17, fontWeight: '600' }}>Odjava</Text>
      </Pressable>
    </View>
  );
}
