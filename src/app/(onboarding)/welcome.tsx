import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AuthErrorKey } from '@/auth/errors';
import { useGoogleSignIn } from '@/auth/google';
import { useSession } from '@/auth/session';
import { Reveal } from '@/components/onboarding/reveal';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LISTINGS } from '@/data/listings';

const Image = styled(ExpoImage, { className: 'style' });
const hero = LISTINGS[1];

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useSession();
  const signInWithGoogle = useGoogleSignIn();
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);

  const onGoogle = async () => {
    setError(null);
    setGoogleBusy(true);
    const result = await signInWithGoogle();
    setGoogleBusy(false);
    if (!result.ok && !result.cancelled) setError(result.error);
  };

  // Entering the app flips the Stack.Protected guard in the root layout,
  // which swaps onboarding for home — no manual navigation needed.
  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1">
        <Image source={{ uri: hero.imageUrl }} contentFit="cover" className="absolute inset-0 bg-surface-muted" />
        <View className="absolute inset-0 justify-end bg-scrim px-5 pb-8">
          <Reveal active>
            <Text variant="display" tone="on-scrim">
              Staylo
            </Text>
            <Text variant="headline" tone="on-scrim">
              {t('home.tagline')}
            </Text>
          </Reveal>
        </View>
      </View>

      <View className="gap-2 px-5 pt-6" style={{ paddingBottom: insets.bottom + 16 }}>
        {error && (
          <Alert tone="danger" message={t(`auth.errors.${error}`)} onDismiss={() => setError(null)} className="mb-2" />
        )}
        {/* Placeholder icon: the official Google "G" mark isn't in assets/ yet. */}
        <Button
          title={t('onboarding.welcome.google')}
          leadingIcon={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
          loading={googleBusy}
          onPress={onGoogle}
        />
        <Button
          title={t('onboarding.welcome.email')}
          variant="secondary"
          leadingIcon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
          disabled={googleBusy}
          onPress={() => router.push('/sign-in')}
        />
        <Button title={t('onboarding.welcome.later')} variant="ghost" disabled={googleBusy} onPress={continueAsGuest} />
      </View>
    </View>
  );
}
