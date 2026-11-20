import { useSignIn, useSignUp } from '@clerk/expo';

import { authErrorKey, clerkErrorCode, type AuthErrorKey } from './errors';

/**
 * Without a `navigate` callback Clerk sends the browser to its after-sign-in URL ("/") on web.
 * Navigation belongs to the root layout's Stack.Protected guards, so finalizing stays put.
 */
const stayPut = () => {};

/** Which Clerk resource the code belongs to: an existing account, or a new one. */
export type EmailCodeMode = 'sign-in' | 'sign-up';

type Result<T = void> = { ok: true; value: T } | { ok: false; error: AuthErrorKey };

/**
 * Passwordless email code, signing in or up in one flow: the code is sent through a sign-in
 * first; if Clerk has no account for the email, the same email starts a sign-up instead.
 * Uses Clerk's Core 3 ("future") resources, which keep their state between screens.
 */
export function useEmailCode() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  /** Sends a code to `email` and says which flow it belongs to. */
  async function send(email: string): Promise<Result<EmailCodeMode>> {
    const signInResult = await signIn.emailCode.sendCode({ emailAddress: email });
    if (!signInResult.error) return { ok: true, value: 'sign-in' };
    if (clerkErrorCode(signInResult.error) !== 'form_identifier_not_found') {
      return { ok: false, error: authErrorKey(signInResult.error) };
    }

    const created = await signUp.create({ emailAddress: email });
    if (created.error) return { ok: false, error: authErrorKey(created.error) };
    const sent = await signUp.verifications.sendEmailCode();
    if (sent.error) return { ok: false, error: authErrorKey(sent.error) };
    return { ok: true, value: 'sign-up' };
  }

  /** Sends another code for the flow already in progress. */
  async function resend(mode: EmailCodeMode, email: string): Promise<Result> {
    const { error } =
      mode === 'sign-in'
        ? await signIn.emailCode.sendCode({ emailAddress: email })
        : await signUp.verifications.sendEmailCode();
    return error ? { ok: false, error: authErrorKey(error) } : { ok: true, value: undefined };
  }

  /**
   * Checks the code and activates the session. Activation flips the root layout's guards.
   *
   * `beforeActivate` runs once the code is accepted, just before activation. The sign-in modal
   * closes itself there: if the guard removed the screen the user is on, expo-router would reset
   * to the first available route, so a guest signing in from the account tab would land on
   * Explore instead of returning to the account tab.
   */
  async function verify(mode: EmailCodeMode, code: string, beforeActivate?: () => void): Promise<Result> {
    if (mode === 'sign-in') {
      const verified = await signIn.emailCode.verifyCode({ code });
      if (verified.error) return { ok: false, error: authErrorKey(verified.error) };
      if (signIn.status !== 'complete') return { ok: false, error: 'generic' };
      beforeActivate?.();
      const done = await signIn.finalize({ navigate: stayPut });
      return done.error ? { ok: false, error: authErrorKey(done.error) } : { ok: true, value: undefined };
    }

    const verified = await signUp.verifications.verifyEmailCode({ code });
    if (verified.error) return { ok: false, error: authErrorKey(verified.error) };
    if (signUp.status !== 'complete') {
      // e.g. the Clerk app requires more fields than the email (names, legal consent).
      if (__DEV__) console.warn('Sign-up incomplete; missing:', signUp.missingFields);
      return { ok: false, error: 'generic' };
    }
    beforeActivate?.();
    const done = await signUp.finalize({ navigate: stayPut });
    return done.error ? { ok: false, error: authErrorKey(done.error) } : { ok: true, value: undefined };
  }

  return { send, resend, verify };
}
