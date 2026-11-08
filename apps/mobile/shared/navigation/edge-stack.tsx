import { Stack } from 'expo-router/stack';
import { edgeScreenOptions } from '@/shared/navigation/edge-screen-options';

export default function EdgeStack() {
  return <Stack screenOptions={edgeScreenOptions} />;
}
