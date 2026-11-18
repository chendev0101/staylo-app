import type { Locale } from 'expo-localization';

import { DEFAULT_LANGUAGE, LANGUAGES, type Language, type LocalizedText } from './types';

const TRADITIONAL_REGIONS = ['TW', 'HK', 'MO'];

function matchLocale(locale: Pick<Locale, 'languageCode' | 'languageScriptCode' | 'regionCode'>): Language | null {
  const code = locale.languageCode?.toLowerCase();
  if (code === 'en') return 'en';
  if (code === 'ja') return 'ja';
  if (code === 'zh') {
    if (locale.languageScriptCode === 'Hant') return 'zh-TW';
    if (locale.languageScriptCode === 'Hans') return 'zh-CN';
    return TRADITIONAL_REGIONS.includes(locale.regionCode ?? '') ? 'zh-TW' : 'zh-CN';
  }
  return null;
}

/** First device locale we support, in the user's preference order; otherwise zh-TW. */
export function resolveDeviceLanguage(locales: Locale[]): Language {
  for (const locale of locales) {
    const match = matchLocale(locale);
    if (match) return match;
  }
  return DEFAULT_LANGUAGE;
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/** Pick the text for a language, falling back to zh-TW. */
export function localize(text: LocalizedText, language: string): string {
  return isLanguage(language) ? text[language] : text[DEFAULT_LANGUAGE];
}
