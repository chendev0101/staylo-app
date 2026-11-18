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
  onboarding: {
    skip: 'Skip',
    next: 'Next',
    start: 'Get started',
    describe: {
      title: 'Describe your ideal stay in one sentence',
      body: 'Staylo tells your must-haves apart from the feel you’re after.',
      query: 'A quiet, pet-friendly cabin with a hot spring, under NT$5,000 a night',
      openQuote: '“',
      closeQuote: '”',
      tags: {
        cabin: 'Cabin',
        pets: 'Pets allowed',
        hotSpring: 'Hot spring',
        budget: 'Under NT$5,000',
        quiet: 'Quiet',
      },
    },
    ranked: {
      title: 'Ranked by what you asked for',
      body: 'Hard requirements always match, and feelings like "quiet" or "cozy" shape the order.',
      bestMatch: 'Best match',
    },
    policy: {
      title: 'House rules, answered word for word',
      body: 'Check-in, cancellation and pet rules come with their source. No guessing, no rewording.',
      question: 'Can I bring my dog?',
      answer: '"One pet under 10 kg is allowed. Please let the host know in advance."',
      source: 'Source: house rules',
    },
    preferences: {
      title: 'What kind of stays do you like?',
      subtitle: 'Pick a few and we\'ll show those first.',
      continue: 'Continue',
    },
    welcome: {
      createAccount: 'Create account',
      signIn: 'Sign in',
      later: 'Maybe later',
      comingSoon: 'Accounts are coming soon',
    },
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
