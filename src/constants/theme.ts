import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#6B6B6B',
    background: '#FFFFFF',
    surface: '#F4F4F5',
    border: '#E4E4E7',
    primary: '#208AEF',
    onPrimary: '#FFFFFF',
    favorite: '#FF385C',
  },
  dark: {
    text: '#F4F4F5',
    textSecondary: '#A1A1AA',
    background: '#0B0B0C',
    surface: '#1C1C1F',
    border: '#2E2E33',
    primary: '#4BA3F5',
    onPrimary: '#FFFFFF',
    favorite: '#FF5A75',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export function useThemeColors(): ThemeColors {
  return Colors[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
