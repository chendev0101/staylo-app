import type { ColorToken } from '@/components/ui/tokens';
import { useTokenColor } from '@/components/ui/use-token-color';

/** Current value of a color token, for display in the design-system gallery. */
export function useTokenValue(token: ColorToken): string {
  return String(useTokenColor(token) ?? '');
}
