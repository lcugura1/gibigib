import { Text } from 'react-native';

type Props = {
  color: string;
};

export function MoreIndicator({ color }: Props) {
  return (
    <Text
      style={{
        color,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 2,
        lineHeight: 20,
        marginLeft: 28,
      }}
    >
      ...
    </Text>
  );
}
