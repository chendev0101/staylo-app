import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/preferences/category-picker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTravelPreferences, type PreferredCategory } from '@/preferences/travel-preferences';

export default function PreferencesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { categories, save } = useTravelPreferences();
  const [selected, setSelected] = useState<PreferredCategory[]>(categories);

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
        <CategoryPicker selected={selected} onChange={setSelected} />
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
