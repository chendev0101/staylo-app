import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, useThemeColors } from '@/constants/theme';
import type { Listing } from '@/data/listings';

type Props = {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const priceFormatter = new Intl.NumberFormat('zh-TW');

export function ListingCard({ listing, isFavorite, onToggleFavorite }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.card}>
      <View>
        <Image
          source={{ uri: listing.imageUrl }}
          style={[styles.image, { backgroundColor: colors.surface }]}
          contentFit="cover"
          transition={300}
          recyclingKey={listing.id}
        />
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? '取消收藏' : '加入收藏'}
          style={({ pressed }) => [styles.favoriteButton, pressed && { opacity: 0.7 }]}>
          <SymbolView
            name={
              isFavorite
                ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
                : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }
            }
            tintColor={isFavorite ? colors.favorite : '#FFFFFF'}
            size={24}
            fallback={<Text style={styles.fallbackHeart}>{isFavorite ? '♥' : '♡'}</Text>}
          />
        </Pressable>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {listing.title}
          </Text>
          <View style={styles.rating}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              tintColor={colors.text}
              size={14}
              fallback={<Text style={{ color: colors.text }}>★</Text>}
            />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {listing.rating.toFixed(2)}
            </Text>
            <Text style={{ color: colors.textSecondary }}>({listing.reviews})</Text>
          </View>
        </View>
        <Text style={{ color: colors.textSecondary }}>{listing.location}</Text>
        <Text style={[styles.price, { color: colors.text }]}>
          <Text style={styles.priceAmount}>NT${priceFormatter.format(listing.pricePerNight)}</Text>
          {' / 晚'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  fallbackHeart: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  info: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontWeight: '500',
  },
  price: {
    marginTop: Spacing.xs,
    fontSize: 15,
  },
  priceAmount: {
    fontWeight: '700',
  },
});
