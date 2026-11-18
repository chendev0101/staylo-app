import type { Translations } from '../types';

export const zhCN = {
  home: {
    tagline: '找到你的下一个落脚处',
    searchPlaceholder: '搜索地点或房源',
    empty: '找不到符合条件的房源',
  },
  category: {
    all: '全部',
    apartment: '公寓',
    house: '独栋',
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
    title: '语言',
    subtitle: '选择 Staylo 使用的语言',
    names: {
      'zh-TW': '繁体中文',
      'en': '英文',
      'ja': '日文',
      'zh-CN': '简体中文',
    },
    system: '跟随系统',
    systemCurrent: '当前：{{language}}',
  },
  appearance: {
    system: '跟随系统',
    light: '浅色',
    dark: '深色',
  },
  onboarding: {
    skip: '跳过',
    next: '下一步',
    start: '开始',
    describe: {
      title: '一句话，说出理想住宿',
      body: 'Staylo 会分辨哪些是必要条件、哪些是你想要的感觉。',
      query: '安静、可带宠物、有温泉的小木屋，一晚 5,000 以内',
      openQuote: '“',
      closeQuote: '”',
      tags: {
        cabin: '小木屋',
        pets: '可带宠物',
        hotSpring: '温泉',
        budget: 'NT$5,000 以内',
        quiet: '安静',
      },
    },
    ranked: {
      title: '按你的需求排序',
      body: '硬性条件一定符合，「安静、舒适」这类感觉也会纳入排序。',
      bestMatch: '最符合',
    },
    policy: {
      title: '规定问题，原文回答',
      body: '入住、取消、宠物规定都附上出处，不猜测、不改写。',
      question: '可以带狗入住吗？',
      answer: '「可携带一只 10 公斤以下的宠物，需事先告知房东。」',
      source: '出处：房源规定',
    },
    preferences: {
      title: '你喜欢哪种住宿？',
      subtitle: '选几个你感兴趣的类型，我们会优先推荐。',
      continue: '继续',
    },
    welcome: {
      createAccount: '创建账号',
      signIn: '登录',
      later: '稍后再说',
      comingSoon: '账号功能即将推出',
    },
  },
  a11y: {
    toggleAppearance: '切换外观（开发用），当前：{{mode}}',
    openLanguage: '更改语言',
    openDesignSystem: '打开设计系统浏览页',
    close: '关闭',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
  },
} satisfies Translations;
