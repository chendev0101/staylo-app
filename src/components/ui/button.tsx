import { ActivityIndicator, Pressable } from 'react-native';

import { Icon, type IconName } from './icon';
import { Text, type TextTone, type TextVariant } from './text';
import { cn, type ColorToken } from './tokens';
import { useTokenColor } from './use-token-color';

const variants = {
  primary: { container: 'bg-primary', tone: 'on-primary' },
  secondary: { container: 'bg-surface border border-border', tone: 'default' },
  ghost: { container: 'bg-transparent', tone: 'default' },
} as const satisfies Record<string, { container: string; tone: TextTone }>;

const sizes = {
  sm: { container: 'h-10 px-4 gap-1.5', text: 'label', icon: 16 },
  md: { container: 'h-12 px-5 gap-2', text: 'button', icon: 20 },
  lg: { container: 'h-14 px-6 gap-2', text: 'button', icon: 20 },
} as const satisfies Record<string, { container: string; text: TextVariant; icon: number }>;

const iconTone: Record<TextTone, ColorToken> = {
  default: 'fg',
  muted: 'fg-muted',
  primary: 'primary',
  'on-primary': 'on-primary',
  'on-secondary': 'on-secondary',
  success: 'success',
  danger: 'danger',
  info: 'info',
  warning: 'warning',
};

type Props = {
  title: string;
  onPress?: () => void;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Layout only (margins, self alignment, flex). */
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  className,
}: Props) {
  const v = variants[variant];
  const s = sizes[size];
  const tone = iconTone[v.tone];
  const spinnerColor = useTokenColor(tone);
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      className={cn(
        'flex-row items-center justify-center rounded-full active:opacity-80',
        v.container,
        s.container,
        disabled && 'opacity-40',
        className,
      )}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          {leadingIcon && <Icon name={leadingIcon} size={s.icon} tone={tone} />}
          <Text variant={s.text} tone={v.tone}>
            {title}
          </Text>
          {trailingIcon && <Icon name={trailingIcon} size={s.icon} tone={tone} />}
        </>
      )}
    </Pressable>
  );
}
