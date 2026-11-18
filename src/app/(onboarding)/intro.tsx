import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View, type FlatList } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { DescribeVisual, PolicyVisual, RankedVisual } from '@/components/onboarding/intro-visuals';
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
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}>
      <View className="flex-row items-center justify-between px-5 py-2">
        <IconButton
          icon={{ ios: 'globe', android: 'language', web: 'language' }}
          accessibilityLabel={t('a11y.openLanguage')}
          onPress={() => router.push('/language')}
        />
        <Button title={t('onboarding.skip')} variant="ghost" size="sm" onPress={finish} />
      </View>

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
            <View style={{ width, height: pageHeight }} className="items-center px-5 pb-2">
              {/* Capped width so tablets and wide web windows don't blow the visuals up. */}
              <View className="w-full max-w-[480px] flex-1 gap-6">
                <View className="flex-1 items-center justify-center">
                  <item.Visual active={page === index} />
                </View>
                <View className="gap-2">
                  <Text variant="title">{t(`onboarding.${item.key}.title`)}</Text>
                  <Text tone="muted">{t(`onboarding.${item.key}.body`)}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <View className="w-full max-w-[520px] gap-5 self-center px-5 pt-4">
        <PageDots count={PAGES.length} progress={progress} />
        <Button
          title={isLast ? t('onboarding.start') : t('onboarding.next')}
          trailingIcon={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
          onPress={next}
        />
      </View>
    </View>
  );
}
