import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { useTokenColor } from '@/components/ui/use-token-color';

/** Pager dots; the active dot widens with the scroll position (UI thread, no re-renders). */
export function PageDots({ count, progress }: { count: number; progress: SharedValue<number> }) {
  return (
    <View className="flex-row items-center justify-center gap-2" accessibilityElementsHidden>
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} index={i} progress={progress} />
      ))}
    </View>
  );
}

function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const color = useTokenColor('primary');
  // Childless 8px dot in a tiny row: animating its width is cheap and keeps the pill radius
  // (scaleX would smear it). Inactive dots fade to 30%.
  const style = useAnimatedStyle(() => {
    const t = interpolate(progress.get(), [index - 1, index, index + 1], [0, 1, 0], 'clamp');
    return { width: 8 + 16 * t, opacity: 0.3 + 0.7 * t };
  });
  return <Animated.View style={[{ height: 8, borderRadius: 4, backgroundColor: color }, style]} />;
}
