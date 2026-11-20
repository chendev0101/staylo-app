// Source of truth for UI copy. Every key here must exist in en.ts, ja.ts and zh-CN.ts
// (enforced by `satisfies Translations`).
export const zhTW = {
  home: {
    tagline: '找到你的下一個落腳處',
    searchPlaceholder: '搜尋地點或房源',
    empty: '找不到符合條件的房源',
  },
  category: {
    all: '全部',
    apartment: '公寓',
    house: '獨棟',
    cabin: '小木屋',
    ocean: '海景',
    pool: '泳池',
  },
  listing: {
    perNight: '/ 晚',
    addFavorite: '加入收藏',
    removeFavorite: '取消收藏',
  },
  language: {
    title: '語言',
    subtitle: '選擇 Staylo 使用的語言',
    names: {
      'zh-TW': '繁體中文',
      'en': '英文',
      'ja': '日文',
      'zh-CN': '簡體中文',
    },
    system: '跟隨系統',
    systemCurrent: '目前：{{language}}',
  },
  appearance: {
    system: '跟隨系統',
    light: '淺色',
    dark: '深色',
  },
  onboarding: {
    skip: '略過',
    next: '下一步',
    start: '開始',
    describe: {
      title: '一句話，說出理想住宿',
      body: 'Staylo 會分辨哪些是必要條件、哪些是你想要的感覺。',
      query: '安靜、可帶寵物、有溫泉的小木屋，一晚 5,000 內',
      openQuote: '「',
      closeQuote: '」',
      tags: {
        cabin: '小木屋',
        pets: '可帶寵物',
        hotSpring: '溫泉',
        budget: 'NT$5,000 以內',
        quiet: '安靜',
      },
    },
    ranked: {
      title: '依你的需求排序',
      body: '硬條件一定符合，「安靜、舒適」這類感覺也會納入排序。',
      bestMatch: '最符合',
    },
    policy: {
      title: '規定問題，原文回答',
      body: '入住、取消、寵物規定都附上出處，不猜測、不改寫。',
      question: '可以帶狗入住嗎？',
      answer: '「可攜帶一隻 10 公斤以下的寵物，需事先告知房東。」',
      source: '出處：房源規定',
    },
    preferences: {
      title: '你喜歡哪種住宿？',
      subtitle: '選幾個你感興趣的類型，我們會優先推薦。',
      continue: '繼續',
    },
    welcome: {
      google: '使用 Google 繼續',
      email: '使用 Email 繼續',
      later: '稍後再說',
    },
  },
  auth: {
    signIn: {
      title: '使用 Email 繼續',
      subtitle: '我們會寄 6 位數驗證碼給你。第一次使用會自動建立帳號。',
      emailPlaceholder: 'you@example.com',
      send: '傳送驗證碼',
    },
    verify: {
      title: '輸入驗證碼',
      subtitle: '驗證碼已寄到 {{email}}',
      codePlaceholder: '6 位數驗證碼',
      submit: '驗證',
      resend: '重新傳送',
      resendIn: '{{seconds}} 秒後可重新傳送',
      resent: '已重新寄出驗證碼',
      changeEmail: '更換 Email',
    },
    reason: {
      aiSearch: '登入後才能使用一句話搜尋',
      policy: '登入後才能詢問房源規定',
      booking: '登入後才能預訂房源',
    },
    errors: {
      invalidEmail: 'Email 格式不正確',
      wrongCode: '驗證碼不正確，請再試一次',
      expiredCode: '驗證碼已過期，請重新傳送',
      tooMany: '嘗試次數太多，請稍後再試',
      generic: '發生錯誤，請檢查網路後再試一次',
    },
  },
  a11y: {
    back: '返回',
    toggleAppearance: '切換外觀（開發用），目前：{{mode}}',
    openLanguage: '變更語言',
    openDesignSystem: '開啟設計系統瀏覽頁',
    close: '關閉',
    showPassword: '顯示密碼',
    hidePassword: '隱藏密碼',
  },
} as const;
