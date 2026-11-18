import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { CATEGORIES } from '@/data/listings';
import { useTravelPreferences, type PreferredCategory } from '@/preferences/travel-preferences';

const OPTIONS = CATEGORIES.filter(
  (c): c is (typeof CATEGORIES)[number] & { id: PreferredCategory } => c.id !== 'all',
);

export default function PreferencesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { categories, save } = useTravelPreferences();
  const [selected, setSelected] = useState<PreferredCategory[]>(categories);

  const toggle = (id: PreferredCategory) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const done = (choice: PreferredCategory[]) => {
    save(choice); // a skip saves an empty choice so this step isn't asked again
    router.push('/welcome');
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}>
      <ScrollView contentContainerClassName="gap-6 px-5">
        <View className="gap-2">
          <Text variant="title">{t('onboarding.preferences.title')}</Text>
          <Text tone="muted">{t('onboarding.preferences.subtitle')}</Text>
        </View>
        <View className="flex-row flex-wrap gap-3">
          {OPTIONS.map((c) => (
            <Chip
              key={c.id}
              label={t(`category.${c.id}`)}
              icon={c.icon}
              selected={selected.includes(c.id)}
              onPress={() => toggle(c.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="gap-2 px-5 pt-4">
        <Button
          title={t('onboarding.preferences.continue')}
          disabled={selected.length === 0}
          onPress={() => done(selected)}
        />
        <Button title={t('onboarding.skip')} variant="ghost" onPress={() => done([])} />
      </View>
    </View>
  );
}
