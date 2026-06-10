import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkbox } from '@/features/auth/components/checkbox';
import { TextField } from '@/features/auth/components/text-field';
import { colors } from '@/shared/theme/colors';

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [oib, setOib] = useState('');
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
          paddingTop: insets.top + 16,
          paddingBottom: keyboardVisible ? 16 : insets.bottom + 16,
        }}
      >
        {step === 2 ? (
          <Pressable
            onPress={() => setStep(1)}
            hitSlop={8}
            style={{ alignSelf: 'flex-start', marginBottom: 8 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
        ) : null}

        <Text style={{ color: colors.textPrimary, fontSize: 34, fontWeight: '700' }}>
          Registracija
        </Text>
        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
          {step === 1 ? 'Podaci o korisničkom računu' : 'Osobni podaci'}
        </Text>

        <ScrollView
          style={{ flex: 1, marginTop: 24 }}
          contentContainerStyle={{ gap: 20, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <>
              <TextField
                key="email"
                label="E-adresa"
                value={email}
                onChangeText={setEmail}
                placeholder="Unesite vašu e-adresu"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <TextField
                key="password"
                label="Lozinka"
                value={password}
                onChangeText={setPassword}
                placeholder="Kreirajte lozinku"
                autoCapitalize="none"
                secureToggle
              />
              <Checkbox checked={acceptPolicy} onToggle={() => setAcceptPolicy((value) => !value)}>
                <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                  Prihvaćam{' '}
                  <Text style={{ fontWeight: '600' }}>Pravila o privatnosti</Text>
                </Text>
              </Checkbox>
            </>
          ) : (
            <>
              <TextField
                key="firstName"
                label="Ime"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Unesite vaše ime"
              />
              <TextField
                key="lastName"
                label="Prezime"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Unesite vaše prezime"
              />
              <TextField
                key="birthDate"
                label="Datum rođenja"
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="Unesite vaš datum rođenja"
              />
              <TextField
                key="address"
                label="Adresa"
                value={address}
                onChangeText={setAddress}
                placeholder="Unesite vašu adresu"
              />
              <TextField
                key="oib"
                label="OIB"
                value={oib}
                onChangeText={setOib}
                placeholder="Unesite vaš OIB"
                keyboardType="number-pad"
                maxLength={11}
              />
            </>
          )}
        </ScrollView>

        <Pressable onPress={step === 1 ? () => setStep(2) : undefined}>
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
              {step === 1 ? 'Sljedeći korak' : 'Postani član'}
            </Text>
          </LinearGradient>
        </Pressable>

        {step === 1 ? (
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
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
