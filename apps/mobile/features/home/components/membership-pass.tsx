import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LayoutAnimationConfig,
  LinearTransition,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/shared/theme/colors';
import { GlassIconButton } from '@/features/home/components/glass-icon-button';
import { MembershipCountdown } from '@/features/membership/components/membership-countdown';
import { PauseBlock } from '@/features/membership/components/pause-block';
import { PauseCountdown } from '@/features/membership/components/pause-countdown';
import type { MembershipNotice } from '@/features/membership/context/membership';
import {
  formatDayMonthTime,
  type MembershipPauseState,
} from '@/features/membership/hooks/use-membership-pause';

const NOTICE_DURATION_MS = 4_000;
const BLOCK_DURATION_MS = 220;
const EXIT_DURATION_MS = 160;

const cardLayout = LinearTransition.duration(BLOCK_DURATION_MS).easing(Easing.out(Easing.cubic));

const contentEntering = () => {
    'worklet';
    return {
        initialValues: { opacity: 0, transform: [{ scale: 0.92 }] },
        animations: {
            opacity: withDelay(EXIT_DURATION_MS, withTiming(1, { duration: BLOCK_DURATION_MS })),
            transform: [
                {
                    scale: withDelay(
                        EXIT_DURATION_MS,
                        withTiming(1, { duration: BLOCK_DURATION_MS, easing: Easing.out(Easing.cubic) }),
                    ),
                },
            ],
        },
    };
};

const contentExiting = () => {
    'worklet';
    return {
        initialValues: { opacity: 1, transform: [{ scale: 1 }] },
        animations: {
            opacity: withTiming(0, { duration: EXIT_DURATION_MS }),
            transform: [{ scale: withTiming(0.92, { duration: EXIT_DURATION_MS }) }],
        },
    };
};

type Props = {
    value: string | null;
    countdown?: string | null;
    pause: MembershipPauseState;
    notice: MembershipNotice | null;
    onPress?: () => void;
    onCountdownPress?: () => void;
    onPausePress?: () => void;
    onResumePress?: () => void;
    onNoticeShown?: () => void;
};

export function MembershipPass({
    value,
    countdown,
    pause,
    notice,
    onPress,
    onCountdownPress,
    onPausePress,
    onResumePress,
    onNoticeShown,
}: Props) {
    return (
        <Animated.View
            layout={cardLayout}
            style={{
                backgroundColor: colors.textPrimary,
                borderRadius: 24,
                borderCurve: 'continuous',
                padding: 24,
                alignItems: 'center',
                gap: 16,
                overflow: 'hidden',
            }}
        >
            <LayoutAnimationConfig skipEntering>
                <View style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
                    {pause.paused ? (
                        <Animated.View key="pause-countdown" entering={FadeIn} exiting={FadeOut}>
                            <PauseCountdown label={pause.timeLeftLabel ?? ''} onPress={onCountdownPress} />
                        </Animated.View>
                    ) : countdown ? (
                        <Animated.View key="countdown" entering={FadeIn} exiting={FadeOut}>
                            <MembershipCountdown label={countdown} onPress={onCountdownPress} />
                        </Animated.View>
                    ) : null}
                </View>

                <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    {pause.paused ? (
                        <Animated.View key="resume" entering={FadeIn} exiting={FadeOut}>
                            <GlassIconButton
                                name="play-outline"
                                color={colors.textOnLight}
                                interactive={false}
                                elevated
                                onPress={onResumePress}
                                accessibilityLabel="Nastavi članarinu"
                            />
                        </Animated.View>
                    ) : pause.pausable ? (
                        <Animated.View key="pause" entering={FadeIn} exiting={FadeOut}>
                            <GlassIconButton
                                name="pause-outline"
                                color={colors.textOnLight}
                                interactive={false}
                                elevated
                                muted={!pause.canPause}
                                onPress={onPausePress}
                                accessibilityLabel="Pauziraj članarinu"
                            />
                        </Animated.View>
                    ) : null}
                </View>

                {pause.paused ? (
                    <Animated.View
                        key="paused"
                        entering={contentEntering}
                        exiting={contentExiting}
                        style={{ alignSelf: 'stretch', alignItems: 'center', gap: 16 }}
                    >
                        <PassLabel>Članarina pauzirana</PassLabel>
                        <PauseBlock days={pause.remainingDays} />
                        {pause.pauseEndsAt ? (
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color={colors.textOnLight}
                                    style={{ marginTop: 1 }}
                                />
                                <Text
                                    style={{
                                        flexShrink: 1,
                                        color: colors.textOnLight,
                                        fontSize: 14,
                                        lineHeight: 18,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                    }}
                                >
                                    {`Nastavlja se automatski ${formatDayMonthTime(pause.pauseEndsAt)}`}
                                </Text>
                            </View>
                        ) : null}
                        <Pressable
                            onPress={onResumePress}
                            accessibilityRole="button"
                            style={({ pressed }) => ({
                                alignSelf: 'stretch',
                                height: 50,
                                borderRadius: 14,
                                borderCurve: 'continuous',
                                backgroundColor: colors.textOnLight,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: pressed ? 0.85 : 1,
                            })}
                        >
                            <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '700' }}>
                                Nastavi članarinu
                            </Text>
                        </Pressable>
                        <PassCaption>Ulaz u teretanu nije moguć dok je članarina pauzirana</PassCaption>
                    </Animated.View>
                ) : (
                    <Animated.View
                        key="active"
                        entering={contentEntering}
                        exiting={contentExiting}
                        style={{ alignSelf: 'stretch', alignItems: 'center', gap: 16 }}
                    >
                        <PassLabel>Tvoja ulaznica</PassLabel>
                        <Pressable
                            onPress={onPress}
                            disabled={!value}
                            accessibilityRole="button"
                            accessibilityLabel="Povećaj QR kod za skeniranje"
                            style={({ pressed }) => ({
                                padding: 16,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 16,
                                borderCurve: 'continuous',
                                opacity: pressed ? 0.85 : 1,
                            })}
                        >
                            {value ? (
                                <QRCode value={value} size={200} color="#000000" backgroundColor="#FFFFFF" />
                            ) : (
                                <View style={{ width: 200, height: 200 }} />
                            )}
                        </Pressable>
                        {notice ? (
                            <ActiveNotice key={notice} notice={notice} onShown={onNoticeShown} />
                        ) : (
                            <Animated.View key="caption" entering={FadeIn.duration(200)}>
                                <PassCaption>Dodirni kod za povećanje i skeniranje na ulazu</PassCaption>
                            </Animated.View>
                        )}
                    </Animated.View>
                )}
            </LayoutAnimationConfig>
        </Animated.View>
    );
}

function PassLabel({ children }: { children: string }) {
    return (
        <Text
            style={{
                color: colors.textOnLightSecondary,
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
            }}
        >
            {children}
        </Text>
    );
}

function PassCaption({ children }: { children: string }) {
    return (
        <Text style={{ color: colors.textOnLightSecondary, fontSize: 14, textAlign: 'center' }}>
            {children}
        </Text>
    );
}

function ActiveNotice({ notice, onShown }: { notice: MembershipNotice; onShown?: () => void }) {
    useEffect(() => {
        const timeout = setTimeout(() => onShown?.(), NOTICE_DURATION_MS);
        return () => clearTimeout(timeout);
    }, [onShown]);

    return (
        <Animated.View
            entering={FadeIn.duration(BLOCK_DURATION_MS).delay(EXIT_DURATION_MS + BLOCK_DURATION_MS)}
            exiting={FadeOut.duration(EXIT_DURATION_MS)}
            accessibilityLiveRegion="polite"
            style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                borderCurve: 'continuous',
                backgroundColor: colors.accent,
            }}
        >
            <Ionicons name="checkmark-circle" size={18} color={colors.textOnLight} />
            <Text style={{ flexShrink: 1, color: colors.textOnLight, fontSize: 14, lineHeight: 18, fontWeight: '700' }}>
                {notice === 'auto-resumed'
                    ? 'Pauza je završila, članarina je ponovno aktivna'
                    : 'Članarina je ponovno aktivna'}
            </Text>
        </Animated.View>
    );
}
