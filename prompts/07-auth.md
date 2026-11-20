# 07 · Sign-in with Clerk (Google + email code)

Status: done

## 中文摘要（快速審閱用）

- **要做的事：** 用 Clerk 取代現在的假登入，支援兩種方式：
  - **Google 登入：** 跳到系統瀏覽器登入，完成後回到 App。
  - **Email 驗證碼登入：** 不用密碼，輸入 email 後收 6 位數驗證碼。第一次用的人會自動註冊，不必分「登入」或「註冊」。
- **不做的事：**
  - **手機簡訊登入：** 正式上線沒有免費的簡訊服務。Clerk 要 Pro 方案（US$25/月）加台灣簡訊費；Twilio 每次約 US$0.13。之後要做時，再開 Clerk Pro 並開放 +886。
  - 個人資料頁、API 驗證。
- **畫面：**
  - 歡迎頁：「使用 Google 繼續」、「使用 Email 繼續」、「稍後再說」。
  - `/sign-in`：輸入 email。
  - `/verify`：輸入驗證碼，可以「重新傳送」（每 30 秒一次）或「更換 Email」。
  - 錯誤訊息直接顯示在畫面上，例如 email 格式錯、驗證碼錯誤或過期、嘗試太多次、網路錯誤。
- **新增套件：** `@clerk/expo`、`expo-secure-store`、`expo-auth-session`、`expo-crypto`。核准計畫就等於同意安裝。
- **程式架構：**
  - `useSession()` 對外介面不變，內部改接 Clerk，所以首頁和引導頁的切換邏輯都不用改。
  - 登入成功後會自動進首頁。
  - Clerk 會把登入狀態安全地存在手機裡，App 關掉重開仍是登入狀態。
- **你要先做：**
  1. 建立 Clerk 應用程式。
  2. 在 Clerk 後台：開啟 Email 驗證碼，關掉密碼和手機，開啟 Google。
  3. 在 Clerk 後台加入跳轉網址 `staylo://sso-callback`。
  4. 把 publishable key 放進 `.env`。這是公開金鑰，可以放進 App。
- **風險：** Clerk 文件沒寫清楚 Google 瀏覽器登入能不能在 Expo Go 用。如果不行，我會回報，並建議改用開發版 build。
- **驗證方式：**
  - lint、型別檢查、三平台匯出。
  - 在網頁版自動跑一次 Email 驗證碼流程：用 Clerk 的測試信箱，驗證碼 424242。
  - Google 登入和手機上的實際體驗由你在 Expo Go 測。

## Context

Auth is a mock today: `src/auth/session.tsx` stores a fake `signed-in` flag, and both "建立帳號" and "登入" on `/welcome` just flip it. AGENTS.md says Clerk owns auth while the app keeps its own custom screens. The user wants real sign-in with Google and email verification.

They asked about SMS providers and whether any are free. Research done on 2026-11-20:
- **Clerk built-in SMS:** free in development. Production needs Pro (US$25/mo), Taiwan SMS is billed at "market rate", and +886 must be allowed in the dashboard.
- **Twilio Verify:** US$0.05 per verification plus about US$0.084 per Taiwan SMS. Only a trial is available.
- **Firebase phone auth:** needs the Blaze plan.
- **Mitake / Every8d:** their pages couldn't be read.

No provider is free in production, so the user chose to **skip phone sign-in for now** and build Google + passwordless email code.

On approval, copy this plan to `prompts/07-auth.md` (`Status: approved`), as the AGENTS.md workflow requires.

## Decisions

- **Provider:** Clerk with `@clerk/expo` (latest 4.17.2, peer `expo >=54 <59`, so SDK 58 is fine).
- **Dependencies:** `@clerk/expo`, `expo-secure-store`, `expo-auth-session`, `expo-crypto`, installed with `npx expo install`. `expo-web-browser` is already installed. Approving this plan approves these dependencies.
- **Google:** browser OAuth via `useSSO().startSSOFlow({ strategy: 'oauth_google', redirectUrl })`. `redirectUrl` comes from `AuthSession.makeRedirectUri({ scheme: 'staylo', path: 'sso-callback' })`. In development it uses Clerk's shared Google credentials, so no Google Cloud setup is needed.
- **Email:** passwordless 6-digit code, one combined flow. Try sign-in with an email code first; if no account exists, switch to sign-up with an email code. The user never picks "sign in" vs "sign up".
- **Phone:** not built. The email entry screen is structured so a phone tab can be added later. No placeholder UI.
- **Gating is unchanged:** `useSession()` keeps its shape (`loaded`, `isSignedIn`, `isGuest`, `continueAsGuest`, `signOut`), now backed by Clerk's `useAuth()`. The mock `signIn()` is removed. `Stack.Protected` in `_layout.tsx` flips to home on its own once Clerk has a session.
- **Keys:** `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` goes in `.env`, which is gitignored. It's a public key, so it's fine in the bundle. Add a `.env.example` with the name only. No secret key is needed yet (there are no API routes).
- **Exact Clerk API:** current Clerk docs use the "Future" API (`signIn.emailCode.sendCode`, `signUp.verifications.sendEmailCode`, `finalize`, `setActive`), but they were written against v3. Before writing calls, confirm them for v4 through the Clerk MCP or docs (AGENTS.md: no version-specific API from memory). The same check covers whether `ClerkProvider` already calls `WebBrowser.maybeCompleteAuthSession()` (the sources disagree).

## Screens and flow

```
/welcome
  [G] 使用 Google 繼續   → system browser → back with session → home (guard flips)
  [✉] 使用 Email 繼續    → /sign-in
      稍後再說            → guest (unchanged)
/sign-in   email TextField + 「傳送驗證碼」 → /verify?email=…
/verify    6-digit code field (one-time-code autofill), 「驗證」
           「重新傳送」 with a 30 s cooldown, 「更換 Email」 goes back
```

- Errors show inline with the existing `Alert` component: invalid email, wrong or expired code, too many attempts, network or Google cancelled. A cancelled Google browser stays silent.
- Buttons show `loading` while a request is in flight.
- `/sign-in` and `/verify` live in `src/app/(onboarding)/`, so they're behind the same `!entered` guard.
- `/welcome` drops the "帳號功能即將推出" note.
- On web, if `useSSO` turns out not to support react-native-web, the Google button is hidden on web and email works everywhere. This is decided at build time and noted in the result.

## Files

- **New:**
  - `src/app/(onboarding)/sign-in.tsx` and `verify.tsx`.
  - `src/auth/google.ts`: a hook wrapping `useSSO`, Android browser warm-up, and the redirect URL.
  - `src/auth/email-code.ts`: send and verify for the combined sign-in-or-sign-up flow.
  - `src/auth/errors.ts`: maps Clerk error codes to i18n keys.
  - `.env.example`.
- **Modified:**
  - `src/auth/session.tsx`: renders `ClerkProvider` (`publishableKey`, `tokenCache` from `@clerk/expo/token-cache`) and an inner provider mapping `useAuth()` to `useSession()`. `signOut` calls Clerk `signOut()` and clears guest. It throws a clear error if the key is missing.
  - `src/app/(onboarding)/welcome.tsx`: the new buttons (the Google button uses `leadingIcon`).
  - `src/app/(onboarding)/_layout.tsx`: registers the new screens.
  - `src/components/ui/text-field.tsx`: passes `keyboardType`, `autoComplete`, `textContentType`, `maxLength`, and `autoCapitalize` through if they're missing.
  - `app.json`: plugins `expo-secure-store` and `@clerk/expo`.
  - The 4 locale files: an `auth.*` namespace.
  - `src/app/design-system.tsx`: "Replay onboarding" now also signs out of Clerk (through `useSession().signOut`).
  - `AGENTS.md`: the Auth section.
- **Reused:** `Button` (`loading`, `leadingIcon`), `TextField`, `Alert`, `Text`, `IconButton`, `Reveal`, token colors, `useTranslation`.

## You need to (before build verification)

1. Create a Clerk application, through `npx clerk apps create` or the dashboard.
2. Configure it in User & authentication:
   - Email: on, with "email verification code" on and **password off**.
   - Phone: off.
   - Google: on (shared dev credentials).
3. In Native applications, add the redirect URL `staylo://sso-callback`. If Clerk asks, also add the Expo Go URL printed by `makeRedirectUri` at runtime.
4. Put the publishable key in `.env` as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_…`. `npx clerk env pull` can write it.

## Verification

- `npx expo lint`, `npx tsc --noEmit`, and `npx expo export` for ios, android, and web.
- Web (`expo serve` + CDP headless Chrome), using a Clerk dev test address `…+clerk_test@example.com` with code `424242`. Confirm in the Clerk docs that test emails exist; if not, use a real inbox.
  - Welcome → Email → enter the address → code → lands on home.
  - Reload: still home (session persisted).
  - Wrong code: inline error.
  - Replay onboarding: back to intro, signed out.
  - Screenshots of `/sign-in` and `/verify` in light and dark, zh-TW and en.
- Device, by the user in Expo Go:
  - Google sign-in round trip.
  - Email code with a real inbox, including one-time-code autofill.
  - Kill and reopen the app: still signed in.
- **Risk:** Clerk groups `useSSO` with hooks that may need a development build. If Google fails in Expo Go, report it and propose a dev build. Don't redesign around it.

## AGENTS.md updates

- **Auth and onboarding:**
  - Replace "`src/auth/session.tsx` is a mock" with: `useSession()` wraps Clerk (`@clerk/expo`). Sign-in is Google (browser OAuth via `useSSO`) plus a passwordless email code in a combined flow. Phone/SMS is off; enabling it needs Clerk Pro and allowing +886.
  - Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env` and `.env.example`.
  - Production Google needs custom Google Cloud credentials.
- **Rules:** unchanged. The secret key stays out of the app.

## Result

Built as planned with `@clerk/expo` 4.17.2 and Core 3 resources:
- `signIn.emailCode`, then `signUp.create` + `signUp.verifications` when the email isn't found (`form_identifier_not_found`), then `finalize()`.
- Google uses the stable `useSSO` + `setActive`. `ClerkProvider` already completes the web auth session.

Extras:
- `<View nativeID="clerk-captcha" />` on `/sign-in`, so Clerk's web bot challenge has a mount point.
- `action_blocked` maps to `tooMany`.
- `TextField` drops the browser focus outline on web.
- The secret key was confirmed absent from the web bundle.

Verified:
- Lint, tsc, and the ios/android/web exports pass.
- Web CDP flow with the dashboard-created `staylo-test+clerk_test@example.com`: wrong code `000000` shows "That code isn't right", `424242` lands on `/`, and a reload stays on `/`.
- The user confirmed Google and email sign-in on a phone in Expo Go.

Learned:
- Clerk's "Challenge suspicious sign-ups" challenges headless browsers on web sign-up. Native is never challenged, so new sign-ups are tested on device.

Not automated: the client-side invalid-email message.
