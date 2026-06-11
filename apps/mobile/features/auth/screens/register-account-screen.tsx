import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkbox } from '@/features/auth/components/checkbox';
import { TextField } from '@/features/auth/components/text-field';
import { useRegisterForm } from '@/features/auth/context/register-form';
import { colors } from '@/shared/theme/colors';

export function RegisterAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { form, update } = useRegisterForm();
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
        <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700' }}>
          Registracija
        </Text>
        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
          Podaci o korisničkom računu
        </Text>

        <View style={{ gap: 20, marginTop: 24 }}>
          <TextField
            label="E-adresa"
            value={form.email}
            onChangeText={(text) => update({ email: text })}
            placeholder="Unesite vašu e-adresu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextField
            label="Lozinka"
            value={form.password}
            onChangeText={(text) => update({ password: text })}
            placeholder="Kreirajte lozinku"
            autoCapitalize="none"
            secureToggle
          />
          <Checkbox
            checked={form.acceptPolicy}
            onToggle={() => update({ acceptPolicy: !form.acceptPolicy })}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
              Prihvaćam <Text style={{ fontWeight: '600' }}>Pravila o privatnosti</Text>
            </Text>
          </Checkbox>
        </View>

        <View style={{ flex: 1 }} />

        <Pressable onPress={() => router.push('/register/details')}>
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
              Sljedeći korak
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
          <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Već imaš račun?</Text>
          <Link href="/login" asChild>
            <Pressable hitSlop={8}>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                Prijavi se
              </Text>
            </Pressable>
          </Link>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
