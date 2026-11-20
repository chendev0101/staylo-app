/**
 * Session: Clerk is the source of truth (AGENTS.md: Clerk owns auth).
 * Screens only use useSession() for gating; sign-in flows live in src/auth/google.ts and
 * src/auth/email-code.ts.
 *
 * - isSignedIn: Clerk's session, persisted in the secure-store token cache.
 * - isGuest: "Maybe later", memory only, so onboarding returns on the next cold start.
 */
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { createContext, use, useState, type ReactNode } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

type Session = {
  /** False until Clerk has loaded the stored session. */
  loaded: boolean;
  isSignedIn: boolean;
  isGuest: boolean;
  continueAsGuest: () => void;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  if (!publishableKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Copy .env.example to .env and add the key from the Clerk dashboard.',
    );
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkSession>{children}</ClerkSession>
    </ClerkProvider>
  );
}

function ClerkSession({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  // Latch: once Clerk has loaded, stay "loaded". The root layout renders nothing until loaded,
  // so a brief reload (e.g. while a new session activates) would unmount the whole navigator
  // and reset navigation to the first route.
  const [loadedOnce, setLoadedOnce] = useState(false);
  if (isLoaded && !loadedOnce) setLoadedOnce(true);

  const value: Session = {
    loaded: loadedOnce || isLoaded,
    isSignedIn: isLoaded && !!isSignedIn,
    isGuest,
    continueAsGuest: () => setIsGuest(true),
    signOut: () => {
      setIsGuest(false);
      clerkSignOut().catch((e: unknown) => console.warn('Clerk sign-out failed', e));
    },
  };

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
