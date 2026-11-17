import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Spacing, useThemeColors } from '@/constants/theme';
import type { Category, CategoryId } from '@/data/listings';

type Props = {
  categories: Category[];
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
};

export function CategoryBar({ categories, selected, onSelect }: Props) {
  const colors = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {categories.map((category) => {
        const isActive = category.id === selected;
        const color = isActive ? colors.text : colors.textSecondary;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.item,
              { borderBottomColor: isActive ? colors.text : 'transparent' },
            ]}>
            <SymbolView name={category.icon} tintColor={color} size={24} />
            <Text style={[styles.label, { color }, isActive && styles.labelActive]}>
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  item: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 12,
  },
  labelActive: {
    fontWeight: '600',
  },
});
