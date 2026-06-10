import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            title: 'Prijava',
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#FFFFFF',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: true,
            title: 'Registracija',
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#FFFFFF',
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
