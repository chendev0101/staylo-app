import { useUnstableNativeVariable } from 'nativewind';

import type { ColorToken } from './tokens';

// The package's typings resolve to the web stub (`() => never`); the native
// implementation takes a variable name, so restate its real signature.
const useNativeVariable = useUnstableNativeVariable as unknown as (name: string) => unknown;

/**
 * Resolves a color token to a value for props that can't take className
 * (icon tintColor, placeholderTextColor, ActivityIndicator color).
 * Re-renders when the color scheme changes. Web version: use-token-color.web.ts.
 */
export function useTokenColor(token: ColorToken): string {
  return useNativeVariable(`--color-${token}`) as string;
}
