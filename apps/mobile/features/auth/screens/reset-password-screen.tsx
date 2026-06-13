import { resetPasswordSchema } from '@gibigib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '@/features/auth/components/text-field';
import { ApiError, resetPassword } from '@/features/auth/services/auth';
import { BackButton } from '@/shared/components/back-button';
import { colors } from '@/shared/theme/colors';
import { useKeyboardHeight } from '@/shared/use-keyboard-height';
import { toFieldErrors } from '@/shared/zod-errors';

export function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const keyboardHeight = useKeyboardHeight();
  const { email } = useLocalSearchParams<{ email: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const result = resetPasswordSchema.safeParse({ email, code, password });
    const fieldErrors = result.success ? {} : toFieldErrors(result.error);
    if (password && password !== confirmPassword) {
      fieldErrors.confirmPassword = 'Lozinke se ne podudaraju';
    }
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  useEffect(() => {
    if (submitted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, code, password, confirmPassword]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await resetPassword({ email, code, password });
      Alert.alert('Lozinka promijenjena', 'Prijavite se s novom lozinkom.');
      router.replace('/login');
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Nije moguće povezati se s poslužiteljem',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const captureOffset = (key: string) => (event: LayoutChangeEvent) => {
    offsets.current[key] = event.nativeEvent.layout.y;
  };
  const scrollToField = (key: string) => {
    scrollRef.current?.scrollTo({ y: Math.max(0, (offsets.current[key] ?? 0) - 16), animated: true });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
      }}
    >
      <BackButton />

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700', marginTop: 16 }}>
          Nova lozinka
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 15, marginTop: 8 }}>
          Unesite kod s e-pošte i novu lozinku.
        </Text>

        <View onLayout={captureOffset('code')} style={{ marginTop: 24 }}>
          <TextField
            label="Kod"
            value={code}
            onChangeText={setCode}
            onFocus={() => scrollToField('code')}
            placeholder="Unesite 6-znamenkasti kod"
            keyboardType="number-pad"
            maxLength={6}
            error={errors.code}
          />
        </View>
        <View onLayout={captureOffset('password')} style={{ marginTop: 20 }}>
          <TextField
            label="Nova lozinka"
            value={password}
            onChangeText={setPassword}
            onFocus={() => scrollToField('password')}
            placeholder="Unesite novu lozinku"
            autoCapitalize="none"
            secureToggle
            error={errors.password}
          />
        </View>
        <View onLayout={captureOffset('confirmPassword')} style={{ marginTop: 20 }}>
          <TextField
            label="Potvrdi lozinku"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => scrollToField('confirmPassword')}
            placeholder="Ponovite novu lozinku"
            autoCapitalize="none"
            secureToggle
            error={errors.confirmPassword}
          />
        </View>

        {formError ? (
          <Text style={{ color: colors.danger, fontSize: 14, textAlign: 'center', marginTop: 16 }}>
            {formError}
          </Text>
        ) : null}
      </ScrollView>

      <View
        style={{
          paddingTop: 8,
          marginBottom: keyboardHeight,
          paddingBottom: keyboardHeight > 0 ? 12 : insets.bottom + 16,
        }}
      >
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
              {submitting ? 'Spremanje...' : 'Spremi lozinku'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
