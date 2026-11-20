import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/components/ui/tokens';

const Image = styled(ExpoImage, { className: 'style' });

const sizes = {
  md: { box: 'size-16', text: 'headline' },
  lg: { box: 'size-24', text: 'title' },
} as const;

/** A round profile photo, or the name's first letter on mint when there's no photo. */
export function Avatar({
  uri,
  name,
  size = 'md',
  className,
}: {
  uri?: string | null;
  name: string;
  size?: keyof typeof sizes;
  /** Layout only. */
  className?: string;
}) {
  const { t } = useTranslation();
  const s = sizes[size];
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={t('a11y.avatar')}
      className={cn('items-center justify-center overflow-hidden rounded-full bg-secondary', s.box, className)}>
      {uri ? (
        <Image source={{ uri }} contentFit="cover" transition={200} className="size-full" />
      ) : (
        <Text variant={s.text} tone="on-secondary">
          {name.trim().charAt(0).toUpperCase() || '?'}
        </Text>
      )}
    </View>
  );
}
