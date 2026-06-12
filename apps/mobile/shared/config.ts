import Constants from 'expo-constants';

const devHost = Constants.expoConfig?.hostUri?.split(':')[0];

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (devHost ? `http://${devHost}:3000` : 'http://localhost:3000');
