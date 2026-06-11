import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextField } from '@/features/auth/components/text-field';
import { useRegisterForm } from '@/features/auth/context/register-form';
import { BackButton } from '@/shared/components/back-button';
import { colors } from '@/shared/theme/colors';

export function RegisterDetailsScreen() {
  const insets = useSafeAreaInsets();
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
          />
          <TextField
            label="Prezime"
            value={form.lastName}
            onChangeText={(text) => update({ lastName: text })}
            placeholder="Unesite vaše prezime"
          />
          <TextField
            label="Datum rođenja"
            value={form.birthDate}
            onChangeText={(text) => update({ birthDate: text })}
            placeholder="Unesite vaš datum rođenja"
          />
          <TextField
            label="Adresa"
            value={form.address}
            onChangeText={(text) => update({ address: text })}
            placeholder="Unesite vašu adresu"
          />
          <TextField
            label="OIB"
            value={form.oib}
            onChangeText={(text) => update({ oib: text })}
            placeholder="Unesite vaš OIB"
            keyboardType="number-pad"
            maxLength={11}
          />
        </ScrollView>

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
              Postani član
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
