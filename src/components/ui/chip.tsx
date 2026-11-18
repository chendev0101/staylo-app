import { Pressable } from 'react-native';

import { Icon, type IconName } from './icon';
import { Text } from './text';
import { cn } from './tokens';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  /** Layout only. */
  className?: string;
};

export function Chip({ label, selected = false, onPress, icon, className }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'h-10 flex-row items-center gap-1.5 rounded-full px-4 active:opacity-80',
        selected ? 'bg-primary' : 'border border-border bg-surface',
        className,
      )}>
      {icon && <Icon name={icon} size={16} tone={selected ? 'on-primary' : 'fg'} />}
      <Text variant="label" tone={selected ? 'on-primary' : 'default'}>
        {label}
      </Text>
    </Pressable>
  );
}
