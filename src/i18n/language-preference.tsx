import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocales } from 'expo-localization';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { i18n } from './index';
import { isLanguage, resolveDeviceLanguage } from './resolve';
import type { Language } from './types';

export type LanguagePreference = 'system' | Language;

const STORAGE_KEY = 'staylo.language';

type Value = {
  /** False until the stored preference has been read. */
  loaded: boolean;
  preference: LanguagePreference;
  /** Language the device resolves to (shown next to "Follow system"). */
  systemLanguage: Language;
  setPreference: (preference: LanguagePreference) => void;
};

const LanguagePreferenceContext = createContext<Value | null>(null);

export function LanguagePreferenceProvider({ children }: { children: ReactNode }) {
  const systemLanguage = resolveDeviceLanguage(useLocales());
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');
  const [loaded, setLoaded] = useState(false);

  // Read the saved choice once. Storage failures fall back to the system language.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'system' || isLanguage(stored)) setPreferenceState(stored);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Apply the active language whenever the preference or the device language changes.
  const active = preference === 'system' ? systemLanguage : preference;
  useEffect(() => {
    if (i18n.language !== active) i18n.changeLanguage(active);
  }, [active]);

  const setPreference = (next: LanguagePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  return (
    <LanguagePreferenceContext value={{ loaded, preference, systemLanguage, setPreference }}>
      {children}
    </LanguagePreferenceContext>
  );
}

export function useLanguagePreference(): Value {
  const value = use(LanguagePreferenceContext);
  if (!value) throw new Error('useLanguagePreference must be used inside LanguagePreferenceProvider');
  return value;
}
