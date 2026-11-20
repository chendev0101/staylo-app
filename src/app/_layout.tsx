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

import { SessionProvider, useSession } from '@/auth/session';
import { useTokenColor } from '@/components/ui/use-token-color';
import { LanguagePreferenceProvider, useLanguagePreference } from '@/i18n/language-preference';
import { TravelPreferencesProvider, useTravelPreferences } from '@/preferences/travel-preferences';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <LanguagePreferenceProvider>
      <SessionProvider>
        <TravelPreferencesProvider>
          <AppStack />
        </TravelPreferencesProvider>
      </SessionProvider>
    </LanguagePreferenceProvider>
  );
}

function AppStack() {
  const { t } = useTranslation();
  const { loaded: languageLoaded } = useLanguagePreference();
  const session = useSession();
  const { loaded: preferencesLoaded } = useTravelPreferences();
  // Onboarding shows whenever the user isn't signed in (and hasn't chosen "maybe later" this session).
  const entered = session.isSignedIn || session.isGuest;
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
  // Hold the splash screen until fonts, language, session and preferences are ready, so the
  // first screen never flashes the wrong font/language or shows onboarding to a signed-in user.
  const ready =
    (fontsLoaded || fontError !== null) && languageLoaded && session.loaded && preferencesLoaded;

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
          // iOS would label the back button with the previous route's title, and route groups
          // like (tabs) have none, so show the chevron only.
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: bg },
        }}>
        {/* Signed in or guest ("maybe later"): the app itself. */}
        <Stack.Protected guard={entered} redirectTo="/intro">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="design-system" options={{ headerShown: false }} />
          <Stack.Screen name="preferences-edit" options={{ title: t('account.preferences') }} />
        </Stack.Protected>
        {/* Signed in only. */}
        <Stack.Protected guard={session.isSignedIn} redirectTo="/account">
          <Stack.Screen name="profile/edit" options={{ title: t('account.editProfile') }} />
        </Stack.Protected>
        <Stack.Protected guard={!entered} redirectTo="/">
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack.Protected>
        {/* Sign-in modal (email + code in one route), opened from onboarding and by guests.
            Deliberately not guarded: when a guard removes the screen you're on, expo-router resets
            to the first route, which would drop a guest who signs in from the account tab onto
            Explore. The modal closes itself before the session activates instead. */}
        <Stack.Screen name="sign-in" options={{ headerShown: false, presentation: 'modal' }} />
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
