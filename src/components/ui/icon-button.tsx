import { Pressable } from 'react-native';

import { Icon, type IconName } from './icon';
import { cn, type ColorToken } from './tokens';

const variants = {
  /** Round surface button on regular backgrounds. */
  default: { container: 'size-12 bg-surface border border-border', icon: 22 },
  /** Smaller button that sits on photos. */
  overlay: { container: 'size-9 bg-surface shadow-card', icon: 18 },
} as const;

type Props = {
  icon: IconName;
  /** Required: icon-only controls have no visible text. */
  accessibilityLabel: string;
  onPress?: () => void;
  variant?: keyof typeof variants;
  tone?: ColorToken;
  selected?: boolean;
  disabled?: boolean;
  /** Layout only. */
  className?: string;
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'default',
  tone = 'fg',
  selected,
  disabled = false,
  className,
}: Props) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      className={cn(
        'items-center justify-center rounded-full active:opacity-70',
        v.container,
        disabled && 'opacity-40',
        className,
      )}>
      <Icon name={icon} size={v.icon} tone={tone} />
    </Pressable>
  );
}
