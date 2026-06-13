import { forgotPasswordSchema } from '@gibigib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '@/features/auth/components/text-field';
import { ApiError, forgotPassword } from '@/features/auth/services/auth';
import { BackButton } from '@/shared/components/back-button';
import { colors } from '@/shared/theme/colors';
import { toFieldErrors } from '@/shared/zod-errors';

export function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
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
    const result = forgotPasswordSchema.safeParse({ email });
    setErrors(result.success ? {} : toFieldErrors(result.error));
    return result.success ? result.data : null;
  };

  useEffect(() => {
    if (submitted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, email]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setFormError(null);
    const data = validate();
    if (!data) return;

    setSubmitting(true);
    try {
      await forgotPassword(data.email);
      router.push({ pathname: '/reset-password', params: { email: data.email } });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setErrors({ email: error.message });
      } else {
        setFormError(
          error instanceof ApiError ? error.message : 'Nije moguće povezati se s poslužiteljem',
        );
      }
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
          paddingTop: insets.top + 8,
          paddingBottom: keyboardVisible ? 16 : insets.bottom + 16,
        }}
      >
        <BackButton />

        <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700', marginTop: 16 }}>
          Zaboravljena lozinka
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 15, marginTop: 8 }}>
          Unesite e-adresu i poslat ćemo vam kod za promjenu lozinke.
        </Text>

        <View style={{ gap: 20, marginTop: 24 }}>
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
              {submitting ? 'Slanje...' : 'Pošalji kod'}
            </Text>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
