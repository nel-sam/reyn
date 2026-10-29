This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

This repository currently uses npm (`package-lock.json` is present). Use `npx` for Expo commands; if the package manager changes, follow its lockfile (`bun.lock` means use `bunx`).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npm run start               # start the dev server
npm run ios                 # start on iOS
npm run android             # start on Android
npm run web                 # start on web
npx expo lint               # lint (when supported by the installed Expo CLI)
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

The package scripts currently expose start, ios, android, and web; there is no dedicated test script. Run lint and typecheck before declaring a code task done.

## Project Structure and Current Patterns

- `src/app/` is the Expo Router route directory. `index.tsx` is the root screen and `_layout.tsx` defines the root stack. Typed routes are enabled in `app.json`.
- `src/app/_layout.tsx` wraps the router stack in `GestureHandlerRootView`; screens use a headerless stack by default.
- The root screen in `src/app/index.tsx` currently renders `Rainer` and the Expo status bar. It imports `src/global.css` for the Tailwind CSS v4 and Uniwind setup.
- The current feature component lives at `src/app/components/rainer.tsx`. It displays `assets/USD_1.jpg` full-screen and uses React Native Gesture Handler with Reanimated shared values/styles for an upward swipe-to-dismiss interaction. Keep animation work on the UI thread through Reanimated; this component currently dismisses after a swipe of about 40% of screen height or an upward velocity above 800, otherwise springing back.
- Keep route files in `src/app/`. The existing feature component is colocated under `src/app/components/`; place new generally reusable components, hooks, and utilities outside the route directory as the project grows so they are not treated as routes.
- Styling currently mixes React Native `StyleSheet`/inline styles with the global Tailwind/Uniwind CSS setup. Follow the style already used by the component being changed rather than introducing another styling system.
- Expo SDK is 58, React Native is 0.88, and React is 19. Before using Expo or React Native APIs, check the matching versioned Expo docs as described above.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
