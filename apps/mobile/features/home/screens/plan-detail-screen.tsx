import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { membershipProgramSlugSchema } from "@gibigib/types";
import { ApiError } from "@/features/auth/services/auth";
import { getPlan } from "@/features/home/data/plans";
import { useMembership } from "@/features/membership/context/membership";
import { CheckoutError, payForProgram } from "@/features/payments/checkout";
import { PaymentSection } from "@/features/payments/components/payment-section";
import { ScrollScreen } from "@/shared/components/scroll-screen";
import { colors } from "@/shared/theme/colors";

export function PlanDetailScreen({ slug }: { slug: string }) {
  const plan = getPlan(slug);
  const router = useRouter();
  const { refresh } = useMembership();
  const [submitting, setSubmitting] = useState(false);

  if (!plan) return null;

  const handlePay = async () => {
    const programSlug = membershipProgramSlugSchema.safeParse(plan.slug);
    if (!programSlug.success) {
      Alert.alert("Plaćanje nije uspjelo", "Ovaj plan trenutno nije dostupan za online kupnju.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await payForProgram(programSlug.data);
      if (result === "canceled") return;
      await refresh();
      if (result === "processing") {
        Alert.alert(
          "Plaćanje je primljeno",
          "Članarina će se aktivirati za nekoliko trenutaka.",
        );
      }
      router.back();
    } catch (err) {
      Alert.alert(
        "Plaćanje nije uspjelo",
        err instanceof ApiError || err instanceof CheckoutError
          ? err.message
          : "Provjeri vezu i pokušaj ponovno.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollScreen contentContainerStyle={{ gap: 28 }}>
      <View style={{ gap: 4 }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 34,
            fontWeight: "700",
          }}
        >
          {plan.name}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
          {plan.duration}
          {plan.price ? ` · ${plan.price}` : ""}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          Pogodnosti
        </Text>
        <View style={{ gap: 10 }}>
          {plan.benefits.map((benefit) => (
            <View
              key={benefit}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons name="checkmark" size={18} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: 15 }}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {plan.description}
        </Text>
      </View>

      {plan.amount != null ? (
        <PaymentSection amount={plan.amount} onPay={handlePay} submitting={submitting} />
      ) : (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          Cijena na upit — javi se osoblju za personaliziranu ponudu.
        </Text>
      )}
    </ScrollScreen>
  );
}
