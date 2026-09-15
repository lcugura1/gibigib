import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';

type IconName = keyof typeof Ionicons.glyphMap;

export function PopupHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '700' }}>{title}</Text>
      {children ? (
        <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 22 }}>{children}</Text>
      ) : null}
    </View>
  );
}

export function PopupRow({
  icon,
  children,
  emphasis = false,
}: {
  icon: IconName;
  children: ReactNode;
  emphasis?: boolean;
}) {
  const color = emphasis ? colors.textPrimary : colors.textSecondary;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
      <Ionicons name={icon} size={16} color={color} style={{ marginTop: 2 }} />
      <Text
        style={{
          flex: 1,
          color,
          fontSize: 15,
          lineHeight: 20,
          fontWeight: emphasis ? '600' : '400',
        }}
      >
        {children}
      </Text>
    </View>
  );
}

export function PopupIconBadge({ icon, tone = 'accent' }: { icon: IconName; tone?: 'accent' | 'muted' }) {
  const accent = tone === 'accent';

  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: accent ? 'rgba(197, 242, 61, 0.15)' : colors.surfaceBorder,
      }}
    >
      <Ionicons name={icon} size={24} color={accent ? colors.accent : colors.textSecondary} />
    </View>
  );
}

export function PopupHighlight({
  label,
  value,
  chip,
  accessibilityLabel,
  children,
}: {
  label: string;
  value: string;
  chip?: string;
  accessibilityLabel: string;
  children?: ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        borderRadius: 18,
        borderCurve: 'continuous',
        padding: 16,
        gap: 14,
      }}
    >
      <View accessible accessibilityLabel={accessibilityLabel} style={{ gap: 6 }}>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 30,
              lineHeight: 34,
              fontWeight: '800',
              letterSpacing: -0.5,
            }}
          >
            {value}
          </Text>
          {chip ? (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                borderCurve: 'continuous',
                backgroundColor: 'rgba(197, 242, 61, 0.15)',
              }}
            >
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 16,
                  fontWeight: '700',
                  fontVariant: ['tabular-nums'],
                }}
              >
                {chip}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}

export function PopupHighlightNote({ icon, children }: { icon: IconName; children: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <Text style={{ flex: 1, color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>{children}</Text>
    </View>
  );
}

export function PopupWeekBar({ caption }: { caption: string }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: 7 }, (_, index) => (
          <View
            key={index}
            style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.accent }}
          />
        ))}
      </View>
      <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>{caption}</Text>
    </View>
  );
}

export function PopupError({ children }: { children: string }) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
    >
      <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
      <Text style={{ flex: 1, color: colors.danger, fontSize: 14, fontWeight: '500' }}>{children}</Text>
    </Animated.View>
  );
}

export function PopupPrimaryButton({
  label,
  loading = false,
  onPress,
}: {
  label: string;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityState={{ busy: loading }}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={[colors.buttonPrimaryFrom, colors.buttonPrimaryTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 50,
            borderRadius: 14,
            borderCurve: 'continuous',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: pressed ? 0.85 : 1,
          }}
        >
          {loading ? <ActivityIndicator color={colors.buttonPrimaryText} /> : null}
          <Text style={{ color: colors.buttonPrimaryText, fontSize: 16, fontWeight: '700' }}>{label}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
}

export function PopupTextButton({
  label,
  disabled = false,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
