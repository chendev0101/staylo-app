import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DevAppearanceToggle } from '@/components/dev-appearance-toggle';
import { ListingCard } from '@/components/listing-card';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { CATEGORIES, LISTINGS, type CategoryId } from '@/data/listings';
import { localize } from '@/i18n/resolve';
import { useTravelPreferences } from '@/preferences/travel-preferences';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { categories: preferred } = useTravelPreferences();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const keyword = query.trim().toLowerCase();
  // Preferred categories (from onboarding) come first; they order, never filter.
  const isPreferred = (item: (typeof LISTINGS)[number]) =>
    item.categories.some((c) => preferred.some((p) => p === c));
  const matches = LISTINGS.filter(
    (item) =>
      (category === 'all' || item.categories.includes(category)) &&
      (keyword === '' ||
        localize(item.title, i18n.language).toLowerCase().includes(keyword) ||
        localize(item.location, i18n.language).toLowerCase().includes(keyword)),
  );
  const listings = [...matches.filter(isPreferred), ...matches.filter((item) => !isPreferred(item))];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    // Safe-area insets are runtime values, so they stay inline styles.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="gap-4 border-b border-border pb-4 pt-2">
        <View className="flex-row items-center gap-3 px-5">
          <View className="flex-1">
            <Text variant="title" tone="primary">
              Staylo
            </Text>
            <Text tone="muted">{t('home.tagline')}</Text>
          </View>
          <IconButton
            icon={{ ios: 'globe', android: 'language', web: 'language' }}
            accessibilityLabel={t('a11y.openLanguage')}
            onPress={() => router.push('/language')}
          />
          <DevAppearanceToggle />
          {__DEV__ && (
            <IconButton
              icon={{ ios: 'paintpalette', android: 'palette', web: 'palette' }}
              accessibilityLabel={t('a11y.openDesignSystem')}
              onPress={() => router.push('/design-system')}
            />
          )}
        </View>

        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder={t('home.searchPlaceholder')}
          leadingIcon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel={t('home.searchPlaceholder')}
          className="mx-5"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-5">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={t(`category.${c.id}`)}
              icon={c.icon}
              selected={c.id === category}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-6 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text tone="muted" className="mt-6 text-center">
            {t('home.empty')}
          </Text>
        }
      />
    </View>
  );
}
