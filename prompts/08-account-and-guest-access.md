# 08 · Account tab and guest vs signed-in access

Status: done

## Goal

The app gets a bottom tab bar with two tabs, 探索 (home) and 帳號. Signed-in users can see and edit their profile, change settings, sign out, and delete their account. Guests see a sign-in prompt and the same settings. One rule set says what guests can and can't do, and one hook enforces it in the UI, so the features that come later (one-sentence search, policy questions, booking) plug in without redesigning.

## Decisions

- **User answers:**
  - Entry is a bottom tab bar.
  - The account page has a profile, sign-out, settings (language and travel preferences), delete account, and edit name and avatar.
  - Guests are blocked from **one-sentence (AI) search, policy questions, and booking**. Browsing listings and the current keyword search stay open.
- **Tabs:** `NativeTabs` from `expo-router/unstable-native-tabs`. It has its own web view, so no separate web layout is needed. The exact trigger API (`Icon` sf/md, `Label`) is checked against the SDK 58 docs at build time.
  - Explore: SF `magnifyingglass`, Material `explore`.
  - Account: SF `person.crop.circle`, Material `account_circle`.
  - Tabs don't animate between each other.
- **Routes:**

  ```
  src/app/
    _layout.tsx           root Stack + guards (below)
    (tabs)/_layout.tsx    NativeTabs: index, account
    (tabs)/index.tsx      home (moved from src/app/index.tsx, unchanged)
    (tabs)/account.tsx    account tab
    (auth)/_layout.tsx    Stack, presented as a modal
    (auth)/sign-in.tsx    moved from (onboarding)
    (auth)/verify.tsx     moved from (onboarding)
    profile/edit.tsx      edit name + avatar (signed-in only)
    preferences-edit.tsx  travel preferences from settings
    (onboarding)/…        intro, preferences, welcome (unchanged)
  ```

- **Guards in the root layout** (all `Stack.Protected`, no manual redirects):
  - `entered`: `(tabs)`, `design-system`, `preferences-edit`.
  - `isSignedIn`: `profile/edit`.
  - `!entered`: `(onboarding)`.
  - `!isSignedIn`: `(auth)`. Guests and onboarding users can both open it. It closes on its own when sign-in succeeds, because the guard flips.
  - `/language` stays open to everyone.
- **Why `(auth)` moves:** guests are "entered", so they can't reach routes inside `(onboarding)`. With `/sign-in` in its own group, the welcome screen and the account tab push the same screen.
- **Gate hook:** `useRequireSignIn()` lives in `src/auth/require-sign-in.ts` and returns `(reason: 'aiSearch' | 'policy' | 'booking') => boolean`.
  - Signed in: it returns `true`.
  - Otherwise: it opens `/sign-in?reason=…` and returns `false`. `/sign-in` shows a short line explaining why, e.g. 「登入後才能預訂房源」.
  - Nothing calls it yet, because those features don't exist. `/design-system` gets a dev button to try it.
- **Account tab, signed in:**
  - Header: avatar (`user.imageUrl`), name (`fullName`, or the part of the email before `@`), and email.
  - Row 編輯個人資料 → `/profile/edit`.
  - **設定** section:
    - 語言 → `/language` sheet, showing the current language's endonym.
    - 旅遊偏好 → `/preferences-edit`, showing the selected categories.
  - 登出 button: `useSession().signOut`.
  - 刪除帳號 button (danger): a native confirm `Alert.alert` with a destructive action, then `user.delete()`. The guard then returns the app to onboarding.
- **Account tab, guest:**
  - A sign-in card: 「登入後可以使用一句話搜尋、詢問房源規定和預訂」 with buttons 使用 Google 繼續 and 使用 Email 繼續. Google reuses `useGoogleSignIn`; Email opens `/sign-in`.
  - The same 設定 section, without sign-out or delete.
- **Edit profile:**
  - First and last name use `TextField`, saved with `user.update({ firstName, lastName })`.
  - Avatar: tap to pick with **`expo-image-picker`** (new dependency, works in Expo Go; approving this plan approves it). It uses square crop and `base64`, then `user.setProfileImage({ file: 'data:image/jpeg;base64,…' })`. There's also a remove-photo option (`file: null`).
  - The screen shows loading, error, and success states.
- **Shared components:**
  - The preference chip grid moves to `src/components/preferences/category-picker.tsx`, used by onboarding `/preferences` and `/preferences-edit`.
  - New UI pieces for the account screen: `Avatar` (image, or initials fallback on `bg-secondary`) and a `ListRow` (icon, label, value, chevron, pressed state). They go in `src/components/account/` until a second screen needs them.
- **Clerk dashboard** (user action): allow users to delete their own account in the Clerk dashboard; the build checks the exact setting name, since `user.delete()` fails without it.
- **i18n:** `tabs.*`, `account.*`, and `auth.reason.*` keys in all 4 locales.

## Out of scope

- The gated features themselves (AI search, policy Q&A, booking) and their API routes.
- Favorites.
- Changing the email address or linking more accounts.
- An appearance setting.

## Steps

### 1. Move auth screens and add guards
- Move `sign-in.tsx` and `verify.tsx` into `src/app/(auth)/`, with a Stack `_layout` presented as a modal and a close button in the header row.
- Add the `(auth)` guard to the root layout.
- Welcome's 「使用 Email 繼續」 still opens `/sign-in`.

Done when the existing email and Google flows still pass the web CDP flow from plan 07.

### 2. Tabs
- Create `(tabs)/_layout.tsx` with NativeTabs, and move home into `(tabs)/index.tsx`.
- Update the root guards.
- `design-system` stays a root screen.

Done when home looks the same with a tab bar and the onboarding gating still works.

### 3. Account tab
- Add `Avatar` and `ListRow`, and the signed-in and guest states.
- Add `preferences-edit.tsx` with `CategoryPicker`, which is also refactored into the onboarding preferences screen.
- Sign out and delete account (with confirm).

### 4. Edit profile
Install `expo-image-picker` with `npx expo install` and build `profile/edit.tsx`.

### 5. Guest gate
Add `useRequireSignIn`, the `reason` line on `/sign-in`, and the dev button on `/design-system`.

## Verification

- `npx expo lint`, `npx tsc --noEmit`, and `npx expo export` for ios, android, and web.
- Web CDP flow with the test account `staylo-test+clerk_test@example.com` / `424242`:
  - **Guest:** skip onboarding → 稍後再說 → home with tabs → 帳號 tab shows the sign-in card → 使用 Email 繼續 → code → the modal closes → the 帳號 tab shows the profile.
  - **Settings:** change preferences → the home order changes. The language row opens the sheet.
  - **Edit name:** change the name → the account header updates. Then restore it.
  - **Sign out:** back to intro.
  - **Gate:** the dev button while a guest → `/sign-in` with the reason line.
  - Screenshots of the account tab (signed in and guest), edit profile, and `/sign-in` with a reason, in light and dark, zh-TW and en.
- Device, by the user in Expo Go:
  - Native tab bar look.
  - Avatar pick and upload.
  - Delete account, on a throwaway account (it's permanent).
- Delete account isn't automated, because it would delete the shared test account.

## AGENTS.md updates

- **Auth and onboarding:**
  - Guests (「稍後再說」) can browse listings and keyword-search.
  - AI search, policy questions, and booking require sign-in. The UI calls `useRequireSignIn(reason)` before them, and their API routes reject requests without a Clerk session (this is already a rule).
  - `/sign-in` and `/verify` live in `(auth)`, guarded by `!isSignedIn` and reachable from onboarding and the account tab.
  - The guard list moves here.
- **Expo:** the app uses `NativeTabs` in `src/app/(tabs)/`. Tabs don't animate between each other.

## Result

Built as planned, with these changes found during the build:

- **Sign-in is one modal route, `src/app/sign-in.tsx`, with an email step and a code step.** `(auth)` and `/verify` were dropped.
  - With two routes, closing the modal on web had to pop two history entries, and the browser pulled the URL back to `/verify`.
  - The route is not guarded, and it closes itself (`beforeActivate` in `useEmailCode().verify`) just before the session activates.
- **Root cause of "lands on Explore after signing in":** Clerk briefly reports not-loaded while a new session activates. The root layout renders `null` until loaded, so the whole navigator unmounted and remounted on its first route. `useSession().loaded` now latches once true.
- **Clerk `finalize()` gets a no-op `navigate`.** Without it, Clerk navigates to its after-sign-in URL on web.
- **Web tab bar:** `NativeTabs` renders a pill at the top of the page on web, so tab screens add `WEB_TAB_BAR_INSET`.
- **Destructive actions confirm** through `confirmDestructive`: delete account and remove photo.
- **New Button variant `destructive`.**
- **Every back button shows the chevron only** (`headerBackButtonDisplayMode: 'minimal'`), so route groups like `(tabs)` never show up as back-button text.
- **The edit-profile name fields have visible labels.**

Verified:
- Lint, tsc, and the ios/android/web exports pass.
- Web CDP flow with `staylo-test+clerk_test@example.com`, in zh-TW light and en dark:
  - The gate deep link shows the reason.
  - Guest → Account tab shows the sign-in card.
  - Email sign-in from the Account tab returns to `/account` showing the profile.
  - The preferences edit saves (the row shows the chosen category).
  - A name edit shows "Saved" and is restored to the original.
  - Sign out goes to `/intro`.
- The onboarding sign-in path still lands on home.

Not verified on device: the native tab bar, avatar pick and upload, delete account (permanent; use a throwaway account), and the remove-photo confirm.
