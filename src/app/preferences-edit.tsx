import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/preferences/category-picker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTravelPreferences, type PreferredCategory } from '@/preferences/travel-preferences';

/** Travel preferences from settings. Unlike onboarding, an empty choice is allowed. */
export default function PreferencesEditScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { categories, save } = useTravelPreferences();
  const [selected, setSelected] = useState<PreferredCategory[]>(categories);

  return (
    <View className="flex-1 bg-bg" style={{ paddingBottom: insets.bottom + 16 }}>
      <ScrollView contentContainerClassName="w-full max-w-[560px] gap-6 self-center px-5 pt-6">
        <Text tone="muted">{t('onboarding.preferences.subtitle')}</Text>
        <CategoryPicker selected={selected} onChange={setSelected} />
      </ScrollView>
      <View className="w-full max-w-[560px] self-center px-5 pt-4">
        <Button
          title={t('account.save')}
          onPress={() => {
            save(selected);
            router.back();
          }}
        />
      </View>
    </View>
  );
}
