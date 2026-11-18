# 03 · Design system gallery

Status: done

## Goal

`/design-system` shows every design token and shared component on one page, laid out as numbered section cards like `assets/images/design.png`. Screenshots of it in light and dark mode are saved next to the reference image.

## Decisions

- Route: `src/app/design-system.tsx`, open in all builds (user choice) but not linked from anywhere in the app. Its header is hidden because the page has its own title.
- Layout: a `ScrollView` on `bg-bg`. Sections are `bg-surface rounded-xl p-5` cards titled "01. Brand", and so on. They sit in a `flex-row flex-wrap gap-4` grid with `grow basis-[340px]`, so a wide screen gets several columns and a phone gets one, with no breakpoints.
- Sections, using the plan 02 system as built:
  01 Brand (wordmark + tagline) · 02 Color palette · 03 Typography · 04 Buttons · 05 Icon buttons · 06 Input fields · 07 Filter chips · 08 Listing card · 09 Badges · 10 Alerts · 11 Radius & elevation · 12 Spacing · 13 Iconography.
- Palette swatches show the token name, its role, and its current value. The value is read at runtime: `useTokenColor` on native, and `getComputedStyle` of the CSS variable on web through a gallery-only `.web` helper. No hex is repeated in code, and the values follow light/dark.
- Typography specs (size / line height / weight) are written in the gallery as plain documentation text next to each sample. That duplicates `global.css`, so a comment above them says to update both together.
- Sample content uses the existing mock data (the first listing for the card) and zh-TW copy.
- Screenshots: headless Chrome against the running dev server at 1536px wide, saved as `assets/images/design-system-light.png` and `assets/images/design-system-dark.png`. They're web renders, since the iOS Simulator is unavailable.

## Out of scope

- New components or tokens. The gallery only shows what exists.
- Native screenshots.
- Linking to the gallery from the app.

## Steps

### 1. Gallery page

Create `src/app/design-system.tsx` with a local `Section` (number + title + children) and the 13 sections, plus `src/components/design-system/use-token-value.ts`/`.web.ts` for swatch values. Register the route with `headerShown: false` in `src/app/_layout.tsx`. Done when lint and type check pass and `/design-system` renders on web in both modes.

### 2. Screenshots

Capture light and dark screenshots at 1536px wide, with a height that fits the content, and check them against `design.png` for structure (numbered cards, density, alignment). Fix spacing or ordering issues and re-capture.

## Verification

- `npx expo lint` and `npx tsc --noEmit` pass.
- `npx expo export` (ios, android, web) succeeds.
- Both screenshots show all 13 sections with no clipping, and the dark one uses dark tokens throughout.
- At phone width (430px) on web, the page falls back to a single column.

## AGENTS.md updates

In **Styling**, add: "`/design-system` (`src/app/design-system.tsx`) shows every token and `ui/` component. Add new components and tokens there, and keep its typography spec text in sync with `global.css`."

## Result

`/design-system` renders all 13 sections. The screenshots are saved as `assets/images/design-system-light.png` and `-dark.png` (1536×1880, web).

- Swatch values are read at runtime (`useSyncExternalStore` + `getComputedStyle` on web, `useTokenColor` on native), so no hex is repeated in code.
- Phone width: RN-web gives Views `flex-shrink: 0`, so wide cards overflowed. `max-w-full` on the section fixes it, and a phone-width check shows a single column.
- The running dev server served stale Tailwind CSS: new classes such as `max-w-full` were missing until a fresh build. The screenshots were taken from `expo export` served by `expo serve`. AGENTS.md now notes to restart with `--clear`.
- Verified: lint and tsc pass, and the ios/android/web export succeeds. Not verified on a device (the Simulator is unavailable).
