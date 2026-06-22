# Blot Browser — Android app

A real Android mobile browser: tabs, address bar, full WebView browsing of any
site, history, bookmarks, settings, and a built-in AI assistant (Becky AI)
powered by Groq.

## What's included

- `App.js` — navigation setup
- `screens/BrowserScreen.js` — the browser itself (WebView, address bar, nav controls)
- `screens/TabsScreen.js` — new tab / home screen with shortcuts
- `screens/HistoryScreen.js` — browsing history, grouped by day
- `screens/BookmarksScreen.js` — saved bookmarks
- `screens/SettingsScreen.js` — settings (matches the Blot Browser Pro layout)
- `screens/BeckyScreen.js` — AI chat screen
- `storage.js` — local persistence (AsyncStorage) for history/bookmarks/settings
- `becky.js` — Groq API integration
- `config.js` — **put your Groq API key here**
- `theme.js` — color palette (dark, red accent — matches your screenshots)

## 1. Add your Groq API key

Open `config.js` and replace the placeholder:

```js
export const GROQ_API_KEY = 'gsk_your_real_key_here';
```

Get a free key at https://console.groq.com/keys

## 2. Install dependencies

You need [Node.js](https://nodejs.org) (v18+) installed on your computer.
Android Studio is **not** required for this step.

```bash
cd blot-browser
npm install
```

## 3. Try it instantly on your phone (no build needed)

Install the **Expo Go** app from the Play Store on your Android phone, then:

```bash
npx expo start
```

Scan the QR code shown in your terminal with the Expo Go app. The browser
will load on your phone live. This is the fastest way to test everything —
WebView browsing, history, bookmarks, settings, Becky AI chat — before doing
a real build.

> Note: Expo Go is a sandbox, so this is for testing only — to get a real
> installable `.apk` you give to others or install permanently, do step 4.

## 4. Build a real installable APK (no Android Studio needed)

This uses Expo's free cloud build service (EAS), which compiles the APK on
Expo's servers — nothing is built on your machine.

```bash
npm install -g eas-cli
eas login          # create a free account at expo.dev if you don't have one
eas build:configure
eas build -p android --profile preview
```

This uploads your project and builds it in the cloud (free tier, usually
takes 10-20 minutes). When it finishes, EAS gives you a download link for
the `.apk` file. Download it to your phone and open it to install (you may
need to allow "install from unknown sources" in Android settings).

## 5. (Optional) Build locally if you do install Android Studio later

```bash
npx expo run:android
```

## Customizing

- **Home page / search engine**: edit `config.js` or change them live in the
  in-app Settings screen.
- **Colors / theme**: edit `theme.js`.
- **Default shortcuts on the new-tab screen**: edit the `SHORTCUTS` array in
  `screens/TabsScreen.js`.
- **AI model**: change `GROQ_MODEL` in `config.js`. Other Groq models:
  `llama-3.1-70b-versatile`, `mixtral-8x7b-32768`.

## Known limitations

- A handful of sites block being shown in any embedded WebView (some banks,
  some Google sign-in flows) — this is a restriction those sites enforce
  themselves, not something fixable in the app.
- This app stores history/bookmarks/settings locally on-device only. If you
  want them synced across devices via a backend (e.g. Supabase), that's a
  further step — ask and I'll wire it in.
