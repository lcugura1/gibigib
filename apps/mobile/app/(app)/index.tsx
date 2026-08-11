import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAuth } from "@/features/auth/context/auth";
import { ScrollEdgeFade, useScrollEdge } from "@/shared/components/scroll-edge-fade";
import { colors } from "@/shared/theme/colors";
import { AvatarButton } from "@/features/home/components/avatar-button";
import { MembershipPass } from "@/features/home/components/membership-pass";
import { GymOccupancy } from "@/features/home/components/gym-occupancy";
import { PlanCard } from "@/features/home/components/plan-card";
import { SectionLabel } from "@/shared/components/section-label";
import { useRouter } from 'expo-router';
import { plans } from '@/features/home/data/plans';
import { useMembershipCountdown } from '@/features/membership/hooks/use-membership-countdown';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { label: membershipCountdown } = useMembershipCountdown();
  const { scrollY, onScroll } = useScrollEdge();

  const passValue = `gibigib:${user?.id ?? "demo"}`;
  const memberName = user?.firstName ?? "Član";

  // TODO: swap for live occupancy from API (see Linear task)
  const gymOccupancy = 70;
  const gymCapacity = 120;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>
              Dobrodošao,
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 30,
                fontWeight: "700",
              }}
            >
              {user?.firstName}
            </Text>
          </View>
          <AvatarButton avatarUrl={user?.avatarUrl ?? null} onPress={() => router.push('/settings')} />
        </View>

        <MembershipPass
          value={passValue}
          memberName={memberName}
          countdown={membershipCountdown}
          onCountdownPress={() => router.push("/membership")}
          onPress={() =>
            router.push({
              pathname: "/pass",
              params: { value: passValue },
            })
          }
        />

        <GymOccupancy count={gymOccupancy} capacity={gymCapacity} />

        <View style={{ gap: 12 }}>
          <SectionLabel>Dostupni planovi</SectionLabel>

          {plans.map((plan) => (
            <PlanCard
              key={plan.slug}
              {...plan}
              onPress={() =>
                plan.slug === "trener"
                  ? router.push("/trainers")
                  : router.push({ pathname: "/plan/[slug]", params: { slug: plan.slug } })
              }
            />
          ))}
        </View>
      </Animated.ScrollView>

      <ScrollEdgeFade scrollY={scrollY} insetAdjusted />
    </View>
  );
}
