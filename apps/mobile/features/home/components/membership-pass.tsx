import QRCode from 'react-native-qrcode-svg';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
    value: string;
    memberName: string;
    onPress?: () => void;
};

export function MembershipPass({ value, memberName, onPress }: Props) {
    return (
        <View
            style={{
                backgroundColor: colors.textPrimary,
                borderRadius: 24,
                borderCurve: 'continuous',
                padding: 24,
                alignItems: 'center',
                gap: 16,
            }}
        >
            <View style={{ alignItems: 'center', gap: 4 }}>
                <Text 
                    style={{ 
                        color: colors.textOnLightSecondary, 
                        fontSize: 13, 
                        fontWeight: '600',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                        }}
                    >
                        Tvoja ulaznica
                </Text>
            </View>

            <Pressable
                onPress={onPress}
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
                <QRCode value={value} size={200} color="#000000" backgroundColor="#FFFFFF" />
            </Pressable>

            <Text style={{ color: colors.textOnLightSecondary, fontSize: 14, textAlign: 'center' }}>
                Dodirni kod za povećanje i skeniranje na ulazu
            </Text>
        </View>
    );
}
