# 02 · Design system

Status: done

## Goal

Every screen gets its colors, type, spacing, radii, and shadows from one token set in `src/global.css`, and builds UI from a small set of shared components. Light and dark modes both work. The home screen is rebuilt on the system, and `src/constants/theme.ts` is deleted, so only one system exists.

## Decisions

- Reference: `assets/images/design.png`. It sets the structure (roles, type ramp, component look). The colors are new on purpose, and sizes are adjusted for mobile.
- Storage: NativeWind v5 tokens in `src/global.css` (`@theme` plus CSS variables). No JS token file. This follows the expo-design-system skill's Tailwind rule ("tokens in global.css as CSS variables") and AGENTS.md Styling.
- Brand stays **Staylo** (the "roam" wordmark in the image is reference only).
- Palette "Coral + Mint". Each role has a light and a dark value:

  | Token (`--color-*`) | Role | Light | Dark |
  |---|---|---|---|
  | `primary` | primary actions, active states | #FF6B4A | #FF7D5E |
  | `on-primary` | text/icons on primary | #14161F | #14161F |
  | `secondary` | secondary actions, highlights | #BFEBDD | #1F4A3F |
  | `on-secondary` | text on secondary | #0F3D30 | #BFEBDD |
  | `fg` | headings, primary text | #14161F | #F4F4F2 |
  | `fg-muted` | body/secondary text, icons | #6A6F7E | #A3A7B3 |
  | `bg` | app background | #F5F5F2 | #0F1014 |
  | `surface` | cards, sheets, buttons | #FFFFFF | #1A1C22 |
  | `surface-muted` | input fields, icon buttons | #EEEEEA | #23262E |
  | `border` | dividers, outlines | #E6E5E0 | #2E313A |
  | `success` / `success-soft` | success text / background | #1E8E5A / #E3F5EC | #4CC38A / #173A2B |
  | `danger` / `danger-soft` | errors | #D64545 / #FDE8E8 | #F07070 / #3D1E1E |
  | `info` / `info-soft` | info badges | #2F6FEB / #E6EEFD | #7FA6F5 / #1C2A47 |
  | `warning` / `warning-soft` | "guest favorite", ratings | #C98A00 / #FFF4D6 | #F2C14E / #3A2F12 |

  Text on primary is dark ink (white on coral fails contrast).
- Font: **Outfit** via the new dependency `@expo-google-fonts/outfit` (approved in the question round), loaded at runtime with `useFonts` in `src/app/_layout.tsx` while the splash screen is held. Runtime loading keeps Expo Go working; the `expo-font` config plugin would need a dev build. Weights: 400, 500, 600, 700. On native, `font-bold` only sets `fontWeight`, so each weight is its own family token: `font-outfit`, `font-outfit-medium`, `font-outfit-semibold`, `font-outfit-bold`. These are named apart from Tailwind's weight utilities to avoid a clash. Chinese characters fall back to the system font (PingFang on iOS); only Latin letters and digits use Outfit.
- Type ramp (Outfit; sizes in px, which are dp on native):

  | Token (`--text-*`) | Size / line height | Weight | Use |
  |---|---|---|---|
  | `display` | 36 / 40 | bold | hero headlines |
  | `title` | 28 / 34 | bold | screen and section titles |
  | `headline` | 20 / 26 | semibold | card titles |
  | `body` | 16 / 24 | regular | body copy |
  | `label` | 15 / 20 | medium | chips, fields, buttons sm |
  | `caption` | 14 / 20 | medium | metadata (location, rating) |
  | `small` | 12 / 16 | medium | badges |
  | `button` | 17 / 22 | semibold | buttons |

- Units: native rem is 14 and web rem is 16, so every token is in px, not rem, to look the same on all platforms. `--spacing: 4px` sets the spacing base (`p-4` = 16 on every platform).
- Spacing: Tailwind's numeric scale on a 4 grid. Screen edge padding is `px-5` (20). Common steps are 1, 2, 3, 4, 5, 6, 8, 12 (4–48).
- Radius (`--radius-*`): `sm` 8, `md` 12, `lg` 16, `xl` 24, `full` (pill). Inputs and cards use `xl`; buttons, chips, and badges use `full`, as in the image.
- Shadows (`--shadow-*`): `card` `0 1px 2px rgb(0 0 0 / 0.05)`, `raised` `0 4px 12px rgb(0 0 0 / 0.08)`, `overlay` `0 8px 24px rgb(0 0 0 / 0.16)`.
- Dark mode: system preference only (no in-app toggle). It uses a `@media (prefers-color-scheme: dark)` block that overrides the `:root` color variables. If that doesn't work on native, fall back to `VariableContextProvider` with `useColorScheme()` in the root layout, listing the color variables in `withNativewind`'s `inlineVariables.exclude`. Both routes are documented by NativeWind; Step 1 picks one by testing.
- Icons: `SymbolView` (SF Symbols / Material Symbols). An `Icon` wrapper made with `styled(SymbolView, …)` maps the `className` text color to `tintColor` so icons use color tokens. If that mapping fails on native, the wrapper reads the variable with `useUnstableNativeVariable` instead.
- Text overrides: `Text` takes `variant` and `tone` props for color. `className` is for layout only (margins, flex), so no `tailwind-merge` dependency is needed.
- Pressed state: `active:` classes on `Pressable` (opacity/scale). Disabled is 40% opacity.

## Out of scope

- Tab bar and glass surfaces, segmented control, toggles, steppers, profile rows, and policy cards. These are added when a screen needs them. Native controls (`Switch`, `@expo/ui`) aren't wrapped.
- Motion tokens, until animations are built.
- In-app light/dark toggle.
- Bundling fonts with the config plugin (needs a dev build).

## Steps

### 1. Tokens and fonts

- `npx expo install @expo-google-fonts/outfit`.
- `src/global.css`: keep the existing imports. Add `@theme` with `--spacing: 4px`, the `--font-*`, `--text-*` (with `--text-*--line-height`), `--radius-*`, and `--shadow-*` tokens, and the `--color-*` tokens pointing at the light values. Then add a `@media (prefers-color-scheme: dark)` `:root` block with the dark values.
- `src/app/_layout.tsx`: `SplashScreen.preventAutoHideAsync()`, `useFonts({ Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold })`, hide the splash screen when the fonts are loaded (or on error), and set the Stack `contentStyle` background to `bg`.
- Done when a scratch screen (temporary, removed in this step) shows `bg-primary`, `text-title font-bold`, `rounded-xl`, `shadow-raised`, and `p-4` correctly in the iOS simulator in light and dark mode, and the web CSS contains them. Record which dark-mode route worked.

### 2. Base components (`src/components/ui/`)

Each component takes a `className` for layout, merged last, and an accessibility role and state:
- `icon.tsx`: `Icon` (SymbolView with `className` color mapping, `size`).
- `text.tsx`: `Text` with `variant` (the ramp above, default `body`) and `tone` (`default`, `muted`, `primary`, `on-primary`, `success`, `danger`, `info`, `warning`).
- `button.tsx`: `Button` with `variant` (`primary`: coral fill; `secondary`: surface plus border; `ghost`), `size` (`sm`, `md`, `lg`), optional `leadingIcon`/`trailingIcon` (symbol names), and `loading`/`disabled`. Pill-shaped.
- `icon-button.tsx`: `IconButton`, a circular surface button with an `icon` and a required `accessibilityLabel`, plus a `variant="overlay"` for use on photos.
- `chip.tsx`: `Chip` with `selected` (primary fill) and an optional `icon`, used for filters and categories.
- `text-field.tsx`: `TextField` with an optional `leadingIcon` and a `trailing` slot. The border turns primary on focus. `secureTextEntry` gets a show/hide eye toggle, and the placeholder color uses `fg-muted`.
- `badge.tsx`: `Badge` with `tone` (`neutral`, `success`, `danger`, `info`, `warning`) and an optional `icon`.
- `alert.tsx`: `Alert` with `tone` (`success`, `danger`), a message, and an optional `onDismiss` close button.

Done when lint and type check pass.

### 3. Rebuild the home screen on the system

- `src/app/index.tsx`: the header shows "Staylo" (`title`, primary) and the tagline (`body`, muted). The search uses a `TextField` with a search icon. Categories become a horizontal row of `Chip`s with icons, replacing the underlined tabs. The list uses `px-5` and `gap-6`. The empty state uses `Text` (muted). Behavior doesn't change: search filter, category filter, favorites.
- `src/components/listing-card.tsx`: an image (`styled(expo-image)`, `rounded-xl`) with an overlay heart `IconButton`. Below it: the title (`headline`), location with a pin `Icon` (`caption`, muted), the rating with a warning star (`caption`), and the price "NT$x" (`headline`) plus "/ 晚" (muted).
- Delete `src/components/category-bar.tsx` (replaced by chips) and `src/constants/theme.ts`.
- Done when `grep -rE "#[0-9A-Fa-f]{3,6}|StyleSheet.create|useThemeColors" src --include=*.tsx` finds nothing, apart from a commented exception if one is needed.

## Verification

- `npx expo lint` and `npx tsc --noEmit` pass.
- `npx expo export --platform ios --platform android --platform web` succeeds.
- iOS simulator (Expo Go): home screen screenshots in light and dark mode. Check that Outfit renders on "Staylo" and the prices, chips select and filter, search filters, the heart toggles, the empty state shows for a nonsense query, and there's no text clipping.
- A self-critique pass (hierarchy, spacing, repetition, alignment) against the reference image's look, listing any differences that remain.
- ❌ Android device/emulator is not available here, so it is checked only by bundling.

## AGENTS.md updates

In **Styling**, replace the "New UI uses className" line with:
- Design tokens live only in `src/global.css`: colors (light and dark CSS variables), `--text-*`, `--font-*`, `--radius-*`, `--shadow-*`, and `--spacing: 4px`. Never hardcode hex colors, font sizes, or spacing; add a token instead. Use px tokens, not rem (native rem is 14).
- Build UI from `src/components/ui/` (Text, Icon, Button, IconButton, Chip, TextField, Badge, Alert). Use `variant`/`tone` props for appearance, and keep `className` for layout. Promote a view to `ui/` only once two screens need it.
- Fonts: Outfit, loaded in `src/app/_layout.tsx`, with one family per weight (`font-outfit`, `font-outfit-medium`, `font-outfit-semibold`, `font-outfit-bold`).

## Result

The design system is in place and the home screen runs on it. `src/constants/theme.ts` and `category-bar.tsx` are deleted.

- Dark mode: the CSS route (a `prefers-color-scheme: dark` `:root` block) works. In the compiled native bundle, each color variable carries a dark-condition value, and utilities read variables at runtime. `VariableContextProvider` wasn't needed.
- Icons: `styled(SymbolView)` with `nativeStyleMapping` did not color icons on web, so icon colors (and the placeholder and spinner colors) come from `useTokenColor()` instead. On native it uses `useUnstableNativeVariable`; on web it returns `var(--color-*)`. Its typing resolves to the web stub, so it's cast once.
- Font family classes were renamed to `font-outfit-*` to avoid clashing with Tailwind's `font-bold`/`font-medium` weight utilities.
- Verified: lint and tsc pass; `expo export` succeeds for ios, android, and web; and web screenshots (light and dark) of the home screen and a temporary component gallery (since removed) look right. The compiled native bundle has the right values for tokens (fontSize/lineHeight, spacing at 4px, radius 24, shadows, Outfit families, dark color conditions).
- Not verified: the iOS simulator. The user's Simulator can't be used right now (Expo Go's dev-menu onboarding blocks the screen and the Simulator needs an update), so native rendering, `useTokenColor` on native, and `active:` press feedback still need a device check.
- Follow-up fix: on the user's iPhone, the home screen showed only "Staylo", in the middle of the screen. The line-height tokens were px values, and react-native-css treats a line-height number as a multiple of the font size (34px → 34× → ~950pt line box). They are now unitless ratios (`calc(34 / 28)`). The compiled native style now gives the right lineHeight, but this hasn't been re-checked on the device yet. A `console.warn` was added for font load errors, because the screenshot also showed the system font.
