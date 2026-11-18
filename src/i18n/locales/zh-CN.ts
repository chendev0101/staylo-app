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
  a11y: {
    openLanguage: '更改语言',
    openDesignSystem: '打开设计系统浏览页',
    close: '关闭',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
  },
} satisfies Translations;
