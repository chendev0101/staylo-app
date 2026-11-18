/**
 * Travel preferences picked during onboarding (favorite stay categories).
 * Stored on the device (AsyncStorage `staylo.preferences`). They order listings, never filter them.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import type { CategoryId } from '@/data/listings';

export type PreferredCategory = Exclude<CategoryId, 'all'>;

const STORAGE_KEY = 'staylo.preferences';

type Value = {
  loaded: boolean;
  /** True once the user saved preferences (even an empty skip is not saved). */
  hasSaved: boolean;
  categories: PreferredCategory[];
  save: (categories: PreferredCategory[]) => void;
  clear: () => void;
};

const TravelPreferencesContext = createContext<Value | null>(null);

export function TravelPreferencesProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [categories, setCategories] = useState<PreferredCategory[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCategories(parsed.filter((c): c is PreferredCategory => typeof c === 'string'));
          setHasSaved(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = (next: PreferredCategory[]) => {
    setCategories(next);
    setHasSaved(true);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const clear = () => {
    setCategories([]);
    setHasSaved(false);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <TravelPreferencesContext value={{ loaded, hasSaved, categories, save, clear }}>
      {children}
    </TravelPreferencesContext>
  );
}

export function useTravelPreferences(): Value {
  const value = use(TravelPreferencesContext);
  if (!value) throw new Error('useTravelPreferences must be used inside TravelPreferencesProvider');
  return value;
}
