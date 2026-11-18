import '@/global.css';
import '@/i18n';

import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

import { useTokenColor } from '@/components/ui/use-token-color';
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
  // Navigation chrome (headers, sheets) follows the color scheme and uses our tokens;
  // without this React Navigation stays on its light theme (dark title on dark sheet).
  const scheme = useColorScheme();
  const surface = useTokenColor('surface');
  const fg = useTokenColor('fg');
  const bg = useTokenColor('bg');
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
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: surface },
          headerTintColor: fg,
          headerTitleStyle: { color: fg, fontFamily: 'Outfit_600SemiBold' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: bg },
        }}>
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
    </ThemeProvider>
  );
}
