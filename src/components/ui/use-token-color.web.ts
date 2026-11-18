import type { ColorToken } from './tokens';

/** On web the CSS variable itself is a valid color and follows the color scheme. */
export function useTokenColor(token: ColorToken): string {
  return `var(--color-${token})`;
}
