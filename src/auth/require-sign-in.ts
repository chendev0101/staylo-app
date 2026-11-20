import { router } from 'expo-router';

import { useSession } from './session';

/**
 * Actions guests can't take. Browsing listings and keyword search stay open to everyone;
 * these need an account (and their API routes reject requests without a Clerk session).
 */
export type SignInReason = 'aiSearch' | 'policy' | 'booking';

/**
 * Call before a signed-in-only action: `if (!requireSignIn('booking')) return;`
 * Guests get the sign-in modal with a line explaining why; it closes itself after sign-in.
 */
export function useRequireSignIn() {
  const { isSignedIn } = useSession();
  return (reason: SignInReason): boolean => {
    if (isSignedIn) return true;
    router.push({ pathname: '/sign-in', params: { reason } });
    return false;
  };
}
