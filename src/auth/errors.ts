import { isClerkAPIResponseError } from '@clerk/expo';

/** i18n keys under `auth.errors`. */
export type AuthErrorKey = 'invalidEmail' | 'wrongCode' | 'expiredCode' | 'tooMany' | 'generic';

/** The first Clerk error code in an error, if there is one. */
export function clerkErrorCode(error: unknown): string | undefined {
  if (isClerkAPIResponseError(error)) return error.errors[0]?.code;
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return undefined;
}

/** Maps a Clerk error to a message key the screens can show. */
export function authErrorKey(error: unknown): AuthErrorKey {
  const code = clerkErrorCode(error);
  if (__DEV__) console.warn('Auth error', code, error);
  switch (code) {
    case 'form_param_format_invalid':
    case 'form_identifier_invalid':
      return 'invalidEmail';
    case 'form_code_incorrect':
      return 'wrongCode';
    case 'verification_expired':
      return 'expiredCode';
    case 'action_blocked': // Clerk bot / abuse protection
    case 'too_many_requests':
    case 'verification_failed':
      return 'tooMany';
    default:
      return 'generic';
  }
}
