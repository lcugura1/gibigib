import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAuth } from "@/features/auth/context/auth";
import { ScrollEdgeFade, useScrollEdge } from "@/shared/components/scroll-edge-fade";
import { colors } from "@/shared/theme/colors";
import { AvatarButton } from "@/features/home/components/avatar-button";
import { MembershipCtaCard } from "@/features/home/components/membership-cta-card";
import { MembershipPass } from "@/features/home/components/membership-pass";
import { GymOccupancy } from "@/features/home/components/gym-occupancy";
import { PlanCard } from "@/features/home/components/plan-card";
import { SectionLabel } from "@/shared/components/section-label";
import { useRouter } from 'expo-router';
import { plans } from '@/features/home/data/plans';
import { useEntryToken } from '@/features/home/hooks/use-entry-token';
import { useOccupancy } from '@/features/home/hooks/use-occupancy';
import { useMembership } from '@/features/membership/context/membership';
import { useMembershipCountdown } from '@/features/membership/hooks/use-membership-countdown';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { membership, status: membershipStatus } = useMembership();
  const { label: membershipCountdown } = useMembershipCountdown();
  const { qrValue } = useEntryToken(!!membership);
  const occupancy = useOccupancy();
  const { scrollY, onScroll } = useScrollEdge();

  const memberName = user?.firstName ?? "Član";

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

        {membership ? (
          qrValue ? (
            <MembershipPass
              value={qrValue}
              memberName={memberName}
              countdown={membershipCountdown}
              onCountdownPress={() => router.push("/membership")}
              onLockerPress={() => router.push("/locker")}
              onPress={() =>
                router.push({
                  pathname: "/pass",
                  params: { value: qrValue },
                })
              }
            />
          ) : null
        ) : membershipStatus === "ready" ? (
          <MembershipCtaCard />
        ) : null}

        {occupancy ? (
          <GymOccupancy count={occupancy.count} capacity={occupancy.capacity} />
        ) : null}

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
