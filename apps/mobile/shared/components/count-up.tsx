import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

type Props = {
  value: number;
  duration?: number;
  accessibilityLabel?: string;
  style?: StyleProp<TextStyle>;
};

export function CountUp({ value, duration = 900, accessibilityLabel, style }: Props) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    let raf = 0;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (value - from) * eased);
      setDisplay(current);
      fromRef.current = current;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <Text accessibilityLabel={accessibilityLabel} style={style}>
      {display}
    </Text>
  );
}
