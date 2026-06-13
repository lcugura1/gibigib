import { registerSchema } from '@gibigib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '@/features/auth/components/text-field';
import { useAuth } from '@/features/auth/context/auth';
import { useRegisterForm } from '@/features/auth/context/register-form';
import { ApiError, register } from '@/features/auth/services/auth';
import { BackButton } from '@/shared/components/back-button';
import { colors } from '@/shared/theme/colors';
import { useKeyboardHeight } from '@/shared/use-keyboard-height';
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
  const keyboardHeight = useKeyboardHeight();
  const { signIn } = useAuth();
  const { form, update } = useRegisterForm();
  const scrollRef = useRef<ScrollView>(null);
  const offsets = useRef<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
          Registracija
        </Text>
        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
          Osobni podaci
        </Text>

        <View onLayout={captureOffset('firstName')} style={{ marginTop: 24 }}>
          <TextField
            label="Ime"
            value={form.firstName}
            onChangeText={(text) => update({ firstName: text })}
            onFocus={() => scrollToField('firstName')}
            placeholder="Unesite vaše ime"
            error={errors.firstName}
          />
        </View>
        <View onLayout={captureOffset('lastName')} style={{ marginTop: 20 }}>
          <TextField
            label="Prezime"
            value={form.lastName}
            onChangeText={(text) => update({ lastName: text })}
            onFocus={() => scrollToField('lastName')}
            placeholder="Unesite vaše prezime"
            error={errors.lastName}
          />
        </View>
        <View onLayout={captureOffset('birthDate')} style={{ marginTop: 20 }}>
          <TextField
            label="Datum rođenja"
            value={form.birthDate}
            onChangeText={(text) => update({ birthDate: text })}
            onFocus={() => scrollToField('birthDate')}
            placeholder="Unesite vaš datum rođenja"
            error={errors.birthDate}
          />
        </View>
        <View onLayout={captureOffset('address')} style={{ marginTop: 20 }}>
          <TextField
            label="Adresa"
            value={form.address}
            onChangeText={(text) => update({ address: text })}
            onFocus={() => scrollToField('address')}
            placeholder="Unesite vašu adresu"
            error={errors.address}
          />
        </View>
        <View onLayout={captureOffset('oib')} style={{ marginTop: 20 }}>
          <TextField
            label="OIB"
            value={form.oib}
            onChangeText={(text) => update({ oib: text })}
            onFocus={() => scrollToField('oib')}
            placeholder="Unesite vaš OIB"
            keyboardType="number-pad"
            maxLength={11}
            error={errors.oib}
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
              {submitting ? 'Slanje...' : 'Postani član'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
