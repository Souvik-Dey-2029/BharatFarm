# BharatFarm Final Judge Ready Checklist

## Consumer Flow

- [x] Website opens without developer setup.
- [x] Website shows Android APK as the primary mobile CTA.
- [x] QR opens a real install/download page.
- [x] `/download-app` is branded and install-focused.
- [x] Mobile app no longer depends on localhost, same WiFi, tunnels, Metro, or Expo Go for consumer use.

## Mobile Feature Readiness

- [x] Dashboard
- [x] KrishiBot AI assistant
- [x] Leaf scanner
- [x] Weather
- [x] Marketplace
- [x] Government schemes
- [x] Calculator / analytics
- [x] Crop database and roadmap
- [x] Crop health wiki
- [x] Notifications and offline queue messaging
- [x] Leaderboard and badges
- [x] Profile

## Offline-First Readiness

- [x] Cached weather through AsyncStorage.
- [x] Offline AI fallback responses.
- [x] Local crop database.
- [x] Offline scanner fallback diagnosis.
- [x] Backend retry and graceful fallback behavior.
- [x] Farmer-friendly degraded states instead of technical failure messages.

## Final Deployment Steps

1. Run `cd mobile && npm run doctor` (passed locally: 18/18 checks).
2. Run `cd mobile && eas build -p android --profile production`.
3. Upload the generated APK to a stable HTTPS location.
4. Set `BHARATFARM_APK_URL` on Render.
5. Redeploy Render.
6. Open `/api/mobile-config` and verify `buildStatus` is `available`.
7. Open the website, scan the APK QR, install, and test offline mode.
