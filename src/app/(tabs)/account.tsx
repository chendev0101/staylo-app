import { useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AuthErrorKey } from '@/auth/errors';
import { useGoogleSignIn } from '@/auth/google';
import { useSession } from '@/auth/session';
import { Avatar } from '@/components/account/avatar';
import { confirmDestructive } from '@/components/confirm';
import { WEB_TAB_BAR_INSET } from '@/components/tab-bar-inset';
import { ListGroup, ListRow } from '@/components/account/list-row';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { isLanguage } from '@/i18n/resolve';
import { LANGUAGE_NAMES } from '@/i18n/types';
import { useTravelPreferences } from '@/preferences/travel-preferences';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useSession();
  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerClassName="w-full max-w-[560px] gap-8 self-center px-5"
      contentContainerStyle={{ paddingTop: insets.top + 16 + WEB_TAB_BAR_INSET, paddingBottom: insets.bottom + 32 }}>
      {isSignedIn ? <ProfileHeader /> : <GuestCard />}
      <SettingsSection />
      {isSignedIn && <AccountActions />}
    </ScrollView>
  );
}

function ProfileHeader() {
  const { t } = useTranslation();
  const { user } = useUser();
  if (!user) return null;
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const name = user.fullName?.trim() || email.split('@')[0];
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-4">
        <Avatar uri={user.hasImage ? user.imageUrl : null} name={name} />
        <View className="flex-1 gap-1">
          <Text variant="headline" numberOfLines={1}>
            {name}
          </Text>
          <Text tone="muted" numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>
      <Button
        title={t('account.editProfile')}
        variant="secondary"
        size="sm"
        leadingIcon={{ ios: 'pencil', android: 'edit', web: 'edit' }}
        onPress={() => router.push('/profile/edit')}
        className="self-start"
      />
    </View>
  );
}

/** Guests: why to sign in, and both ways to do it. Signing in closes this state on its own. */
function GuestCard() {
  const { t } = useTranslation();
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

  return (
    <View className="gap-4 rounded-xl border border-border bg-surface p-5">
      <View className="gap-2">
        <Text variant="headline">{t('account.guestTitle')}</Text>
        <Text tone="muted">{t('account.guestBody')}</Text>
      </View>
      {error && <Alert tone="danger" message={t(`auth.errors.${error}`)} onDismiss={() => setError(null)} />}
      <View className="gap-2">
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
      </View>
    </View>
  );
}

function SettingsSection() {
  const { t, i18n } = useTranslation();
  const { categories } = useTravelPreferences();
  const language = isLanguage(i18n.language) ? LANGUAGE_NAMES[i18n.language] : i18n.language;
  const preferences = categories.length
    ? categories.map((c) => t(`category.${c}`)).join('、')
    : t('account.preferencesNone');

  return (
    <View className="gap-3">
      <Text variant="label" tone="muted">
        {t('account.settings')}
      </Text>
      <ListGroup>
        <ListRow
          icon={{ ios: 'globe', android: 'language', web: 'language' }}
          label={t('account.language')}
          value={language}
          onPress={() => router.push('/language')}
        />
        <ListRow
          icon={{ ios: 'heart', android: 'favorite', web: 'favorite' }}
          label={t('account.preferences')}
          value={preferences}
          onPress={() => router.push('/preferences-edit')}
          last
        />
      </ListGroup>
    </View>
  );
}

function AccountActions() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { signOut } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [failed, setFailed] = useState(false);

  // Deleting ends the session, so the root guard returns the app to onboarding.
  const deleteAccount = async () => {
    if (!user) return;
    setFailed(false);
    setDeleting(true);
    try {
      await user.delete();
    } catch (e) {
      if (__DEV__) console.warn('Delete account failed', e);
      setDeleting(false);
      setFailed(true);
    }
  };

  const confirmDelete = () =>
    confirmDestructive({
      title: t('account.deleteTitle'),
      message: t('account.deleteBody'),
      confirmLabel: t('account.deleteConfirm'),
      cancelLabel: t('account.cancel'),
      onConfirm: () => void deleteAccount(),
    });

  return (
    <View className="gap-3">
      {failed && <Alert tone="danger" message={t('account.deleteFailed')} onDismiss={() => setFailed(false)} />}
      <Button
        title={t('account.signOut')}
        variant="secondary"
        leadingIcon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
        disabled={deleting}
        onPress={signOut}
      />
      <Button title={t('account.deleteAccount')} variant="destructive" loading={deleting} onPress={confirmDelete} />
    </View>
  );
}
