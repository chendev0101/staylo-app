import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { ja } from './locales/ja';
import { zhCN } from './locales/zh-CN';
import { zhTW } from './locales/zh-TW';
import { resolveDeviceLanguage } from './resolve';
import { DEFAULT_LANGUAGE } from './types';

/** App i18n instance; initReactI18next makes it the one useTranslation() reads. */
export const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    'zh-TW': { translation: zhTW },
    en: { translation: en },
    ja: { translation: ja },
    'zh-CN': { translation: zhCN },
  },
  lng: resolveDeviceLanguage(getLocales()),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

