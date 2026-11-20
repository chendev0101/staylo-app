import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View, type FlatList } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { IntroBackdrop } from '@/components/onboarding/intro-backdrop';
import {
  DescribeVisual,
  INTRO_PHOTOS,
  PolicyVisual,
  RankedVisual,
} from '@/components/onboarding/intro-visuals';
import { PageDots } from '@/components/onboarding/page-dots';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useTravelPreferences } from '@/preferences/travel-preferences';

const PAGES = [
  { key: 'describe', Visual: DescribeVisual },
  { key: 'ranked', Visual: RankedVisual },
  { key: 'policy', Visual: PolicyVisual },
] as const;

export default function IntroScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { hasSaved } = useTravelPreferences();
  const listRef = useRef<FlatList>(null);
  const [page, setPage] = useState(0);
  // Horizontal pages don't stretch to the list's height on every platform, so measure it once.
  const [pageHeight, setPageHeight] = useState(0);
  const progress = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    progress.set(e.contentOffset.x / width);
  });
  // Cross to the RN runtime only when the settled page changes, not per frame.
  useAnimatedReaction(
    () => Math.round(progress.get()),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setPage, current);
    },
  );

  const isLast = page === PAGES.length - 1;
  const finish = () => router.push(hasSaved ? '/welcome' : '/preferences');
  const next = () => {
    if (isLast) finish();
    else listRef.current?.scrollToIndex({ index: page + 1, animated: true });
  };

  return (
    <View className="flex-1 bg-surface">
      {/* The top of the screen is always a photo under a dark scrim. */}
      <StatusBar style="light" />
      <IntroBackdrop photos={INTRO_PHOTOS} progress={progress} />

      <View
        className="flex-row items-center justify-between px-5 py-2"
        style={{ paddingTop: insets.top + 8 }}>
        <IconButton
          icon={{ ios: 'globe', android: 'language', web: 'language' }}
          variant="overlay"
          accessibilityLabel={t('a11y.openLanguage')}
          onPress={() => router.push('/language')}
        />
        <Button title={t('onboarding.skip')} variant="overlay" size="sm" onPress={finish} />
      </View>

      {/* Pages carry only the floating hint; the photos and the text react to `progress`. */}
      <View className="flex-1" onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}>
        <Animated.FlatList
          ref={listRef}
          data={PAGES}
          keyExtractor={(p) => p.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          renderItem={({ item, index }) => (
            <View style={{ width, height: pageHeight }} className="items-center justify-end px-5 pb-6">
              <View className="w-full max-w-[380px]">
                <item.Visual active={page === index} />
              </View>
            </View>
          )}
        />
      </View>

      <View
        className="rounded-t-xl bg-surface px-5 pt-7"
        style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="w-full max-w-[480px] gap-6 self-center">
          <PageText progress={progress} page={page} />
          <PageDots count={PAGES.length} progress={progress} />
          <Button
            title={isLast ? t('onboarding.start') : t('onboarding.next')}
            trailingIcon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            onPress={next}
          />
        </View>
      </View>
    </View>
  );
}

/**
 * Title and body for every page stacked in one spot, crossfading with the swipe. The card
 * keeps the tallest block's height so the dots and button never jump between pages.
 */
function PageText({ progress, page }: { progress: SharedValue<number>; page: number }) {
  const { t } = useTranslation();
  const [heights, setHeights] = useState<number[]>([]);
  const minHeight = heights.length ? Math.max(...heights) : undefined;

  return (
    <View style={{ minHeight }}>
      {PAGES.map((p, i) => (
        <PageTextBlock
          key={p.key}
          index={i}
          progress={progress}
          hidden={i !== page}
          title={t(`onboarding.${p.key}.title`)}
          body={t(`onboarding.${p.key}.body`)}
          onHeight={(h) =>
            setHeights((prev) => {
              const nextHeights = [...prev];
              nextHeights[i] = h;
              return nextHeights;
            })
          }
        />
      ))}
    </View>
  );
}

function PageTextBlock({
  index,
  progress,
  title,
  body,
  hidden,
  onHeight,
}: {
  index: number;
  hidden: boolean;
  progress: SharedValue<number>;
  title: string;
  body: string;
  onHeight: (height: number) => void;
}) {
  const style = useAnimatedStyle(() => {
    // Fades out within the first third of a swipe and in during the last third, so two
    // blocks are never readable on top of each other.
    const distance = Math.abs(progress.get() - index);
    return { opacity: interpolate(distance, [0, 0.35, 0.65], [1, 0, 0], 'clamp') };
  });
  return (
    <Animated.View
      // The first block stays in flow to give the card a height on the very first frame.
      style={[index === 0 ? null : { position: 'absolute', top: 0, left: 0, right: 0 }, style]}
      onLayout={(e) => onHeight(e.nativeEvent.layout.height)}
      // Only the current page's text is read by screen readers.
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}
      className="gap-2">
      <Text variant="title">{title}</Text>
      <Text tone="muted">{body}</Text>
    </Animated.View>
  );
}
