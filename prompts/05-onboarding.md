# 05 · Onboarding screens and flow

Status: done

## Context

The app opens straight to the home screen. Staylo's core idea (describe a stay in one sentence, get ranked stays, and get policy answers quoted word for word) isn't explained anywhere, there's no entry point to auth, and nothing is personalized. The user wants an onboarding flow:

1. Product intro carousel
2. Travel preferences
3. Sign-in / sign-up entry

It shows **whenever the user isn't signed in**. The visuals are **real listing photos plus real UI fragments** sliding in.

Clerk isn't installed yet (AGENTS.md: Clerk owns auth). So this plan builds the screens and gating behind a small **session abstraction with a mock implementation**, and a later plan replaces it with Clerk without touching the screens.

When building, first copy this plan to `prompts/05-onboarding.md` (`Status: done`), as the AGENTS.md workflow requires.

## Flow

```
cold start → splash (fonts + language + session loaded)
  ├─ signed in or guest this session ──► (app) home
  └─ otherwise ──► /intro ──► /preferences* ──► /welcome
                     │ "Skip" jumps to /preferences* or /welcome
                     └ globe button → /language sheet (works here too)
/welcome:  Create account / Sign in ──► mock sign-in (persisted) ──► home
           Maybe later ──► guest for this app session only ──► home
* /preferences is skipped when preferences are already saved.
```

"Every time you're not signed in" means a guest sees onboarding again on the next cold start, but the preferences step isn't repeated.

## Defaults picked (not asked)

- **Gating:** `Stack.Protected` (`guard` prop, present in this expo-router version) in `src/app/_layout.tsx`. Onboarding screens are behind `guard={!entered}` and app screens behind `guard={entered}`, where `entered = isSignedIn || isGuest`. `/language` sits outside both guards. No manual redirects.
- **Session:** `src/auth/session.tsx` exposes a `SessionProvider` and `useSession()` returning `{ loaded, isSignedIn, isGuest, signIn(), continueAsGuest(), signOut() }`.
  - Mock: `isSignedIn` is stored in AsyncStorage `staylo.session`, and `isGuest` lives in memory.
  - The file header marks it as a Clerk placeholder. The Clerk plan swaps the implementation behind the same hook.
- **Preferences:** these are favorite categories (the existing `CategoryId`s except `all`), multi-select, stored in AsyncStorage `staylo.preferences` through `src/preferences/travel-preferences.tsx` (provider + hook). The home list **sorts** matching listings first, so the category filter keeps working.
- **Splash:** it waits for session and preferences to load, extending the existing `ready` gate. This avoids flashing onboarding to signed-in users.
- **Motion** (via the `expo-animation` skill at build time):
  - Reanimated (already installed) drives a paged horizontal `FlatList` with animated page dots.
  - Each page's photo and UI fragment slide/fade in when the page becomes active.
  - `useReducedMotion()` turns the animations into plain fades.
  - No new dependencies.
- **Reuse:** `ui/` Text, Button, Chip, TextField, Badge, IconButton, Icon; `ListingCard` + `LISTINGS` for the visuals; the tokens in `global.css`; `useTranslation`. Screen-specific pieces live in `src/components/onboarding/` (page dots, the three intro visuals). They aren't promoted to `ui/` because only one screen uses them.
- **Dev:** `/design-system` gets a "Replay onboarding" button (`__DEV__`) that calls `signOut()`, clears the guest state, and optionally clears preferences.

## Screens

### `/intro`: 3 pages, plus "Skip" and a globe button at the top
| # | Title / body (zh-TW source; translated ×4) | Visual (real components) |
|---|---|---|
| 1 | 一句話，說出理想住宿 / 例如「安靜、可帶寵物、有溫泉的小木屋，一晚 5,000 內」 | Cabin photo; a `TextField` whose text types itself in |
| 2 | 依你的需求排序 / 硬條件一定符合，「安靜、舒適」這類感覺也會納入排序 | Two or three compact `ListingCard`s stacking in, the top one with a `Badge` "最符合" |
| 3 | 規定問題，原文回答 / 入住、取消、寵物規定都附上出處，不猜測 | A question bubble plus an answer card that quotes a house rule with a "出處：房源規定" caption |

The bottom CTA is a `Button` showing "下一步", which becomes "開始" on the last page. Page dots sit above it.

### `/preferences`
Title "你喜歡哪種住宿？", a subtitle, and a `Chip` multi-select grid (apartment, house, cabin, ocean view, pool, with icons). The footer has "繼續" (primary, disabled until at least one chip is picked) and "略過" (ghost).

### `/welcome`
A full-bleed listing photo with a gradient-free dark scrim token overlay and the Staylo wordmark plus tagline. Below are three buttons: "建立帳號" (primary), "登入" (secondary), and "稍後再說" (ghost). While auth is mocked, a small muted footnote says "帳號功能即將推出" (accounts are coming soon). It's removed when Clerk lands.

## Files

- New:
  - Routes: `src/app/(onboarding)/_layout.tsx` (a Stack without headers, slide animation), `src/app/(onboarding)/intro.tsx`, `src/app/(onboarding)/preferences.tsx`, `src/app/(onboarding)/welcome.tsx`.
  - State: `src/auth/session.tsx` and `src/preferences/travel-preferences.tsx`.
  - Components in `src/components/onboarding/`: `page-dots.tsx`, `intro-visual-describe.tsx`, `intro-visual-ranked.tsx`, `intro-visual-policy.tsx`.
- Modified:
  - `src/app/_layout.tsx`: providers, `Stack.Protected` groups, and the extended `ready` gate.
  - `src/app/index.tsx`: preference-based sort.
  - `src/app/design-system.tsx`: the replay button.
  - The 4 locale files: an `onboarding.*` namespace.
  - `src/global.css`: only if a scrim token is needed (`--color-scrim` light/dark), added to the gallery palette too.
  - `AGENTS.md`: auth placeholder and onboarding rules.

## Verification

- `npx expo lint`, `npx tsc --noEmit`, and `npx expo export` for ios, android, and web.
- Web, from a fresh profile on the exported build served with `expo serve`, with screenshots in light and dark mode for zh-TW, en, and ja:
  - `/` redirects to `/intro`.
  - Each intro page, `/preferences`, and `/welcome` render without clipping, at 430px and 1280px wide.
- Web flow with a CDP-scripted headless Chrome (click "Skip", pick chips, "Maybe later"):
  - The flow lands on home, with preferred categories first.
  - Reloading shows onboarding again but skips preferences.
  - "Sign in" (mock) and then a reload go straight to home.
- Device, by the user in Expo Go:
  - The swipe carousel and animations.
  - Reduced Motion on.
  - The globe button during onboarding.
  - Replaying through the dev button.
- `npx expo start --clear` afterwards, for new Tailwind classes.

## AGENTS.md updates
- **Auth:** `src/auth/session.tsx` is a mock until Clerk is set up. Screens use `useSession()` only, never storage directly. The Clerk plan replaces the implementation behind that hook.
- **Onboarding:** routes live in `src/app/(onboarding)/` and are gated with `Stack.Protected` on `entered = isSignedIn || isGuest`. Travel preferences come from `useTravelPreferences()` and order listings, never filter them.

## Result

Onboarding (intro carousel → preferences → welcome) gates the app until the user signs in (mock) or picks "maybe later".

- Deviations:
  - The three visuals live in one `intro-visuals.tsx`, plus a shared `reveal.tsx` (CSS-transition fade/lift with reduced-motion handling), not three files.
  - Skipping preferences saves an empty choice, so the step isn't asked again.
  - Both `Stack.Protected` groups need `redirectTo` (`/intro`, `/`). Without it, web redirected to the bare `/(onboarding)` group and rendered a blank screen.
  - Intro pages are sized to the measured list height, because horizontal FlatList items didn't stretch on web. Content is capped at 480px for wide screens.
  - New tokens `--color-scrim` / `--color-on-scrim` (light/dark) for text on photos, added to the gallery. Text/Button got an `on-scrim` tone.
- Verified:
  - lint and tsc pass; the ios/android/web export succeeds.
  - A headless Chrome flow driven over CDP (exported build) in zh-TW light, en dark, and ja light at 430px:
    - intro 1→2→3, then preferences (pick pool), welcome, "maybe later", and home with pool listings first.
    - A reload returns to intro, and "Skip" goes straight to welcome (preferences already saved).
    - "Sign in" and then a reload land on home.
  - Screenshots at 1280px are fine. The first visit to a lazily loaded route can take several seconds on the exported web build.
- Not verified: devices (swipe feel, Reanimated CSS transitions on native, reduced motion, the globe sheet during onboarding).
- Known data issue (pre-existing): some mock Unsplash photos don't match their listing (e.g. the Alishan "cabin" image is a pool house). The intro shows that photo too.
- Follow-up: intro page 1 was redesigned using the `frontend-design` guidance (read from the marketplace plugin, which isn't enabled).
  - The example sentence is now the hero: display type in localized quote marks, typed out.
  - Once it finishes, the constraints Staylo "understands" resolve below it as tags in a single staggered moment. Must-haves are surface + check; the feel ("quiet") is mint + sparkle, matching page 2's hard-vs-soft message.
  - The photo was dropped, which also removes the mismatched cabin image from page 1.
  - The body copy now explains the tags.
  - Typing runs ~1.6s in any language.
- Follow-up: page 1 felt empty without an image, so it now opens with a vector illustration of the sentence (`cabin-illustration.tsx`: hills, a cabin, a hot-spring pool with rising steam, and a dog).
  - It's drawn with the new dependency `react-native-svg` (approved by the user), in brand tokens via `useTokenValue`, so it follows light/dark. `useTokenValue` moved from `components/design-system/` to `components/ui/`.
  - The steam is the only ambient motion: a Reanimated CSS keyframe loop, which shows statically when reduced motion is on.
  - The sentence went back to the `title` size, so the illustration stays the main visual.
- Follow-up: the user rejected the illustration, so page 1 now uses a photo.
  - The photo is a snowy lakeside cabin lit warm at dusk (Unsplash `photo-1510798831971-661eb04b3739`). It was picked after reviewing 6 candidates.
  - It fills the visual area as a rounded card, with an SVG gradient scrim (scrim token). The sentence types over it as a white caption, and the tags resolve below.
  - The same photo now belongs to the Alishan cabin mock listing, which fixes the old picture/title mismatch there (page 2 and the home screen too).
  - `cabin-illustration.tsx` was removed. `react-native-svg` stays, for the gradient.
