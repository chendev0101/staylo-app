import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import type { ColorToken } from './tokens';
import { useTokenColor } from './use-token-color';

export type IconName = SymbolViewProps['name'];

type Props = {
  /** `{ ios: SF Symbol, android: Material Symbol, web: Material Symbol }` */
  name: IconName;
  size?: number;
  tone?: ColorToken;
  accessibilityLabel?: string;
};

export function Icon({ name, size = 20, tone = 'fg', accessibilityLabel }: Props) {
  const color = useTokenColor(tone);
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      accessibilityLabel={accessibilityLabel}
      accessible={!!accessibilityLabel}
    />
  );
}
