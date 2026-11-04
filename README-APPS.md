# رحلة الإيمان – Windows app (.exe) and Android app (.apk)

The web version (Lovable / Cloudflare) is **unchanged**. Everything below is added next to it.

## What was added
| File | Purpose |
|---|---|
| `vite.app.config.ts`, `spa/` | Static build (no server) -> `dist-app/`. Uses hash routing (`#/adventure/...`) so it works offline |
| `electron/main.cjs` + `build` block in `package.json` | Windows app (installer + portable .exe) |
| `capacitor.config.json` | Android app (APK) |
| `resources/` | App icons (made from the Younes + Felfel image) |
| `.github/workflows/build-apps.yml` | Builds both apps in the cloud |
| `@fontsource/cairo`, `@fontsource/tajawal` | Fonts bundled inside the app (no internet needed) |

## Option A – no tools on your PC (recommended)
1. Upload this project to a GitHub repository (it already is one if it came from Lovable).
2. GitHub -> **Actions** -> **Build Windows app + Android APK** -> **Run workflow**.
3. Wait ~10 minutes. Download from the run page:
   - `windows-installer` -> `RehlatIman-Setup-1.0.0.exe` and `RehlatIman-Portable-1.0.0.exe`
   - `android-apk` -> `app-debug.apk`

## Option B – build on your PC
Needs Node.js 22+. For Android also Android Studio + JDK 21.
```sh
npm install
npm run app:dev          # test the static app in the browser (http://localhost:5174)

# Windows
npm run electron:dev     # run as desktop app
npm run electron:build   # -> release/*.exe   (run this on Windows)

# Android
npx cap add android                                   # first time only
npx capacitor-assets generate --android --assetPath resources
npm run android:sync
npm run android:open     # Android Studio -> Build > Build APK(s)
```

## Notes
- **APK**: the file from the workflow is a *debug* APK. It installs fine on any phone (allow "install unknown apps"). For Google Play you need a signed release AAB (create a keystore in Android Studio: Build > Generate Signed Bundle).
- **Windows**: the .exe is not code-signed, so Windows SmartScreen may show "unknown publisher" -> More info -> Run anyway. A code-signing certificate removes this.
- **Data**: students and progress are saved on the device (localStorage). They are not shared between phone and PC.
- Change app id / name in `capacitor.config.json` and in the `build` block of `package.json` (`com.rehlatiman.app`).
- After the first successful run, `package-lock.json` is created on your PC; commit it to make CI builds reproducible.
