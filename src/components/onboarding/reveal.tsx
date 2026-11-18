import type { ReactNode } from 'react';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';

const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

/**
 * Fades + lifts its children in when `active` turns true (a CSS transition on the UI thread).
 * Reduced motion: opacity only, no translation.
 */
export function Reveal({
  active,
  delay = 0,
  offset = 24,
  children,
}: {
  active: boolean;
  delay?: number;
  offset?: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      style={{
        opacity: active ? 1 : 0,
        transform: [{ translateY: active || reduced ? 0 : offset }],
        transitionProperty: ['opacity', 'transform'],
        transitionDuration: reduced ? 200 : 450,
        transitionDelay: active ? delay : 0,
        transitionTimingFunction: EASE_OUT,
      }}>
      {children}
    </Animated.View>
  );
}
