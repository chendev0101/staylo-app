import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/components/ui/tokens';
import { useLanguagePreference, type LanguagePreference } from '@/i18n/language-preference';
import { LANGUAGE_NAMES, LANGUAGES } from '@/i18n/types';

export default function LanguageScreen() {
  const { t } = useTranslation();
  const { preference, systemLanguage, setPreference } = useLanguagePreference();

  const choose = (next: LanguagePreference) => {
    setPreference(next);
    if (router.canGoBack()) router.back();
  };

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="gap-5 px-5 pb-8 pt-6">
      <View className="gap-1">
        <Text variant="title">{t('language.title')}</Text>
        <Text tone="muted">{t('language.subtitle')}</Text>
      </View>

      <OptionCard
        selected={preference === 'system'}
        onPress={() => choose('system')}
        className="flex-row items-center gap-4">
        <View className="size-11 items-center justify-center rounded-full bg-secondary">
          <Icon
            name={{ ios: 'iphone', android: 'smartphone', web: 'devices' }}
            size={22}
            tone="on-secondary"
          />
        </View>
        <View className="flex-1">
          <Text variant="headline">{t('language.system')}</Text>
          <Text variant="caption" tone="muted">
            {t('language.systemCurrent', { language: LANGUAGE_NAMES[systemLanguage] })}
          </Text>
        </View>
      </OptionCard>

      <View className="flex-row flex-wrap gap-3">
        {LANGUAGES.map((language) => (
          <OptionCard
            key={language}
            selected={preference === language}
            onPress={() => choose(language)}
            className="min-h-24 grow basis-[40%] justify-between gap-3">
            <Text variant="headline">{LANGUAGE_NAMES[language]}</Text>
            {/* Name in the current UI language; skipped when it repeats the endonym. */}
            {t(`language.names.${language}`) !== LANGUAGE_NAMES[language] && (
              <Text variant="caption" tone="muted">
                {t(`language.names.${language}`)}
              </Text>
            )}
          </OptionCard>
        ))}
      </View>
    </ScrollView>
  );
}

function OptionCard({
  selected,
  onPress,
  className,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      className={cn(
        'rounded-xl border-2 bg-surface p-4 active:opacity-80',
        selected ? 'border-primary' : 'border-border',
        className,
      )}>
      {children}
      {selected && (
        <View className="absolute right-3 top-3 size-6 items-center justify-center rounded-full bg-primary">
          <Icon name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={14} tone="on-primary" />
        </View>
      )}
    </Pressable>
  );
}
