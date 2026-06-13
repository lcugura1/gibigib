import { registerSchema } from '@gibigib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '@/features/auth/components/text-field';
import { useAuth } from '@/features/auth/context/auth';
import { useRegisterForm } from '@/features/auth/context/register-form';
import { ApiError, register } from '@/features/auth/services/auth';
import { BackButton } from '@/shared/components/back-button';
import { colors } from '@/shared/theme/colors';
import { toFieldErrors } from '@/shared/zod-errors';

const detailsSchema = registerSchema.pick({
  firstName: true,
  lastName: true,
  birthDate: true,
  address: true,
  oib: true,
});

export function RegisterDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const { form, update } = useRegisterForm();
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
    const result = detailsSchema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      birthDate: form.birthDate,
      address: form.address,
      oib: form.oib,
    });
    setErrors(result.success ? {} : toFieldErrors(result.error));
    return result.success;
  };

  useEffect(() => {
    if (submitted) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, form.firstName, form.lastName, form.birthDate, form.address, form.oib]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        birthDate: form.birthDate,
        address: form.address,
        oib: form.oib,
      });
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
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: keyboardVisible ? 16 : insets.bottom + 16,
        }}
      >
        <BackButton />

        <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700', marginTop: 16 }}>
          Registracija
        </Text>
        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
          Osobni podaci
        </Text>

        <ScrollView
          style={{ flex: 1, marginTop: 24 }}
          contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextField
            label="Ime"
            value={form.firstName}
            onChangeText={(text) => update({ firstName: text })}
            placeholder="Unesite vaše ime"
            error={errors.firstName}
          />
          <TextField
            label="Prezime"
            value={form.lastName}
            onChangeText={(text) => update({ lastName: text })}
            placeholder="Unesite vaše prezime"
            error={errors.lastName}
          />
          <TextField
            label="Datum rođenja"
            value={form.birthDate}
            onChangeText={(text) => update({ birthDate: text })}
            placeholder="Unesite vaš datum rođenja"
            error={errors.birthDate}
          />
          <TextField
            label="Adresa"
            value={form.address}
            onChangeText={(text) => update({ address: text })}
            placeholder="Unesite vašu adresu"
            error={errors.address}
          />
          <TextField
            label="OIB"
            value={form.oib}
            onChangeText={(text) => update({ oib: text })}
            placeholder="Unesite vaš OIB"
            keyboardType="number-pad"
            maxLength={11}
            error={errors.oib}
          />
        </ScrollView>

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
              {submitting ? 'Slanje...' : 'Postani član'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
