import QRCode from 'react-native-qrcode-svg';
import { Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type Props = {
    value: string;
    memberName: string;
};

export function MembershipPass({ value, memberName }: Props) {
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

            <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 16, borderCurve: 'continuous' }}>
                <QRCode value={value} size={200} color="#000000" backgroundColor="#FFFFFF" />
            </View>
            
            <Text style={{ color: colors.textOnLightSecondary, fontSize: 14, textAlign: 'center' }}>
                Skeniraj kod na ulazu u teretanu
            </Text>
        </View>
    );
}
