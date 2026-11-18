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
  a11y: {
    openLanguage: '變更語言',
    openDesignSystem: '開啟設計系統瀏覽頁',
    close: '關閉',
    showPassword: '顯示密碼',
    hidePassword: '隱藏密碼',
  },
} as const;
