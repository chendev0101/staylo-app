import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTokenValue } from '@/components/design-system/use-token-value';
import { DevAppearanceToggle } from '@/components/dev-appearance-toggle';
import { ListingCard } from '@/components/listing-card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Text, type TextVariant } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import type { ColorToken } from '@/components/ui/tokens';
import { CATEGORIES, LISTINGS } from '@/data/listings';

/**
 * Design-system gallery: every token and ui/ component on one page.
 * Add new components and tokens here when they're created.
 */
export default function DesignSystemScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerClassName="gap-6 p-5"
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}>
      <View className="flex-row items-start gap-3">
        <IconButton
          icon={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
          accessibilityLabel="返回首頁"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
        <View className="flex-1 gap-1">
          <Text variant="display">Staylo Design System</Text>
          <Text tone="muted">Tokens and shared components · light and dark follow the system setting</Text>
        </View>
        <DevAppearanceToggle />
      </View>

      <View className="flex-row flex-wrap gap-4">
        <BrandSection />
        <PaletteSection />
        <TypographySection />
        <ButtonsSection />
        <IconButtonsSection />
        <InputsSection />
        <ChipsSection />
        <ListingSection />
        <BadgesSection />
        <AlertsSection />
        <RadiusSection />
        <SpacingSection />
        <IconographySection />
      </View>
    </ScrollView>
  );
}

function Section({ n, title, children, wide }: { n: string; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <View
      // grow + max-w-full: several columns on wide screens, one full-width column on phones.
      className={`max-w-full grow gap-4 rounded-xl border border-border bg-surface p-5 ${wide ? 'basis-[700px]' : 'basis-[340px]'}`}>
      <Text variant="headline">
        {n}. {title}
      </Text>
      {children}
    </View>
  );
}

function BrandSection() {
  return (
    <Section n="01" title="Brand">
      <Text variant="display" tone="primary">
        Staylo
      </Text>
      <Text variant="headline" tone="muted">
        找到你的下一個落腳處
      </Text>
    </Section>
  );
}

// Literal bg-* classes so Tailwind can find them; values come from global.css.
const palette: { token: ColorToken; bg: string; name: string; role: string }[] = [
  { token: 'primary', bg: 'bg-primary', name: 'Coral', role: '主要按鈕、選取狀態' },
  { token: 'secondary', bg: 'bg-secondary', name: 'Mint', role: '次要動作、亮點' },
  { token: 'fg', bg: 'bg-fg', name: 'Ink', role: '標題、主要文字' },
  { token: 'fg-muted', bg: 'bg-fg-muted', name: 'Slate', role: '內文、次要文字' },
  { token: 'surface', bg: 'bg-surface', name: 'Surface', role: '卡片、按鈕、sheet' },
  { token: 'bg', bg: 'bg-bg', name: 'Mist', role: 'App 背景' },
  { token: 'surface-muted', bg: 'bg-surface-muted', name: 'Field', role: '輸入框、圖示按鈕' },
  { token: 'border', bg: 'bg-border', name: 'Stone', role: '分隔線、外框' },
  { token: 'success', bg: 'bg-success', name: 'Success', role: '成功狀態' },
  { token: 'danger', bg: 'bg-danger', name: 'Danger', role: '錯誤狀態' },
  { token: 'info', bg: 'bg-info', name: 'Info', role: '資訊徽章' },
  { token: 'warning', bg: 'bg-warning', name: 'Warning', role: '評分、精選' },
];

function PaletteSection() {
  return (
    <Section n="02" title="Color palette" wide>
      <View className="flex-row flex-wrap gap-3">
        {palette.map((c) => (
          <Swatch key={c.token} {...c} />
        ))}
      </View>
    </Section>
  );
}

function Swatch({ token, bg, name, role }: (typeof palette)[number]) {
  const value = useTokenValue(token);
  return (
    <View className="w-[100px] gap-1">
      <View className={`h-16 rounded-lg border border-border ${bg}`} />
      <Text variant="caption">{name}</Text>
      <Text variant="small" tone="muted">
        {token}
      </Text>
      <Text variant="small" tone="muted">
        {value.toUpperCase()}
      </Text>
      <Text variant="small" tone="muted">
        {role}
      </Text>
    </View>
  );
}

// Documentation text — keep in sync with the --text-* tokens in src/global.css.
const typeRamp: { variant: TextVariant; sample: string; spec: string }[] = [
  { variant: 'display', sample: 'Find your next stay', spec: 'Outfit Bold · 36 / 40' },
  { variant: 'title', sample: '信義區景觀公寓', spec: 'Outfit Bold · 28 / 34' },
  { variant: 'headline', sample: 'Modern Cabin with Hot Tub', spec: 'Outfit SemiBold · 20 / 26' },
  { variant: 'body', sample: '從山中小木屋到海景別墅，找到適合每趟旅程的住宿。', spec: 'Outfit Regular · 16 / 24' },
  { variant: 'label', sample: '寵物友善', spec: 'Outfit Medium · 15 / 20' },
  { variant: 'caption', sample: '台北市・信義區', spec: 'Outfit Medium · 14 / 20' },
  { variant: 'small', sample: 'Superhost', spec: 'Outfit Medium · 12 / 16' },
  { variant: 'button', sample: 'Book this stay', spec: 'Outfit SemiBold · 17 / 22' },
];

function TypographySection() {
  return (
    <Section n="03" title="Typography" wide>
      <View className="gap-3">
        {typeRamp.map((t) => (
          <View key={t.variant} className="flex-row items-baseline gap-4">
            <Text variant="caption" tone="muted" className="w-[72px]">
              {t.variant}
            </Text>
            <Text variant={t.variant} className="flex-1">
              {t.sample}
            </Text>
            <Text variant="small" tone="muted" className="w-[150px]">
              {t.spec}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

const arrow: IconName = { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' };

function ButtonsSection() {
  return (
    <Section n="04" title="Buttons">
      <Button title="立即預訂" trailingIcon={arrow} />
      <Button
        title="使用 Google 繼續"
        variant="secondary"
        leadingIcon={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
      />
      <Button title="查看所有房源" variant="ghost" />
      <View className="flex-row flex-wrap gap-2">
        <Button title="Small" size="sm" />
        <Button title="Large" size="lg" />
        <Button title="Loading" size="sm" loading />
        <Button title="Disabled" size="sm" disabled />
      </View>
    </Section>
  );
}

function IconButtonsSection() {
  return (
    <Section n="05" title="Icon buttons">
      <View className="flex-row flex-wrap items-center gap-3">
        <IconButton icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }} accessibilityLabel="收藏" />
        <IconButton icon={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }} accessibilityLabel="分享" />
        <IconButton icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} accessibilityLabel="搜尋" />
        <IconButton icon={{ ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }} accessibilityLabel="書籤" />
        <IconButton
          variant="overlay"
          icon={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
          tone="primary"
          selected
          accessibilityLabel="取消收藏"
        />
      </View>
      <Text variant="caption" tone="muted">
        default · overlay（照片上）
      </Text>
    </Section>
  );
}

function InputsSection() {
  return (
    <Section n="06" title="Input fields">
      <TextField
        placeholder="搜尋地點或房源"
        defaultValue="花蓮海景"
        leadingIcon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        trailing={<Icon name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }} />}
      />
      <TextField placeholder="輸入你的名字" leadingIcon={{ ios: 'person', android: 'person', web: 'person' }} />
      <TextField
        placeholder="密碼"
        defaultValue="staylo2026"
        secureTextEntry
        leadingIcon={{ ios: 'lock', android: 'lock', web: 'lock' }}
      />
    </Section>
  );
}

function ChipsSection() {
  const { t } = useTranslation();
  return (
    <Section n="07" title="Filter chips">
      <View className="flex-row flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <Chip key={c.id} label={t(`category.${c.id}`)} icon={c.icon} selected={i === 0} />
        ))}
      </View>
      <View className="flex-row flex-wrap gap-2">
        <Chip label="NT$5,000 以下" selected />
        <Chip label="寵物友善" />
        <Chip label="安靜" />
      </View>
    </Section>
  );
}

function ListingSection() {
  return (
    <Section n="08" title="Listing card">
      <ListingCard listing={LISTINGS[2]} isFavorite onToggleFavorite={() => {}} />
    </Section>
  );
}

function BadgesSection() {
  return (
    <Section n="09" title="Badges">
      <View className="flex-row flex-wrap gap-2">
        <Badge label="旅客最愛" tone="warning" icon={{ ios: 'star.fill', android: 'star', web: 'star' }} />
        <Badge label="新上架" tone="success" />
        <Badge label="8 折" tone="danger" />
        <Badge label="超讚房東" tone="info" />
        <Badge label="可免費取消" />
      </View>
    </Section>
  );
}

function AlertsSection() {
  return (
    <Section n="10" title="Alerts">
      <Alert message="帳號建立成功" onDismiss={() => {}} />
      <Alert tone="danger" message="發生錯誤，請再試一次" onDismiss={() => {}} />
    </Section>
  );
}

const radii = [
  { label: 'sm · 8', className: 'rounded-sm' },
  { label: 'md · 12', className: 'rounded-md' },
  { label: 'lg · 16', className: 'rounded-lg' },
  { label: 'xl · 24', className: 'rounded-xl' },
  { label: 'full', className: 'rounded-full' },
];

const shadows = [
  { label: 'card', className: 'shadow-card' },
  { label: 'raised', className: 'shadow-raised' },
  { label: 'overlay', className: 'shadow-overlay' },
];

function RadiusSection() {
  return (
    <Section n="11" title="Radius & elevation">
      <View className="flex-row flex-wrap gap-3">
        {radii.map((r) => (
          <View key={r.label} className="items-center gap-1">
            <View className={`size-14 border border-border bg-secondary ${r.className}`} />
            <Text variant="small" tone="muted">
              {r.label}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row flex-wrap gap-4 pt-2">
        {shadows.map((s) => (
          <View key={s.label} className={`h-16 w-24 items-center justify-center rounded-lg bg-surface ${s.className}`}>
            <Text variant="small" tone="muted">
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

const spacing = [
  { step: '1', px: 4, className: 'w-1' },
  { step: '2', px: 8, className: 'w-2' },
  { step: '3', px: 12, className: 'w-3' },
  { step: '4', px: 16, className: 'w-4' },
  { step: '5', px: 20, className: 'w-5' },
  { step: '6', px: 24, className: 'w-6' },
  { step: '8', px: 32, className: 'w-8' },
  { step: '12', px: 48, className: 'w-12' },
];

function SpacingSection() {
  return (
    <Section n="12" title="Spacing">
      <View className="gap-2">
        {spacing.map((s) => (
          <View key={s.step} className="flex-row items-center gap-3">
            <Text variant="small" tone="muted" className="w-[64px]">
              {s.step} · {s.px}px
            </Text>
            <View className={`h-3 rounded-sm bg-primary ${s.className}`} />
          </View>
        ))}
      </View>
      <Text variant="caption" tone="muted">
        4px 為單位 · 畫面左右邊距 px-5（20）
      </Text>
    </Section>
  );
}

const icons: { label: string; name: IconName }[] = [
  { label: 'home', name: { ios: 'house', android: 'home', web: 'home' } },
  { label: 'search', name: { ios: 'magnifyingglass', android: 'search', web: 'search' } },
  { label: 'favorite', name: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' } },
  { label: 'trips', name: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' } },
  { label: 'profile', name: { ios: 'person', android: 'person', web: 'person' } },
  { label: 'settings', name: { ios: 'gearshape', android: 'settings', web: 'settings' } },
  { label: 'location', name: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' } },
  { label: 'filter', name: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' } },
];

function IconographySection() {
  return (
    <Section n="13" title="Iconography" wide>
      <View className="flex-row flex-wrap gap-3">
        {icons.map((i) => (
          <View key={i.label} className="items-center gap-1">
            <View className="size-12 items-center justify-center rounded-full border border-border bg-surface">
              <Icon name={i.name} size={22} />
            </View>
            <Text variant="small" tone="muted">
              {i.label}
            </Text>
          </View>
        ))}
      </View>
      <Text variant="caption" tone="muted">
        SF Symbols（iOS）· Material Symbols（Android、web）
      </Text>
    </Section>
  );
}
