import '@/global.css';
import '@/i18n';

import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguagePreferenceProvider, useLanguagePreference } from '@/i18n/language-preference';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <LanguagePreferenceProvider>
      <AppStack />
    </LanguagePreferenceProvider>
  );
}

function AppStack() {
  const { t } = useTranslation();
  const { loaded: languageLoaded } = useLanguagePreference();
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });
  // Hold the splash screen until fonts and the saved language are ready,
  // so the first screen never flashes the wrong font or language.
  const ready = (fontsLoaded || fontError !== null) && languageLoaded;

  useEffect(() => {
    if (fontError) console.warn('Outfit failed to load, falling back to the system font:', fontError);
  }, [fontError]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="design-system" options={{ headerShown: false }} />
      <Stack.Screen
        name="language"
        options={{
          title: t('language.title'),
          headerShown: false, // the sheet shows its own title
          presentation: 'formSheet',
          sheetAllowedDetents: [0.65, 1],
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
