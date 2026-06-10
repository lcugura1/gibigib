import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkbox } from '@/features/auth/components/checkbox';
import { TextField } from '@/features/auth/components/text-field';
import { colors } from '@/shared/theme/colors';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = process.env.EXPO_OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = process.env.EXPO_OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable
        onPress={Keyboard.dismiss}
        accessible={false}
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: insets.top + 16,
          paddingBottom: keyboardVisible ? 16 : insets.bottom + 16,
        }}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700', marginBottom: 32 }}>
          Prijavi se
        </Text>

        <View style={{ gap: 20 }}>
          <TextField
            label="E-adresa"
            value={email}
            onChangeText={setEmail}
            placeholder="Unesite vašu e-adresu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextField
            label="Lozinka"
            value={password}
            onChangeText={setPassword}
            placeholder="Unesite vašu lozinku"
            autoCapitalize="none"
            secureToggle
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <Checkbox checked={rememberMe} onToggle={() => setRememberMe((value) => !value)}>
            <Text style={{ color: colors.textPrimary, fontSize: 15 }}>Zapamti me</Text>
          </Checkbox>

          <Pressable hitSlop={8}>
            <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
              Zaboravili ste lozinku?
            </Text>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <Pressable>
          <LinearGradient
            colors={[colors.buttonPrimaryFrom, colors.buttonPrimaryTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 48,
              borderRadius: 14,
              borderCurve: 'continuous',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.buttonPrimaryText, fontSize: 17, fontWeight: '600' }}>
              Prijavi se
            </Text>
          </LinearGradient>
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            marginTop: 16,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Nemate račun?</Text>
          <Link href="/register" asChild>
            <Pressable hitSlop={8}>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                Registriraj se
              </Text>
            </Pressable>
          </Link>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
