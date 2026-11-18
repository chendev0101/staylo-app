import { View } from 'react-native';

import { Icon, type IconName } from './icon';
import { Text, type TextTone } from './text';
import { cn, type ColorToken } from './tokens';

const tones = {
  neutral: { container: 'bg-surface-muted', text: 'default', icon: 'fg' },
  success: { container: 'bg-success-soft', text: 'success', icon: 'success' },
  danger: { container: 'bg-danger-soft', text: 'danger', icon: 'danger' },
  info: { container: 'bg-info-soft', text: 'info', icon: 'info' },
  warning: { container: 'bg-warning-soft', text: 'default', icon: 'warning' },
} as const satisfies Record<string, { container: string; text: TextTone; icon: ColorToken }>;

type Props = {
  label: string;
  tone?: keyof typeof tones;
  icon?: IconName;
  /** Layout only. */
  className?: string;
};

export function Badge({ label, tone = 'neutral', icon, className }: Props) {
  const t = tones[tone];
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 self-start rounded-full px-3 py-1',
        t.container,
        className,
      )}>
      {icon && <Icon name={icon} size={12} tone={t.icon} />}
      <Text variant="small" tone={t.text}>
        {label}
      </Text>
    </View>
  );
}
