import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import { colors } from '@/shared/theme/colors';

export function SettingsCard({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        overflow: 'hidden',
      }}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index < items.length - 1 ? (
            <View style={{ height: 1, backgroundColor: colors.surfaceBorder, marginLeft: 50 }} />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}
