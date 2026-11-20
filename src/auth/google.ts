import { useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { authErrorKey, type AuthErrorKey } from './errors';

type Result = { ok: true } | { ok: false; cancelled: true } | { ok: false; cancelled: false; error: AuthErrorKey };

/**
 * Google sign-in (or sign-up) through Clerk's browser OAuth flow. The redirect URL must be
 * allowed in the Clerk dashboard (Native applications → Redirect URLs).
 */
export function useGoogleSignIn() {
  const { startSSOFlow } = useSSO();

  // Android: preload the browser so the sheet opens faster.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  return async function signInWithGoogle(): Promise<Result> {
    try {
      const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri({ scheme: 'staylo', path: 'sso-callback' }),
      });
      if (createdSessionId && setActive) {
        // Activating the session flips the Stack.Protected guard; no navigation needed.
        await setActive({ session: createdSessionId });
        return { ok: true };
      }
      if (authSessionResult && authSessionResult.type !== 'success') return { ok: false, cancelled: true };
      // Signed in with Google but Clerk wants more fields; the dashboard should require none.
      return { ok: false, cancelled: false, error: 'generic' };
    } catch (e) {
      return { ok: false, cancelled: false, error: authErrorKey(e) };
    }
  };
}
