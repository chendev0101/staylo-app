import { useSyncExternalStore } from 'react';

import type { ColorToken } from '@/components/ui/tokens';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/** Current value of a color token, read from the CSS variable; updates with the color scheme. */
export function useTokenValue(token: ColorToken): string {
  return useSyncExternalStore(
    subscribe,
    () => getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim(),
    () => '', // server render: no computed styles
  );
}
