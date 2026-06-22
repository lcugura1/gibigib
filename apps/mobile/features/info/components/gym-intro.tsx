import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { gym } from '@/features/info/data/gym';
import { InfoCard } from '@/features/info/components/info-card';

const BAR_COLOR = '#FF5A4D';

export function GymIntro() {
  return (
    <InfoCard style={{ padding: 24 }}>
      <View style={{ flexDirection: 'row', gap: 18 }}>
        <View
          style={{
            width: 4,
            borderRadius: 2,
            backgroundColor: BAR_COLOR,
            alignSelf: 'stretch',
          }}
        />
        <Text style={{ flex: 1, color: colors.textPrimary, fontSize: 18, lineHeight: 28 }}>
          {gym.intro.map((segment, index) => (
            <Text key={index} style={segment.bold ? { fontWeight: '700' } : undefined}>
              {segment.text}
            </Text>
          ))}
        </Text>
      </View>
    </InfoCard>
  );
}
