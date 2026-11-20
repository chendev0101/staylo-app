import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEmailCode, type EmailCodeMode } from '@/auth/email-code';
import type { AuthErrorKey } from '@/auth/errors';
import type { SignInReason } from '@/auth/require-sign-in';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REASONS: SignInReason[] = ['aiSearch', 'policy', 'booking'];
const CODE_LENGTH = 6;
/** Matches Clerk's resend cooldown for its own components. */
const RESEND_SECONDS = 30;

type Sent = { email: string; mode: EmailCodeMode };

/**
 * The sign-in modal: email, then the 6-digit code, as two steps of ONE route. Keeping it one
 * route means closing it is a single "back", which also returns guests to where they opened it.
 */
export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  // Set when a signed-in-only action sent the guest here (useRequireSignIn).
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const why = REASONS.find((r) => r === reason);
  const [sent, setSent] = useState<Sent | null>(null);

  return (
    <ScrollView
      className="flex-1 bg-bg"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="w-full max-w-[480px] gap-6 self-center px-5"
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }}>
      {sent ? (
        <CodeStep sent={sent} onChangeEmail={() => setSent(null)} />
      ) : (
        <EmailStep reason={why} onSent={setSent} />
      )}
    </ScrollView>
  );
}

/** Closes the modal; the user is back on the screen that opened it. */
function close() {
  if (router.canGoBack()) router.back();
  // Opened directly by URL with nothing underneath: the root guards decide where home is.
  else router.replace('/');
}

function EmailStep({ reason, onSent }: { reason?: SignInReason; onSent: (sent: Sent) => void }) {
  const { t } = useTranslation();
  const { send } = useEmailCode();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);

  const submit = async () => {
    const address = email.trim();
    if (!EMAIL.test(address)) {
      setError('invalidEmail');
      return;
    }
    setError(null);
    setBusy(true);
    const result = await send(address);
    setBusy(false);
    if (!result.ok) setError(result.error);
    else onSent({ email: address, mode: result.value });
  };

  return (
    <>
      <IconButton
        icon={{ ios: 'xmark', android: 'close', web: 'close' }}
        accessibilityLabel={t('a11y.close')}
        onPress={close}
        className="self-start"
      />
      {reason && (
        <View className="flex-row items-center gap-2 self-start rounded-full bg-secondary px-3 py-2">
          <Icon name={{ ios: 'lock', android: 'lock', web: 'lock' }} size={14} tone="on-secondary" />
          <Text variant="label" tone="on-secondary">
            {t(`auth.reason.${reason}`)}
          </Text>
        </View>
      )}
      <View className="gap-2">
        <Text variant="title">{t('auth.signIn.title')}</Text>
        <Text tone="muted">{t('auth.signIn.subtitle')}</Text>
      </View>
      <View className="gap-3">
        <TextField
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          placeholder={t('auth.signIn.emailPlaceholder')}
          leadingIcon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={submit}
          autoFocus
        />
        {error && <Alert tone="danger" message={t(`auth.errors.${error}`)} />}
        <Button title={t('auth.signIn.send')} loading={busy} disabled={!email.trim()} onPress={submit} />
        {/* Sign-ups start here. On web, Clerk's bot protection may show a challenge, and legacy
            protection mounts its CAPTCHA here. iOS and Android are never challenged. */}
        <View nativeID="clerk-captcha" />
      </View>
    </>
  );
}

function CodeStep({ sent, onChangeEmail }: { sent: Sent; onChangeEmail: () => void }) {
  const { t } = useTranslation();
  const { verify, resend } = useEmailCode();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [notice, setNotice] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const submit = async (value = code) => {
    if (value.length !== CODE_LENGTH || busy) return;
    setError(null);
    setNotice(false);
    setBusy(true);
    // Close the modal before the session activates: if a guard removed the screen the user is
    // on, expo-router would reset to the first route instead of returning them where they were.
    const result = await verify(sent.mode, value, close);
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      setCode('');
    }
  };

  const onResend = async () => {
    setError(null);
    setNotice(false);
    setCooldown(RESEND_SECONDS);
    const result = await resend(sent.mode, sent.email);
    if (result.ok) setNotice(true);
    else setError(result.error);
  };

  return (
    <>
      <IconButton
        icon={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        accessibilityLabel={t('a11y.back')}
        onPress={onChangeEmail}
        disabled={busy}
        className="self-start"
      />
      <View className="gap-2">
        <Text variant="title">{t('auth.verify.title')}</Text>
        <Text tone="muted">{t('auth.verify.subtitle', { email: sent.email })}</Text>
      </View>
      <View className="gap-3">
        <TextField
          value={code}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
            setCode(digits);
            if (error) setError(null);
            // Autofill or the last digit typed: verify right away.
            if (digits.length === CODE_LENGTH) void submit(digits);
          }}
          placeholder={t('auth.verify.codePlaceholder')}
          leadingIcon={{ ios: 'lock', android: 'lock', web: 'lock' }}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={CODE_LENGTH}
          autoFocus
        />
        {error && <Alert tone="danger" message={t(`auth.errors.${error}`)} />}
        {notice && <Alert tone="success" message={t('auth.verify.resent')} onDismiss={() => setNotice(false)} />}
        <Button
          title={t('auth.verify.submit')}
          loading={busy}
          disabled={code.length !== CODE_LENGTH}
          onPress={() => submit()}
        />
        <View className="flex-row flex-wrap items-center justify-between">
          <Button
            title={cooldown > 0 ? t('auth.verify.resendIn', { seconds: cooldown }) : t('auth.verify.resend')}
            variant="ghost"
            size="sm"
            disabled={cooldown > 0 || busy}
            onPress={onResend}
          />
          <Button
            title={t('auth.verify.changeEmail')}
            variant="ghost"
            size="sm"
            disabled={busy}
            onPress={onChangeEmail}
          />
        </View>
      </View>
    </>
  );
}
