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
  onboarding: {
    skip: 'スキップ',
    next: '次へ',
    start: 'はじめる',
    describe: {
      title: '理想の宿を、ひとことで',
      body: 'Staylo は必須条件と、求める雰囲気を見分けます。',
      query: '静かでペット可、温泉付きのキャビン、1泊5,000元以内',
      openQuote: '「',
      closeQuote: '」',
      tags: {
        cabin: 'キャビン',
        pets: 'ペット可',
        hotSpring: '温泉',
        budget: '5,000元以内',
        quiet: '静か',
      },
    },
    ranked: {
      title: '希望に合わせて並び替え',
      body: '必須条件は必ず満たし、「静か」「くつろげる」といった雰囲気も順位に反映します。',
      bestMatch: 'ベストマッチ',
    },
    policy: {
      title: 'ルールの質問には原文で回答',
      body: 'チェックイン、キャンセル、ペットのルールは出典つき。推測も言い換えもしません。',
      question: '犬を連れて行けますか？',
      answer: '「10kg以下のペット1匹まで可。事前にホストへご連絡ください。」',
      source: '出典：宿泊ルール',
    },
    preferences: {
      title: 'どんな宿が好きですか？',
      subtitle: 'いくつか選ぶと、優先しておすすめします。',
      continue: '続ける',
    },
    welcome: {
      createAccount: 'アカウント作成',
      signIn: 'ログイン',
      later: 'あとで',
      comingSoon: 'アカウント機能は近日公開',
    },
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
