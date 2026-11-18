# 01 · NativeWind v5 setup

Status: done

## Goal

Developers can style any React Native core component with Tailwind `className` (including `dark:` variants) on iOS, Android, and web. Existing screens keep working unchanged.

## Decisions

- Source: https://www.nativewind.dev/v5/getting-started/installation (Expo path). Docs target Expo 57; this app is SDK 58, so the setup is verified by bundling all three platforms.
- NativeWind v5 is a release candidate. Install `nativewind@5.0.0-rc.1` with `react-native-css@3.1.0-rc.1` (the matched pair; newer than the docs' rc.0), both `--save-exact`.
- Tailwind: `tailwindcss@4.1.12` and `@tailwindcss/postcss@4.1.12` exact (the docs' tested versions, peer needs `>4.1.11`), plus `postcss`, as devDependencies.
- lightningcss: pin `1.30.1` (the docs' version), both as an exact devDependency and in `package.json` `overrides`, so the whole tree has one version. This also downgrades Expo 58's own copy from 1.33.0. (1.33.0 was tried first and failed; see Result.)
- No Babel config. v5 rewrites imports in Metro, and the app has no `babel.config.js`.
- `global.css` lives at `src/global.css` (matching the `src/` layout) and is imported once in `src/app/_layout.tsx`.
- Reanimated 4.7.1, Worklets 0.13.0, safe-area-context, and expo-system-ui are already installed through Expo, and `userInterfaceStyle` is already `automatic`. No changes, only a version check.
- Third-party components (e.g. `expo-image`) get `className` through `styled()` from `nativewind`. `cssInterop`/`remapProps` don't exist in v5.
- Dark mode uses `dark:` (system color scheme). `useColorScheme` comes from `react-native`, not `nativewind`.

## Out of scope

- Converting the home screen (`index.tsx`, `listing-card.tsx`, `category-bar.tsx`) to `className`. `src/constants/theme.ts` stays.
- Design tokens in `@theme`. They come with the design system.
- `prettier-plugin-tailwindcss`.

## Steps

### 1. Install packages

Run:
- `npm install --save-exact nativewind@5.0.0-rc.1 react-native-css@3.1.0-rc.1`
- `npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1`

Add `"overrides": { "lightningcss": "1.30.1" }` to `package.json`, then run `npm install`. Done when `npm ls nativewind react-native-css lightningcss` shows a single lightningcss 1.30.1, and `npx expo install --check` reports no mismatches.

### 2. Config files

- `postcss.config.mjs` (not `.cjs`): `export default { plugins: { "@tailwindcss/postcss": {} } };`
- `metro.config.js`: create with `npx expo customize metro.config.js`, then wrap: `module.exports = withNativewind(getDefaultConfig(__dirname))`, with `withNativewind` from `nativewind/metro`.
- `src/global.css`:
  ```css
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/preflight.css" layer(base);
  @import "tailwindcss/utilities.css";

  @import "nativewind/theme";
  ```
- `nativewind-env.d.ts` at the root: `/// <reference types="react-native-css/types" />`. `tsconfig.json` already includes `**/*.ts`.
- `src/app/_layout.tsx`: add `import '@/global.css';` at the top.

Done when lint and type check pass and the app starts with `npx expo start --clear`.

### 3. Verify className works

Temporarily add `className="bg-red-500 dark:bg-blue-500"` to the home screen's empty-state `Text` and check a bundle. Remove it afterwards. The home screen ends up unchanged.

## Verification

- `npx expo lint` and `npx tsc --noEmit` pass.
- `npx expo export --platform ios --platform android --platform web` succeeds with no lightningcss or `global.css` deserialization errors.
- With the temporary class in place, the exported web CSS contains `bg-red-500`, and the native bundle contains the compiled style for it.
- In the iOS simulator through Expo Go, the home screen looks the same as before (search, categories, cards, dark mode).

## AGENTS.md updates

Add a **Styling** section:
- NativeWind v5 RC, pinned exactly (`nativewind` + `react-native-css` are a matched pair; upgrade them together). Use `className` with `dark:` variants for new UI. Wrap third-party components with `styled()`; there's no `cssInterop`.
- `src/global.css` is the only Tailwind entry point (imported in `src/app/_layout.tsx`).
- `lightningcss` is pinned to 1.30.1 through `overrides`, because react-native-css rc.1 can't read newer output. Don't bump it unless NativeWind's docs say so, and re-check it on every Expo SDK or NativeWind upgrade.

## Result

NativeWind v5 rc.1 works on iOS, Android, and web with Expo SDK 58.

- The first attempt with lightningcss 1.33.0 (matching Expo 58) failed the Android bundle with `failed to deserialize; expected an object-like struct named Specifier, found ()` from react-native-css. After the user approved the switch, it was pinned to 1.30.1, and everything bundled.
- Verified with a temporary `bg-red-500 dark:bg-blue-500` class, since removed. Results: the web CSS contains `.bg-red-500` and a `prefers-color-scheme: dark` rule, both native bundles contain `#fb2c36` (red-500), and in the iOS simulator through Expo Go the title is red in light mode and blue in dark mode.
- NativeWind added `nativewind-env.d.ts` to `tsconfig.json` `include` by itself on first run.
- Left for later: `npx expo install --check` flags existing patch updates unrelated to this change (`expo` ~58.0.26, `expo-router` ~58.0.32, `@expo/ui` ~58.0.29, `expo-web-browser` ~58.1.0).
