import { useLocalSearchParams } from 'expo-router';
import { TrainerProfileScreen } from '@/features/trainers/screens/trainer-profile-screen';

export default function TrainerProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TrainerProfileScreen id={id} />;
}
