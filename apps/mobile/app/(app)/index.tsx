import { ScrollView, Text, View } from "react-native";
import { useAuth } from "@/features/auth/context/auth";
import { colors } from "@/shared/theme/colors";
import { GlassIconButton } from "@/features/home/components/glass-icon-button";
import { MembershipPass } from "@/features/home/components/membership-pass";
import { PlanCard } from "@/features/home/components/plan-card";
import { SectionLabel } from "@/features/home/components/section-label";

export default function Home() {
  const { user, signOut } = useAuth();

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
        <GlassIconButton name="person-outline" onPress={signOut} />
      </View>

      <MembershipPass
        value={`gibigib:${user?.id ?? "demo"}`}
        memberName={user?.firstName ?? "Član"}
      />
      <View style={{ gap: 12 }}>
        <SectionLabel>Dostupni planovi</SectionLabel>
      </View>

      <PlanCard
        name="Mjesečno"
        duration="1 mjesec"
        price="29,99 €"
        benefits={[
          "Neograničen pristup",
          "Svlačionica i tuševi",
          "Besplatan Wi-Fi",
        ]}
        extraBenefits={1}
      />

      <PlanCard
        variant="light"
        name="Grupni program"
        duration="1 mjesec"
        price="39,99 €"
        benefits={[
          "Vođeni grupni treninzi",
          "Tjedni raspored termina",
          "Stručni trener",
        ]}
        extraBenefits={2}
      />

      <PlanCard
        name="Godišnji"
        duration="12 mjeseci"
        price="250,00 €"
        savings="Uštedi 109,88 €"
        benefits={[
          "Neograničen pristup",
          "Svlačionica i tuševi",
          "Besplatan Wi-Fi",
        ]}
        extraBenefits={1}
      />

      <PlanCard
        variant="light"
        name="1 na 1 uz trenera"
        duration="Personalni trening"
        cta="Detalji"
        benefits={[
          "Individualni plan treninga",
          "Termini po dogovoru",
          "Posvećen trener",
        ]}
        extraBenefits={2}
      />
    </ScrollView>
  );
}
