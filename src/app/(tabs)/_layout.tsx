import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { useTokenColor } from '@/components/ui/use-token-color';

/** The platform's own tab bar. Tabs are peers, so switching never animates. */
export default function TabsLayout() {
  const { t } = useTranslation();
  const primary = useTokenColor('primary');
  return (
    <NativeTabs tintColor={primary}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="explore" />
        <NativeTabs.Trigger.Label>{t('tabs.explore')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
        />
        <NativeTabs.Trigger.Label>{t('tabs.account')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
