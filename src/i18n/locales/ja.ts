import type { Translations } from '../types';

export const ja = {
  home: {
    tagline: '次の滞在先を見つけよう',
    searchPlaceholder: '場所や宿を検索',
    empty: '条件に合う宿が見つかりません',
  },
  category: {
    all: 'すべて',
    apartment: 'アパート',
    house: '一軒家',
    cabin: 'キャビン',
    ocean: 'オーシャンビュー',
    pool: 'プール',
  },
  listing: {
    perNight: '/ 泊',
    addFavorite: 'お気に入りに追加',
    removeFavorite: 'お気に入りから削除',
  },
  language: {
    title: '言語',
    subtitle: 'Staylo で使う言語を選択',
    names: {
      'zh-TW': '繁体字中国語',
      'en': '英語',
      'ja': '日本語',
      'zh-CN': '簡体字中国語',
    },
    system: 'システムに従う',
    systemCurrent: '現在：{{language}}',
  },
  appearance: {
    system: 'システム',
    light: 'ライト',
    dark: 'ダーク',
  },
  a11y: {
    toggleAppearance: '外観を切り替え（開発用）、現在：{{mode}}',
    openLanguage: '言語を変更',
    openDesignSystem: 'デザインシステムを開く',
    close: '閉じる',
    showPassword: 'パスワードを表示',
    hidePassword: 'パスワードを隠す',
  },
} satisfies Translations;
