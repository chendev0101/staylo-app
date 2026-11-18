import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListingCard } from '@/components/listing-card';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { CATEGORIES, LISTINGS, type CategoryId } from '@/data/listings';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const keyword = query.trim().toLowerCase();
  const listings = LISTINGS.filter(
    (item) =>
      (category === 'all' || item.categories.includes(category)) &&
      (keyword === '' ||
        item.title.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword)),
  );

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
            <Text tone="muted">找到你的下一個落腳處</Text>
          </View>
          {__DEV__ && (
            <IconButton
              icon={{ ios: 'paintpalette', android: 'palette', web: 'palette' }}
              accessibilityLabel="開啟設計系統瀏覽頁"
              onPress={() => router.push('/design-system')}
            />
          )}
        </View>

        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder="搜尋地點或房源"
          leadingIcon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="搜尋地點或房源"
          className="mx-5"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-5">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
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
            找不到符合條件的房源
          </Text>
        }
      />
    </View>
  );
}
