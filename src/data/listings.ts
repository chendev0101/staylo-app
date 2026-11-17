import type { SymbolViewProps } from 'expo-symbols';

export type CategoryId = 'all' | 'apartment' | 'house' | 'cabin' | 'ocean' | 'pool';

export type Category = {
  id: CategoryId;
  label: string;
  icon: SymbolViewProps['name'];
};

export type Listing = {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  categories: CategoryId[];
};

export const CATEGORIES: Category[] = [
  { id: 'all', label: '全部', icon: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' } },
  { id: 'apartment', label: '公寓', icon: { ios: 'building.2', android: 'apartment', web: 'apartment' } },
  { id: 'house', label: '獨棟', icon: { ios: 'house', android: 'house', web: 'house' } },
  { id: 'cabin', label: '小木屋', icon: { ios: 'tree', android: 'cabin', web: 'cabin' } },
  { id: 'ocean', label: '海景', icon: { ios: 'water.waves', android: 'waves', web: 'waves' } },
  { id: 'pool', label: '泳池', icon: { ios: 'figure.pool.swim', android: 'pool', web: 'pool' } },
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// Mock data — replace with an API call once the backend exists.
export const LISTINGS: Listing[] = [
  {
    id: '1',
    title: '信義區景觀公寓',
    location: '台北市・信義區',
    pricePerNight: 3200,
    rating: 4.92,
    reviews: 128,
    imageUrl: unsplash('photo-1502672260266-1c1ef2d93688'),
    categories: ['apartment'],
  },
  {
    id: '2',
    title: '墾丁海景泳池別墅',
    location: '屏東縣・恆春鎮',
    pricePerNight: 8800,
    rating: 4.88,
    reviews: 64,
    imageUrl: unsplash('photo-1512917774080-9991f1c4c750'),
    categories: ['house', 'ocean', 'pool'],
  },
  {
    id: '3',
    title: '阿里山森林小木屋',
    location: '嘉義縣・阿里山鄉',
    pricePerNight: 4500,
    rating: 4.95,
    reviews: 211,
    imageUrl: unsplash('photo-1564013799919-ab600027ffc6'),
    categories: ['cabin', 'house'],
  },
  {
    id: '4',
    title: '台中文青設計宅',
    location: '台中市・西區',
    pricePerNight: 2600,
    rating: 4.79,
    reviews: 93,
    imageUrl: unsplash('photo-1522708323590-d24dbb6b0267'),
    categories: ['apartment'],
  },
  {
    id: '5',
    title: '花蓮海岸獨棟民宿',
    location: '花蓮縣・壽豐鄉',
    pricePerNight: 5200,
    rating: 4.9,
    reviews: 157,
    imageUrl: unsplash('photo-1570129477492-45c003edd2be'),
    categories: ['house', 'ocean'],
  },
  {
    id: '6',
    title: '宜蘭田園泳池會館',
    location: '宜蘭縣・礁溪鄉',
    pricePerNight: 7600,
    rating: 4.84,
    reviews: 75,
    imageUrl: unsplash('photo-1600596542815-ffad4c1539a9'),
    categories: ['house', 'pool'],
  },
];
