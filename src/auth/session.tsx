/**
 * Session — MOCK until Clerk is set up (AGENTS.md: Clerk owns auth).
 * Screens only use useSession(); the Clerk plan replaces this implementation
 * behind the same hook without touching the screens.
 *
 * - isSignedIn: persisted (AsyncStorage `staylo.session`).
 * - isGuest: "Maybe later" — memory only, so onboarding returns on the next cold start.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'staylo.session';

type Session = {
  /** False until the stored session has been read. */
  loaded: boolean;
  isSignedIn: boolean;
  isGuest: boolean;
  signIn: () => void;
  continueAsGuest: () => void;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setIsSignedIn(stored === 'signed-in'))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const signIn = () => {
    setIsSignedIn(true);
    AsyncStorage.setItem(STORAGE_KEY, 'signed-in').catch(() => {});
  };

  const continueAsGuest = () => setIsGuest(true);

  const signOut = () => {
    setIsSignedIn(false);
    setIsGuest(false);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <SessionContext value={{ loaded, isSignedIn, isGuest, signIn, continueAsGuest, signOut }}>
      {children}
    </SessionContext>
  );
}

export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
