# BharatFarm APK Deployment Report

## Implemented APK Distribution

- `GET /api/mobile-config` returns `apkUrl`, `version`, `mode`, `releaseNotes`, `buildStatus`, `downloadPageUrl`, and QR/demo metadata.
- `GET /download-app` serves a branded BharatFarm Android install page.
- Website landing APK card points to `/download-app`.
- QR generation uses the local `/api/expo-qr.svg` endpoint and encodes the real download page or APK target.
- Production mode avoids localhost, LAN IPs, Expo Go URLs, and Metro-only assumptions when `BHARATFARM_APK_URL` is configured.

## Required Render Environment

Set this after the EAS APK is uploaded to a stable HTTPS location:

```env
BHARATFARM_APK_URL=https://your-hosted-file.example/bharatfarm-v1.0.0.apk
```

Valid hosts include GitHub Releases, a CDN, S3/R2, or another direct HTTPS file URL.

## EAS Configuration

- `mobile/eas.json` production Android profile now builds an APK, not only an app bundle.
- `mobile/app.json` Android adaptive icon images are explicitly configured.
- Deprecated external storage permissions were removed.

## Judge Flow

1. Open BharatFarm website.
2. Tap or scan Download Android APK.
3. Browser opens `/download-app`.
4. APK downloads from `BHARATFARM_APK_URL`.
5. Install and open BharatFarm.
6. App connects to Render and falls back offline when needed.
