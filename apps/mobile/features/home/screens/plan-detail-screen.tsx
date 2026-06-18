import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPlan } from "@/features/home/data/plans";
import { PaymentSection } from "@/features/payments/components/payment-section";
import { BackButton } from "@/shared/components/back-button";
import { ScreenGradient } from "@/shared/components/screen-gradient";
import { colors } from "@/shared/theme/colors";

const FILLER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.";

export function PlanDetailScreen({ slug }: { slug: string }) {
  const insets = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenGradient />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
          gap: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

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
            {FILLER}
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
      </ScrollView>
    </View>
  );
}
