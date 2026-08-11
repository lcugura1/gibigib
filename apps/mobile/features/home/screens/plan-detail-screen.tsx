import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { getPlan } from "@/features/home/data/plans";
import { PaymentSection } from "@/features/payments/components/payment-section";
import { ScrollScreen } from "@/shared/components/scroll-screen";
import { colors } from "@/shared/theme/colors";

export function PlanDetailScreen({ slug }: { slug: string }) {
  const plan = getPlan(slug);

  if (!plan) return null;

  const handlePay = (methodId: string) => {
    console.log("Pay", {
      plan: plan.slug,
      amount: plan.amount,
      method: methodId,
    });
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
        <PaymentSection amount={plan.amount} onPay={handlePay} />
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
