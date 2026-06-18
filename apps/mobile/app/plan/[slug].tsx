import { useLocalSearchParams } from 'expo-router';
import { PlanDetailScreen } from '@/features/home/screens/plan-detail-screen';

export default function PlanDetailRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PlanDetailScreen slug={slug} />;
}
