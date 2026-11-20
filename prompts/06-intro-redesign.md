# 06 · Intro redesign: full-bleed photo carousel

Status: done

## Goal

`/intro` becomes a full-bleed photo carousel in the style of popular travel onboarding shots. Each page is an edge-to-edge listing photo that moves with parallax as the user swipes. A small floating product hint sits on the photo, and a rounded bottom card holds the title, body, page dots, and CTA. Copy, flow, and gating stay as they are.

## Decisions

- **Layout (user choice):** full-bleed photo carousel, not stacked cards or a collage.
- **Product hints (user choice):** the three existing hints stay, shrunk into compact floating overlays on the photo:
  - Page 1: the typed sentence plus understood tags.
  - Page 2: two compact ranked rows, the top one tagged "最符合".
  - Page 3: a question bubble plus the quoted answer.
- **Photos:** existing mock listings, one per page:
  1. Alishan cabin (`LISTINGS[2]`, matches the sentence)
  2. Kenting villa (`LISTINGS[1]`)
  3. Hualien coastal house (`LISTINGS[4]`)
- **Structure:**
  - Photos sit in a background layer behind everything, including the status bar.
  - The horizontal `Animated.FlatList` pages hold only the floating hint and the text.
  - The bottom card is a fixed `bg-surface rounded-t-xl` sheet holding the dots and CTA. The page title and body inside it crossfade per page.
  - The top bar (globe + Skip) floats over the photo with on-scrim styling.
- **Motion** (expo-animation rules; tier: occasional; purpose: explanation):
  - Parallax: each photo's `translateX` is interpolated from the scroll `progress` shared value at about 0.4× scroll speed, and its opacity crossfades between neighbors. This runs on the UI thread, with transform and opacity only.
  - Hint entrance: the existing `Reveal` (CSS transition, ease-out).
  - Title/body change: opacity is interpolated from `progress`.
  - Reduced motion: no parallax translate (opacity crossfade only), and `Reveal` already degrades.
- **Glass:** floating hints use a new `--color-surface-glass` token (surface at about 85% alpha, light and dark) plus `shadow-raised`. No blur and no new dependency. `expo-glass-effect` is installed but iOS 26 only, so it's not worth a split look now.
- **Scrim:** a top gradient scrim (for status bar and top-bar legibility) is added beside the existing bottom one. `PhotoHero` is replaced by a new `IntroBackdrop`, and `photo-hero.tsx` is deleted if nothing else uses it.
- **Wide screens:** the bottom card and hints keep the `max-w-[480px]` cap. The photo fills the full width (`contentFit="cover"`).

## Out of scope

- `/preferences` and `/welcome` screens, copy changes, new locales keys (all copy already exists), real blur / Liquid Glass.

## Steps

### 1. Token
Add `--color-surface-glass` to `src/global.css`:
- Light: `rgb(255 255 255 / 0.86)`.
- Dark: `rgb(26 28 34 / 0.82)`.

Add it to the `ColorToken` union in `ui/tokens.ts` and to the `/design-system` palette. Done when it shows in the gallery in both modes.

### 2. Backdrop
Create `src/components/onboarding/intro-backdrop.tsx`. It takes `photos: string[]` and `progress: SharedValue<number>`.
- It renders absolutely positioned expo-image layers.
- Each layer's style comes from `useAnimatedStyle`:
  - Opacity: `interpolate(progress, [i-1, i, i+1], [0, 1, 0])`.
  - `translateX`: `interpolate(..., [w*0.4, 0, -w*0.4])`, or 0 when reduced motion is on.
  - The image is slightly wider (scale 1.15) so the edges never show.
- Top and bottom react-native-svg gradient scrims use the `scrim` token through `useTokenValue`.

### 3. Hints
Rework `intro-visuals.tsx` into compact overlays:
- Each hint is wrapped in a `rounded-xl bg-surface-glass p-3 shadow-raised` panel, about 300px max wide.
- Page 1:
  - The typed sentence moves to `variant="label"` with the default tone.
  - The tags become a smaller wrap row inside the panel.
- Page 2: two `CompactListing` rows.
- Page 3: the existing bubble pair, shrunk.

Keep `useTypewriter`, `Reveal`, and the `active` prop.

### 4. Screen
Rewrite `src/app/(onboarding)/intro.tsx`:
- The screen is `flex-1` with `IntroBackdrop` filling it.
- The top bar is placed with `insets.top`. Skip uses a new `on-scrim` ghost style if Button supports it; otherwise it's a Text pressable via Button `variant="ghost"` with tone added.
- The pager area takes the space above the card. Each page centers its hint toward the bottom of the photo area.
- The bottom card is `bg-surface rounded-t-xl px-5 pt-6` with `insets.bottom + 16` padding. It holds the title and body (an animated crossfade from `progress`, all three stacked absolutely, with a measured min height), then `PageDots`, then the CTA.
- Swiping still works anywhere on the photo, and Next/Start uses `scrollToIndex` as before.

### 5. Clean up
Delete `photo-hero.tsx` if unused. Run lint and tsc.

## Verification

- `npx expo lint`, `npx tsc --noEmit`, and `npx expo export` for ios, android, and web.
- Web, exported build with `expo serve`: headless screenshots of all 3 pages.
  - At 430px wide in light and dark, zh-TW and en.
  - At 1280px wide in light.
  - Check: no clipping, readable top bar on the photo, card text not overflowing.
- CDP flow: Next → Next → Start lands on `/preferences` (or `/welcome` if preferences were saved). Skip works.
- Device, by the user in Expo Go:
  - Swipe feel and parallax.
  - Reduced Motion on: no translate.
  - Status bar legible over the photos.

## AGENTS.md updates

- Styling: mention the `surface-glass` token for content floating over photos.
- Styling: replace the `photo-hero.tsx` example with `intro-backdrop.tsx`.

## Result

Built as planned:
- `intro-backdrop.tsx` handles the crossfading parallax photos and the top scrim.
- `intro-visuals.tsx` holds the glass hints.
- `intro.tsx` has the fixed bottom card with title and body crossfading from `progress`.
- The `surface-glass` token is new, and Button has an `overlay` variant.
- `photo-hero.tsx` was removed.

Lint, tsc, and the ios/android/web exports pass. Headless web screenshots are checked:
- zh-TW light and dark at 430px, en at 375px, and 1280px wide.
- The Next → Next → Start flow lands on `/preferences`.

On-device swipe feel and reduced motion are left for the user to check in Expo Go.
