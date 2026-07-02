import { ScrollView, Text, View } from "react-native";
import { useAuth } from "@/features/auth/context/auth";
import { colors } from "@/shared/theme/colors";
import { GlassIconButton } from "@/features/home/components/glass-icon-button";
import { MembershipPass } from "@/features/home/components/membership-pass";
import { PlanCard } from "@/features/home/components/plan-card";
import { SectionLabel } from "@/shared/components/section-label";
import { useRouter } from 'expo-router';
import { plans } from '@/features/home/data/plans';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const passValue = `gibigib:${user?.id ?? "demo"}`;
  const memberName = user?.firstName ?? "Član";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
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
        <GlassIconButton name="person-outline" onPress={() => router.push('/settings')} />
      </View>

      <MembershipPass
        value={passValue}
        memberName={memberName}
        onPress={() =>
          router.push({
            pathname: "/pass",
            params: { value: passValue, memberName },
          })
        }
      />
      <View style={{ gap: 12 }}>
        <SectionLabel>Dostupni planovi</SectionLabel>

        {plans.map((plan) => (
          <PlanCard
            key={plan.slug}
            {...plan}
            onPress={() => router.push({ pathname: '/plan/[slug]', params: { slug: plan.slug } })}
          />
        ))}
      </View>

    </ScrollView>
  );
}
