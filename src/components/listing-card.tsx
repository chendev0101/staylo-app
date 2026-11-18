import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import type { Listing } from '@/data/listings';

const Image = styled(ExpoImage, { className: 'style' });

type Props = {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const priceFormatter = new Intl.NumberFormat('zh-TW');

export function ListingCard({ listing, isFavorite, onToggleFavorite }: Props) {
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
          accessibilityLabel={isFavorite ? '取消收藏' : '加入收藏'}
          onPress={onToggleFavorite}
          className="absolute right-3 top-3"
        />
      </View>

      <View className="gap-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text variant="headline" numberOfLines={1} className="flex-1">
            {listing.title}
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
            {listing.location}
          </Text>
        </View>
        <View className="mt-1 flex-row items-baseline gap-1">
          <Text variant="headline">NT${priceFormatter.format(listing.pricePerNight)}</Text>
          <Text variant="caption" tone="muted">
            / 晚
          </Text>
        </View>
      </View>
    </View>
  );
}
