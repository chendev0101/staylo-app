import type { SymbolViewProps } from 'expo-symbols';

import type { LocalizedText } from '@/i18n/types';

export type CategoryId = 'all' | 'apartment' | 'house' | 'cabin' | 'ocean' | 'pool';

/** Labels come from t('category.<id>'). */
export type Category = {
  id: CategoryId;
  icon: SymbolViewProps['name'];
};

export type Listing = {
  id: string;
  title: LocalizedText;
  location: LocalizedText;
  pricePerNight: number; // TWD
  rating: number;
  reviews: number;
  imageUrl: string;
  categories: CategoryId[];
};

export const CATEGORIES: Category[] = [
  { id: 'all', icon: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' } },
  { id: 'apartment', icon: { ios: 'building.2', android: 'apartment', web: 'apartment' } },
  { id: 'house', icon: { ios: 'house', android: 'house', web: 'house' } },
  { id: 'cabin', icon: { ios: 'tree', android: 'cabin', web: 'cabin' } },
  { id: 'ocean', icon: { ios: 'water.waves', android: 'waves', web: 'waves' } },
  { id: 'pool', icon: { ios: 'figure.pool.swim', android: 'pool', web: 'pool' } },
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// Mock data — replace with Sanity (field-level localized) once the backend exists.
export const LISTINGS: Listing[] = [
  {
    id: '1',
    title: {
      'zh-TW': '信義區景觀公寓',
      en: 'Xinyi Skyline Apartment',
      ja: '信義区の眺望アパート',
      'zh-CN': '信义区景观公寓',
    },
    location: {
      'zh-TW': '台北市・信義區',
      en: 'Xinyi District, Taipei',
      ja: '台北市・信義区',
      'zh-CN': '台北市・信义区',
    },
    pricePerNight: 3200,
    rating: 4.92,
    reviews: 128,
    imageUrl: unsplash('photo-1502672260266-1c1ef2d93688'),
    categories: ['apartment'],
  },
  {
    id: '2',
    title: {
      'zh-TW': '墾丁海景泳池別墅',
      en: 'Kenting Ocean-View Pool Villa',
      ja: '墾丁オーシャンビュープールヴィラ',
      'zh-CN': '垦丁海景泳池别墅',
    },
    location: {
      'zh-TW': '屏東縣・恆春鎮',
      en: 'Hengchun, Pingtung',
      ja: '屏東県・恒春鎮',
      'zh-CN': '屏东县・恒春镇',
    },
    pricePerNight: 8800,
    rating: 4.88,
    reviews: 64,
    imageUrl: unsplash('photo-1512917774080-9991f1c4c750'),
    categories: ['house', 'ocean', 'pool'],
  },
  {
    id: '3',
    title: {
      'zh-TW': '阿里山森林小木屋',
      en: 'Alishan Forest Cabin',
      ja: '阿里山の森のキャビン',
      'zh-CN': '阿里山森林小木屋',
    },
    location: {
      'zh-TW': '嘉義縣・阿里山鄉',
      en: 'Alishan, Chiayi',
      ja: '嘉義県・阿里山郷',
      'zh-CN': '嘉义县・阿里山乡',
    },
    pricePerNight: 4500,
    rating: 4.95,
    reviews: 211,
    imageUrl: unsplash('photo-1510798831971-661eb04b3739'),
    categories: ['cabin', 'house'],
  },
  {
    id: '4',
    title: {
      'zh-TW': '台中文青設計宅',
      en: 'Taichung Designer Loft',
      ja: '台中のデザイナーズハウス',
      'zh-CN': '台中文青设计宅',
    },
    location: {
      'zh-TW': '台中市・西區',
      en: 'West District, Taichung',
      ja: '台中市・西区',
      'zh-CN': '台中市・西区',
    },
    pricePerNight: 2600,
    rating: 4.79,
    reviews: 93,
    imageUrl: unsplash('photo-1522708323590-d24dbb6b0267'),
    categories: ['apartment'],
  },
  {
    id: '5',
    title: {
      'zh-TW': '花蓮海岸獨棟民宿',
      en: 'Hualien Coastal House',
      ja: '花蓮の海辺の一軒家民宿',
      'zh-CN': '花莲海岸独栋民宿',
    },
    location: {
      'zh-TW': '花蓮縣・壽豐鄉',
      en: 'Shoufeng, Hualien',
      ja: '花蓮県・寿豊郷',
      'zh-CN': '花莲县・寿丰乡',
    },
    pricePerNight: 5200,
    rating: 4.9,
    reviews: 157,
    imageUrl: unsplash('photo-1570129477492-45c003edd2be'),
    categories: ['house', 'ocean'],
  },
  {
    id: '6',
    title: {
      'zh-TW': '宜蘭田園泳池會館',
      en: 'Yilan Countryside Pool House',
      ja: '宜蘭の田園プールハウス',
      'zh-CN': '宜兰田园泳池会馆',
    },
    location: {
      'zh-TW': '宜蘭縣・礁溪鄉',
      en: 'Jiaoxi, Yilan',
      ja: '宜蘭県・礁渓郷',
      'zh-CN': '宜兰县・礁溪乡',
    },
    pricePerNight: 7600,
    rating: 4.84,
    reviews: 75,
    imageUrl: unsplash('photo-1600596542815-ffad4c1539a9'),
    categories: ['house', 'pool'],
  },
];
