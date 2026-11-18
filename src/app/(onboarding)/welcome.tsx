import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/auth/session';
import { Reveal } from '@/components/onboarding/reveal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LISTINGS } from '@/data/listings';

const Image = styled(ExpoImage, { className: 'style' });
const hero = LISTINGS[1];

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { signIn, continueAsGuest } = useSession();

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
        {/* Mock auth until Clerk: both buttons sign in locally. */}
        <Button title={t('onboarding.welcome.createAccount')} onPress={signIn} />
        <Button title={t('onboarding.welcome.signIn')} variant="secondary" onPress={signIn} />
        <Button title={t('onboarding.welcome.later')} variant="ghost" onPress={continueAsGuest} />
        <Text variant="caption" tone="muted" className="text-center">
          {t('onboarding.welcome.comingSoon')}
        </Text>
      </View>
    </View>
  );
}
