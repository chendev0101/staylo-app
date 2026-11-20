import { useUser } from '@clerk/expo';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/account/avatar';
import { confirmDestructive } from '@/components/confirm';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';

type Status = { tone: 'success' | 'danger'; key: 'saved' | 'saveFailed' | 'photoFailed' } | null;

/** Name and profile photo, stored on the Clerk user. Signed-in only (root guard). */
export default function EditProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  if (!user) return null;
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const displayName = `${firstName} ${lastName}`.trim() || email.split('@')[0];
  const changed = firstName.trim() !== (user.firstName ?? '') || lastName.trim() !== (user.lastName ?? '');

  const saveName = async () => {
    setStatus(null);
    setSaving(true);
    try {
      await user.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      setStatus({ tone: 'success', key: 'saved' });
    } catch (e) {
      if (__DEV__) console.warn('Profile update failed', e);
      setStatus({ tone: 'danger', key: 'saveFailed' });
    } finally {
      setSaving(false);
    }
  };

  const setPhoto = async (file: string | null) => {
    setStatus(null);
    setPhotoBusy(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();
    } catch (e) {
      if (__DEV__) console.warn('Profile photo failed', e);
      setStatus({ tone: 'danger', key: 'photoFailed' });
    } finally {
      setPhotoBusy(false);
    }
  };

  const pickPhoto = async () => {
    // The system photo picker needs no permission prompt on iOS 14+ and Android 13+.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    const asset = result.canceled ? null : result.assets[0];
    if (!asset?.base64) return;
    await setPhoto(`data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`);
  };

  return (
    <ScrollView
      className="flex-1 bg-bg"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="w-full max-w-[560px] gap-6 self-center px-5 pt-6"
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
      <View className="items-center gap-3">
        <Pressable
          onPress={pickPhoto}
          disabled={photoBusy}
          accessibilityRole="button"
          accessibilityLabel={t('profile.changePhoto')}
          className="active:opacity-80">
          <Avatar uri={user.hasImage ? user.imageUrl : null} name={displayName} size="lg" />
        </Pressable>
        <View className="flex-row gap-2">
          <Button title={t('profile.changePhoto')} variant="secondary" size="sm" loading={photoBusy} onPress={pickPhoto} />
          {user.hasImage && (
            <Button
              title={t('profile.removePhoto')}
              variant="ghost"
              size="sm"
              disabled={photoBusy}
              onPress={() =>
                confirmDestructive({
                  title: t('profile.removePhotoTitle'),
                  message: t('profile.removePhotoBody'),
                  confirmLabel: t('profile.removePhotoConfirm'),
                  cancelLabel: t('account.cancel'),
                  onConfirm: () => void setPhoto(null),
                })
              }
            />
          )}
        </View>
      </View>

      <View className="gap-3">
        {/* Label stays visible once the field is filled; placeholders disappear. */}
        <View className="gap-1.5">
          <Text variant="label" tone="muted">
            {t('profile.firstName')}
          </Text>
          <TextField
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('profile.firstName')}
            accessibilityLabel={t('profile.firstName')}
            autoComplete="given-name"
            textContentType="givenName"
          />
        </View>
        <View className="gap-1.5">
          <Text variant="label" tone="muted">
            {t('profile.lastName')}
          </Text>
          <TextField
            value={lastName}
            onChangeText={setLastName}
            placeholder={t('profile.lastName')}
            accessibilityLabel={t('profile.lastName')}
            autoComplete="family-name"
            textContentType="familyName"
          />
        </View>
        {status && (
          <Alert tone={status.tone} message={t(`profile.${status.key}`)} onDismiss={() => setStatus(null)} />
        )}
        <Button title={t('profile.save')} loading={saving} disabled={!changed} onPress={saveName} />
      </View>
    </ScrollView>
  );
}
