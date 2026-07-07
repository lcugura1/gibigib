import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GlassIconButton } from '@/features/home/components/glass-icon-button';
import { colors } from '@/shared/theme/colors';

type Props = {
  count: number;
  capacity: number;
};

function levelFor(ratio: number) {
  if (ratio < 0.5) return { label: 'Ugodno za trening', color: colors.accent };
  if (ratio < 0.8) return { label: 'Umjerena gužva', color: '#FF9F0A' };
  return { label: 'Velika gužva', color: colors.danger };
}

function OccupancyBar({ ratio, color }: { ratio: number; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [progress, ratio]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.surfaceBorder,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[{ height: '100%', borderRadius: 4, backgroundColor: color }, fillStyle]}
      />
    </View>
  );
}

export function GymOccupancy({ count, capacity }: Props) {
  const ratio = Math.min(count / capacity, 1);
  const level = levelFor(ratio);
  const [notify, setNotify] = useState(false);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: 20,
        gap: 18,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: '600',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          Broj ljudi u teretani
        </Text>
        <GlassIconButton
          name={notify ? 'notifications' : 'notifications-outline'}
          color={notify ? colors.accent : colors.textPrimary}
          interactive={false}
          onPress={() => setNotify((value) => !value)}
          accessibilityLabel={
            notify ? 'Isključi obavijest kad je gužva manja' : 'Obavijesti me kad je gužva manja'
          }
        />
      </View>

      <View style={{ gap: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            accessibilityLabel={`${count} ljudi u teretani, ${level.label}`}
            style={{
              color: colors.textPrimary,
              fontSize: 46,
              fontWeight: '800',
              lineHeight: 50,
            }}
          >
            {count}
          </Text>
          <View
            style={{
              backgroundColor: `${level.color}26`,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              borderCurve: 'continuous',
            }}
          >
            <Text style={{ color: level.color, fontSize: 13, fontWeight: '700' }}>
              {level.label}
            </Text>
          </View>
        </View>

        <OccupancyBar ratio={ratio} color={level.color} />
      </View>
    </View>
  );
}
