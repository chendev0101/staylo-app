import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTokenValue } from '@/components/ui/use-token-value';

const Image = styled(ExpoImage, { className: 'style' });

/** How far a photo drifts while its page scrolls away, as a fraction of the screen width. */
const DRIFT = 0.25;

/**
 * Full-screen photos behind the intro pager. Each photo crossfades into the next and drifts
 * slower than the swipe (parallax), driven by the pager's `progress` on the UI thread.
 * A top scrim keeps the status bar and top buttons legible on any photo.
 */
export function IntroBackdrop({ photos, progress }: { photos: string[]; progress: SharedValue<number> }) {
  const { width } = useWindowDimensions();
  const scrim = useTokenValue('scrim');
  return (
    <View className="absolute inset-0 overflow-hidden bg-surface-muted">
      {photos.map((uri, i) => (
        <Layer key={uri} uri={uri} index={i} width={width} progress={progress} />
      ))}
      {scrim ? (
        <Svg width="100%" height="30%" style={{ position: 'absolute', top: 0 }} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="intro-top-scrim" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={scrim} stopOpacity={1} />
              <Stop offset="1" stopColor={scrim} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#intro-top-scrim)" />
        </Svg>
      ) : null}
    </View>
  );
}

function Layer({
  uri,
  index,
  width,
  progress,
}: {
  uri: string;
  index: number;
  width: number;
  progress: SharedValue<number>;
}) {
  const reduced = useReducedMotion();
  const drift = reduced ? 0 : width * DRIFT;
  const style = useAnimatedStyle(() => {
    const range = [index - 1, index, index + 1];
    return {
      opacity: interpolate(progress.get(), range, [0, 1, 0], 'clamp'),
      transform: [{ translateX: interpolate(progress.get(), range, [drift, 0, -drift], 'clamp') }],
    };
  });
  // The layer overhangs both edges by the drift, so a drifting photo never shows its edge.
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { left: -drift, right: -drift }, style]}>
      <Image source={{ uri }} contentFit="cover" transition={300} className="absolute inset-0" />
    </Animated.View>
  );
}
