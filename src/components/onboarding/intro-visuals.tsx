import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { LISTINGS, type Listing } from '@/data/listings';
import { formatPrice } from '@/i18n/format';
import { localize } from '@/i18n/resolve';

import { PhotoHero } from './photo-hero';
import { Reveal } from './reveal';

const Image = styled(ExpoImage, { className: 'style' });

const cabin = LISTINGS[2]; // Alishan Forest Cabin
const ranked = [LISTINGS[2], LISTINGS[4], LISTINGS[1]];

type TagKey = 'cabin' | 'pets' | 'hotSpring' | 'budget' | 'quiet';
/** What Staylo reads out of the sentence: must-haves vs. the feel (soft intent). */
const TAGS: { key: TagKey; kind: 'must' | 'feel' }[] = [
  { key: 'cabin', kind: 'must' },
  { key: 'pets', kind: 'must' },
  { key: 'hotSpring', kind: 'must' },
  { key: 'budget', kind: 'must' },
  { key: 'quiet', kind: 'feel' },
];

/**
 * Page 1: a quiet cabin photo with the example sentence typing out over it like a
 * caption, then the constraints Staylo understands resolving underneath — one
 * orchestrated moment. The photo is the same listing the sentence describes.
 */
export function DescribeVisual({ active }: { active: boolean }) {
  const { t } = useTranslation();
  const query = t('onboarding.describe.query');
  const typed = useTypewriter(query, active);
  const done = typed.length >= query.length;

  return (
    <View className="w-full flex-1 gap-4">
      <PhotoHero uri={cabin.imageUrl}>
        <Text variant="title" tone="on-scrim" accessibilityLabel={query}>
          <Text variant="title" tone="primary">
            {t('onboarding.describe.openQuote')}
          </Text>
          {typed}
          <Text variant="title" tone="primary">
            {done ? t('onboarding.describe.closeQuote') : '|'}
          </Text>
        </Text>
      </PhotoHero>

      <View className="min-h-20 flex-row flex-wrap content-start gap-2">
        {TAGS.map((tag, i) => (
          <Reveal key={tag.key} active={active && done} delay={i * 90} offset={8}>
            <UnderstoodTag label={t(`onboarding.describe.tags.${tag.key}`)} kind={tag.kind} />
          </Reveal>
        ))}
      </View>
    </View>
  );
}

function UnderstoodTag({ label, kind }: { label: string; kind: 'must' | 'feel' }) {
  const must = kind === 'must';
  return (
    <View
      className={
        must
          ? 'flex-row items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2'
          : 'flex-row items-center gap-1.5 rounded-full bg-secondary px-3 py-2'
      }>
      <Icon
        name={
          must
            ? { ios: 'checkmark', android: 'check', web: 'check' }
            : { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }
        }
        size={14}
        tone={must ? 'primary' : 'on-secondary'}
      />
      <Text variant="label" tone={must ? 'default' : 'on-secondary'}>
        {label}
      </Text>
    </View>
  );
}

/** Page 2: compact listing rows stacking in, best match first. */
export function RankedVisual({ active }: { active: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="w-full gap-3">
      {ranked.map((listing, i) => (
        <Reveal key={listing.id} active={active} delay={i * 120}>
          <CompactListing listing={listing} badge={i === 0 ? t('onboarding.ranked.bestMatch') : undefined} />
        </Reveal>
      ))}
    </View>
  );
}

function CompactListing({ listing, badge }: { listing: Listing; badge?: string }) {
  const { i18n } = useTranslation();
  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-card">
      <Image source={{ uri: listing.imageUrl }} contentFit="cover" className="size-16 rounded-lg bg-surface-muted" />
      <View className="flex-1 gap-1">
        {badge && <Badge label={badge} tone="success" />}
        <Text variant="label" numberOfLines={1}>
          {localize(listing.title, i18n.language)}
        </Text>
        <Text variant="caption" tone="muted">
          {formatPrice(listing.pricePerNight, i18n.language)}
        </Text>
      </View>
    </View>
  );
}

/** Page 3: a guest question and an answer quoting the house rule, with its source. */
export function PolicyVisual({ active }: { active: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="w-full gap-3">
      <Reveal active={active}>
        <View className="max-w-[80%] self-end rounded-xl bg-primary px-4 py-3">
          <Text tone="on-primary">{t('onboarding.policy.question')}</Text>
        </View>
      </Reveal>
      <Reveal active={active} delay={200}>
        <View className="max-w-[90%] gap-2 self-start rounded-xl border border-border bg-surface p-4 shadow-card">
          <Text>{t('onboarding.policy.answer')}</Text>
          <View className="flex-row items-center gap-1">
            <Icon name={{ ios: 'doc.text', android: 'description', web: 'description' }} size={14} tone="fg-muted" />
            <Text variant="caption" tone="muted">
              {t('onboarding.policy.source')}
            </Text>
          </View>
        </View>
      </Reveal>
    </View>
  );
}

/** Types `text` out while `active`; shows it whole with reduced motion. */
function useTypewriter(text: string, active: boolean) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    // The whole sentence takes ~1.6s in any language (a text change, not a per-frame animation,
    // so the JS thread is fine here).
    const step = Math.max(20, Math.round(1600 / text.length));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, step);
    return () => {
      clearInterval(id);
      setCount(0);
    };
  }, [active, reduced, text]);

  return reduced ? text : text.slice(0, count);
}
