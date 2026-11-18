import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Appearance, Platform } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import type { IconName } from '@/components/ui/icon';

type Mode = 'system' | 'light' | 'dark';

const NEXT: Record<Mode, Mode> = { system: 'light', light: 'dark', dark: 'system' };

const ICONS: Record<Mode, IconName> = {
  system: { ios: 'circle.lefthalf.filled', android: 'contrast', web: 'contrast' },
  light: { ios: 'sun.max', android: 'light_mode', web: 'light_mode' },
  dark: { ios: 'moon', android: 'dark_mode', web: 'dark_mode' },
};

// Module-level so the mode survives navigating between screens.
let currentMode: Mode = 'system';

/**
 * Dev-only: cycles the app appearance system → light → dark without touching
 * the phone's settings. Renders nothing in production builds.
 * Native only (hidden on web) — on web, use DevTools › Rendering › prefers-color-scheme.
 */
export function DevAppearanceToggle() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>(currentMode);

  // react-native-web has no Appearance.setColorScheme; on web use DevTools instead.
  if (!__DEV__ || Platform.OS === 'web') return null;

  const cycle = () => {
    const next = NEXT[mode];
    currentMode = next;
    setMode(next);
    Appearance.setColorScheme(next === 'system' ? 'unspecified' : next);
  };

  return (
    <IconButton
      icon={ICONS[mode]}
      accessibilityLabel={t('a11y.toggleAppearance', { mode: t(`appearance.${mode}`) })}
      onPress={cycle}
    />
  );
}
