import { Image as ExpoImage } from 'expo-image';
import { styled } from 'nativewind';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/components/ui/tokens';
import { LISTINGS, type Listing } from '@/data/listings';
import { formatPrice } from '@/i18n/format';
import { localize } from '@/i18n/resolve';

import { Reveal } from './reveal';

const Image = styled(ExpoImage, { className: 'style' });

/** One photo per intro page, in page order. The cabin is the one the sentence describes. */
export const INTRO_PHOTOS = [LISTINGS[2].imageUrl, LISTINGS[1].imageUrl, LISTINGS[4].imageUrl];

const ranked = [LISTINGS[2], LISTINGS[4]];

type TagKey = 'cabin' | 'pets' | 'hotSpring' | 'budget' | 'quiet';
/** What Staylo reads out of the sentence: must-haves vs. the feel (soft intent). */
const TAGS: { key: TagKey; kind: 'must' | 'feel' }[] = [
  { key: 'cabin', kind: 'must' },
  { key: 'pets', kind: 'must' },
  { key: 'hotSpring', kind: 'must' },
  { key: 'budget', kind: 'must' },
  { key: 'quiet', kind: 'feel' },
];

/** Translucent panel for content floating on a photo. */
function Glass({ className, children }: { className?: string; children: ReactNode }) {
  return <View className={cn('rounded-xl bg-surface-glass shadow-raised', className)}>{children}</View>;
}

/** Page 1: the example sentence types itself out, then the constraints Staylo understood. */
export function DescribeVisual({ active }: { active: boolean }) {
  const { t } = useTranslation();
  const query = t('onboarding.describe.query');
  const typed = useTypewriter(query, active);
  const done = typed.length >= query.length;

  return (
    <Glass className="w-full gap-3 p-4">
      <Text variant="headline" accessibilityLabel={query}>
        <Text variant="headline" tone="primary">
          {t('onboarding.describe.openQuote')}
        </Text>
        {typed}
        <Text variant="headline" tone="primary">
          {done ? t('onboarding.describe.closeQuote') : '|'}
        </Text>
      </Text>
      <View className="min-h-16 flex-row flex-wrap content-start gap-1.5">
        {TAGS.map((tag, i) => (
          <Reveal key={tag.key} active={active && done} delay={i * 90} offset={8}>
            <UnderstoodTag label={t(`onboarding.describe.tags.${tag.key}`)} kind={tag.kind} />
          </Reveal>
        ))}
      </View>
    </Glass>
  );
}

function UnderstoodTag({ label, kind }: { label: string; kind: 'must' | 'feel' }) {
  const must = kind === 'must';
  return (
    <View
      className={
        must
          ? 'flex-row items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1.5'
          : 'flex-row items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5'
      }>
      <Icon
        name={
          must
            ? { ios: 'checkmark', android: 'check', web: 'check' }
            : { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }
        }
        size={12}
        tone={must ? 'primary' : 'on-secondary'}
      />
      <Text variant="caption" tone={must ? 'default' : 'on-secondary'}>
        {label}
      </Text>
    </View>
  );
}

/** Page 2: compact listing rows stacking in, best match first. */
export function RankedVisual({ active }: { active: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="w-full gap-2">
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
    <Glass className="flex-row items-center gap-3 p-2.5">
      <Image source={{ uri: listing.imageUrl }} contentFit="cover" className="size-14 rounded-lg bg-surface-muted" />
      <View className="flex-1 gap-1">
        {badge && <Badge label={badge} tone="success" />}
        <Text variant="label" numberOfLines={1}>
          {localize(listing.title, i18n.language)}
        </Text>
        <Text variant="caption" tone="muted">
          {formatPrice(listing.pricePerNight, i18n.language)}
        </Text>
      </View>
    </Glass>
  );
}

/** Page 3: a guest question and an answer quoting the house rule, with its source. */
export function PolicyVisual({ active }: { active: boolean }) {
  const { t } = useTranslation();
  return (
    <View className="w-full gap-2">
      <Reveal active={active}>
        <View className="max-w-[80%] self-end rounded-xl bg-primary px-4 py-2.5 shadow-raised">
          <Text variant="label" tone="on-primary">
            {t('onboarding.policy.question')}
          </Text>
        </View>
      </Reveal>
      <Reveal active={active} delay={200}>
        <Glass className="max-w-[90%] gap-2 self-start p-3.5">
          <Text variant="label">{t('onboarding.policy.answer')}</Text>
          <View className="flex-row items-center gap-1">
            <Icon name={{ ios: 'doc.text', android: 'description', web: 'description' }} size={14} tone="fg-muted" />
            <Text variant="caption" tone="muted">
              {t('onboarding.policy.source')}
            </Text>
          </View>
        </Glass>
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
