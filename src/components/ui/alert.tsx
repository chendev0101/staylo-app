import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';
import { cn } from './tokens';

const tones = {
  success: {
    container: 'bg-success-soft',
    tone: 'success',
    icon: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  },
  danger: {
    container: 'bg-danger-soft',
    tone: 'danger',
    icon: { ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' },
  },
} as const;

type Props = {
  message: string;
  tone?: keyof typeof tones;
  onDismiss?: () => void;
  /** Layout only. */
  className?: string;
};

export function Alert({ message, tone = 'success', onDismiss, className }: Props) {
  const { t } = useTranslation();
  const s = tones[tone];
  return (
    <View
      accessibilityRole="alert"
      className={cn('flex-row items-center gap-3 rounded-lg px-4 py-3', s.container, className)}>
      <Icon name={s.icon} size={22} tone={s.tone} />
      <Text variant="caption" tone={s.tone} className="flex-1">
        {message}
      </Text>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.close')}>
          <Icon name={{ ios: 'xmark', android: 'close', web: 'close' }} size={16} tone={s.tone} />
        </Pressable>
      )}
    </View>
  );
}
