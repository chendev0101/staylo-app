import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryBar } from '@/components/category-bar';
import { ListingCard } from '@/components/listing-card';
import { Spacing, useThemeColors } from '@/constants/theme';
import { CATEGORIES, LISTINGS, type CategoryId } from '@/data/listings';

export default function HomeScreen() {
  const colors = useThemeColors();
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
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.greeting}>
          <Text style={[styles.brand, { color: colors.primary }]}>Staylo</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            找到你的下一個落腳處
          </Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            tintColor={colors.textSecondary}
            size={20}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="搜尋地點或房源"
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <CategoryBar categories={CATEGORIES} selected={category} onSelect={setCategory} />
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            找不到符合條件的房源
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  greeting: {
    paddingHorizontal: Spacing.lg,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  empty: {
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
