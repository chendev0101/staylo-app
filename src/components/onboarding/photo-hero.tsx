import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTokenValue } from '@/components/ui/use-token-value';

const Image = styled(ExpoImage, { className: 'style' });

/**
 * A full-bleed photo card with a bottom gradient scrim, so on-scrim text placed in
 * `children` stays legible on any photo. The gradient uses the scrim token.
 */
export function PhotoHero({ uri, children }: { uri: string; children?: ReactNode }) {
  const scrim = useTokenValue('scrim');
  return (
    <View className="w-full flex-1 overflow-hidden rounded-xl bg-surface-muted">
      <Image source={{ uri }} contentFit="cover" transition={300} className="absolute inset-0" />
      {scrim ? (
        <Svg width="100%" height="65%" style={{ position: 'absolute', bottom: 0 }} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="photo-hero-scrim" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={scrim} stopOpacity={0} />
              <Stop offset="0.55" stopColor={scrim} stopOpacity={0.9} />
              <Stop offset="1" stopColor={scrim} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#photo-hero-scrim)" />
        </Svg>
      ) : null}
      <View className="flex-1 justify-end p-5">{children}</View>
    </View>
  );
}
