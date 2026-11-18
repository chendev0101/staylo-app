import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import type { Listing } from '@/data/listings';
import { formatPrice } from '@/i18n/format';
import { localize } from '@/i18n/resolve';

const Image = styled(ExpoImage, { className: 'style' });

type Props = {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function ListingCard({ listing, isFavorite, onToggleFavorite }: Props) {
  const { t, i18n } = useTranslation();
  return (
    <View className="gap-3">
      <View>
        <Image
          source={{ uri: listing.imageUrl }}
          contentFit="cover"
          transition={300}
          recyclingKey={listing.id}
          className="aspect-[4/3] w-full rounded-xl bg-surface-muted"
        />
        <IconButton
          variant="overlay"
          icon={
            isFavorite
              ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
              : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }
          }
          tone={isFavorite ? 'primary' : 'fg'}
          selected={isFavorite}
          accessibilityLabel={isFavorite ? t('listing.removeFavorite') : t('listing.addFavorite')}
          onPress={onToggleFavorite}
          className="absolute right-3 top-3"
        />
      </View>

      <View className="gap-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text variant="headline" numberOfLines={1} className="flex-1">
            {localize(listing.title, i18n.language)}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon name={{ ios: 'star.fill', android: 'star', web: 'star' }} size={14} tone="warning" />
            <Text variant="caption">{listing.rating.toFixed(2)}</Text>
            <Text variant="caption" tone="muted">
              ({listing.reviews})
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon
            name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
            size={14}
            tone="fg-muted"
          />
          <Text variant="caption" tone="muted">
            {localize(listing.location, i18n.language)}
          </Text>
        </View>
        <View className="mt-1 flex-row items-baseline gap-1">
          <Text variant="headline">{formatPrice(listing.pricePerNight, i18n.language)}</Text>
          <Text variant="caption" tone="muted">
            {t('listing.perNight')}
          </Text>
        </View>
      </View>
    </View>
  );
}
