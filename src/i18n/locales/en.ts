import type { Translations } from '../types';

export const en = {
  home: {
    tagline: 'Find your next place to stay',
    searchPlaceholder: 'Search places or stays',
    empty: 'No stays match your search',
  },
  category: {
    all: 'All',
    apartment: 'Apartments',
    house: 'Houses',
    cabin: 'Cabins',
    ocean: 'Ocean view',
    pool: 'Pools',
  },
  listing: {
    perNight: '/ night',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
  },
  language: {
    title: 'Language',
    subtitle: 'Choose the language Staylo uses',
    names: {
      'zh-TW': 'Traditional Chinese',
      'en': 'English',
      'ja': 'Japanese',
      'zh-CN': 'Simplified Chinese',
    },
    system: 'Follow system',
    systemCurrent: 'Currently: {{language}}',
  },
  appearance: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  a11y: {
    toggleAppearance: 'Toggle appearance (dev), currently: {{mode}}',
    openLanguage: 'Change language',
    openDesignSystem: 'Open design system gallery',
    close: 'Close',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
} satisfies Translations;
