import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/shared/theme/colors";
import { MoreIndicator } from "@/features/home/components/more-indicator";

type Props = {
  name: string;
  duration: string;
  price?: string;
  cta?: string;
  benefits: string[];
  hasMore?: boolean;
  savings?: string;
  variant?: "dark" | "light";
  popular?: boolean;
  onPress?: () => void;
};

export function PlanCard({
  name,
  duration,
  price,
  benefits,
  hasMore,
  savings,
  cta= "Pogledaj plan",
  variant = "dark",
  popular = false,
  onPress,
}: Props) {
  const light = variant === "light";
  const fg = light ? colors.textOnLight : colors.textPrimary;
  const muted = light ? colors.textOnLightSecondary : colors.textSecondary;
  const check = light ? colors.textOnLight : colors.accent;

  const gradient: readonly [string, string] = light
    ? [colors.cardLightGradientFrom, colors.cardLightGradientTo]
    : [colors.cardGradientFrom, colors.cardGradientTo];

  const content = (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ gap: 2 }}>
          <Text style={{ color: fg, fontSize: 22, fontWeight: "700" }}>
            {name}
          </Text>
          <Text style={{ color: muted, fontSize: 14 }}>{duration}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          {popular ? (
            <View
              style={{
                backgroundColor: colors.accent,
                borderRadius: 8,
                borderCurve: "continuous",
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  color: colors.textOnLight,
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                }}
              >
                POPULARNO
              </Text>
            </View>
          ) : null}
          {price ? (
            <Text style={{ color: fg, fontSize: 26, fontWeight: "800" }}>{price}</Text>
          ) : null}
          {savings ? (
            <Text style={{ color: muted, fontSize: 13 }}>{savings}</Text>
          ) : null}
        </View>
      </View>

      <View style={{ gap: 10, marginTop: 16 }}>
        {benefits.map((benefit) => (
          <View
            key={benefit}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Ionicons name="checkmark" size={18} color={check} />
            <Text style={{ color: fg, fontSize: 15 }}>{benefit}</Text>
          </View>
        ))}
        {hasMore ? <MoreIndicator color={muted} /> : null}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 16,
        }}
      >
        <Text style={{ color: fg, fontSize: 15, fontWeight: "600" }}>{cta}</Text> 
        <Ionicons name="chevron-forward" size={16} color={fg} />
      </View>
    </>
  );

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          borderCurve: "continuous",
          padding: 20,
          borderWidth: light ? 0 : 1,
          borderColor: colors.cardBorder,
        }}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}
