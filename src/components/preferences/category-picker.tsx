import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { CATEGORIES } from '@/data/listings';
import type { PreferredCategory } from '@/preferences/travel-preferences';

/** Every listing category a guest can prefer ('all' is a filter, not a preference). */
export const PREFERENCE_OPTIONS = CATEGORIES.filter(
  (c): c is (typeof CATEGORIES)[number] & { id: PreferredCategory } => c.id !== 'all',
);

/** Multi-select chips for travel preferences (onboarding and settings). */
export function CategoryPicker({
  selected,
  onChange,
}: {
  selected: PreferredCategory[];
  onChange: (next: PreferredCategory[]) => void;
}) {
  const { t } = useTranslation();
  const toggle = (id: PreferredCategory) =>
    onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);

  return (
    <View className="flex-row flex-wrap gap-3">
      {PREFERENCE_OPTIONS.map((c) => (
        <Chip
          key={c.id}
          label={t(`category.${c.id}`)}
          icon={c.icon}
          selected={selected.includes(c.id)}
          onPress={() => toggle(c.id)}
        />
      ))}
    </View>
  );
}
