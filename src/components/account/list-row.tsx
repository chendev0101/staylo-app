import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/components/ui/tokens';

/** A grouped list: rows on one surface, separated by hairlines rather than separate cards. */
export function ListGroup({ children }: { children: ReactNode }) {
  return <View className="overflow-hidden rounded-xl border border-border bg-surface">{children}</View>;
}

/** A tappable settings row: icon, label, current value, chevron. Highlights on press. */
export function ListRow({
  icon,
  label,
  value,
  onPress,
  last = false,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
  /** The last row in a group has no divider. */
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      className={cn(
        'min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-surface-muted',
        !last && 'border-b border-border',
      )}>
      <Icon name={icon} size={20} tone="fg-muted" />
      <Text className="flex-1">{label}</Text>
      {value ? (
        <Text tone="muted" numberOfLines={1} className="max-w-[50%]">
          {value}
        </Text>
      ) : null}
      <Icon name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} size={16} tone="fg-muted" />
    </Pressable>
  );
}
