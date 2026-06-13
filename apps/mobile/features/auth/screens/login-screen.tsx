import { loginSchema } from '@gibigib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkbox } from '@/features/auth/components/checkbox';
import { TextField } from '@/features/auth/components/text-field';
import { useAuth } from '@/features/auth/context/auth';
import { ApiError, login } from '@/features/auth/services/auth';
import { colors } from '@/shared/theme/colors';
import { toFieldErrors } from '@/shared/zod-errors';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const validate = () => {
    const result = loginSchema.safeParse({ email, password });
    setErrors(result.success ? {} : toFieldErrors(result.error));
    return result.success ? result.data : null;
  };

  useEffect(() => {
    if (submitted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, email, password]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setFormError(null);
    const data = validate();
    if (!data) return;

    setSubmitting(true);
    try {
      const response = await login(data);
      await signIn(response.user, response.accessToken, response.refreshToken);
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Nije moguće povezati se s poslužiteljem',
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            error={errors.email}
          />
          <TextField
            label="Lozinka"
            value={password}
            onChangeText={setPassword}
            placeholder="Unesite vašu lozinku"
            autoCapitalize="none"
            secureToggle
            error={errors.password}
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

          <Link href="/forgot-password" asChild>
            <Pressable hitSlop={8}>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                Zaboravili ste lozinku?
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={{ flex: 1 }} />

        {formError ? (
          <Text style={{ color: colors.danger, fontSize: 14, textAlign: 'center', marginBottom: 12 }}>
            {formError}
          </Text>
        ) : null}

        <Pressable onPress={handleSubmit} disabled={submitting}>
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
              opacity: submitting ? 0.6 : 1,
            }}
          >
            <Text style={{ color: colors.buttonPrimaryText, fontSize: 17, fontWeight: '600' }}>
              {submitting ? 'Prijava...' : 'Prijavi se'}
            </Text>
          </LinearGradient>
        </Pressable>

        {keyboardVisible ? null : (
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
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}
