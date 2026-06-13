import { Stack } from 'expo-router/stack';
import { RegisterFormProvider } from '@/features/auth/context/register-form';

export default function RegisterLayout() {
  return (
    <RegisterFormProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="details" />
      </Stack>
    </RegisterFormProvider>
  );
}
