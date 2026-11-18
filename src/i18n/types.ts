import type { zhTW } from './locales/zh-TW';

export const LANGUAGES = ['zh-TW', 'en', 'ja', 'zh-CN'] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'zh-TW';

/** Endonyms — each language's name in itself; never translated. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  'zh-TW': '繁體中文',
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
};

/** Content stored per language (mock data now; Sanity field-level i18n later). */
export type LocalizedText = Record<Language, string>;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
/** Shape every locale file must match. */
export type Translations = Widen<typeof zhTW>;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof zhTW };
  }
}
