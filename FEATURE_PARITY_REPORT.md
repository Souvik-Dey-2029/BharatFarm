# BharatFarm Feature Parity Report

Audit date: 2026-05-23

## Feature Parity Matrix

| Feature | Website | Mobile | Status |
| --- | --- | --- | --- |
| Landing experience | `index.html`, `js/landing.js` cinematic canvas and APK/demo cards | Native login and dashboard | Parity by purpose; mobile is app-first |
| Dashboard ecosystem | `app.html`, `js/dashboard.js` | `HomeScreen` | Present on both |
| AI assistant / KrishiBot | `js/chatbot.js`, `js/realtimeVoice.js`, `/api/chat` | `KrishiBotScreen`, `apiService.sendChat` | Present on both with offline fallback |
| Leaf scanner | `js/scanner.js`, `/api/analyze-leaf` | `LeafScannerScreen`, `apiService.analyzeLeaf` | Present on both with offline diagnosis fallback |
| Marketplace | `js/marketplace.js`, local listings/cart | `MarketplaceScreen` | Present on both |
| Government schemes | `js/schemes.js`, `/api/schemes` | `SchemesScreen` | Present on both |
| Weather | `js/weather.js`, `/api/weather`, cache | `WeatherScreen`, `services/weather.js` | Present on both; mobile now uses Render backend and AsyncStorage cache |
| Calculator / analytics | `js/calculator.js` | `CalculatorScreen` | Present on both |
| Crop database / roadmap | `js/crops.js`, `js/roadmap.js` | `CropsScreen` | Implemented on mobile |
| Crop health wiki | `js/wiki.js`, `/api/wiki` | `WikiScreen` | Implemented on mobile |
| Gamification / leaderboard | `js/gamification.js`, `/api/quizzes`, `/api/leaderboard`, `/api/achievements` | `gamificationStore`, `LeaderboardScreen` | Implemented on mobile |
| Notifications / alerts | `js/notifications.js` | `NotificationsScreen` | Implemented on mobile |
| Profile | `js/profile.js` | `ProfileScreen` | Present on both |
| Subscription/payment | `js/subscription.js`, `/api/submit-payment` | Payment API fallback only | Mobile subscription UI remains lighter than web |
| Offline functionality | Weather cache and API fallbacks | API offline engine, cached weather, local crop/wiki/scanner/AI data | Strengthened on mobile |

## Present On Website Only

- Full subscription/payment modal UX remains web-first.
- Full guided product tour remains web-first.

## Present On Mobile Only

- Native standalone offline data engine in `mobile/src/services/api.js`.
- Native local auth/profile state through AsyncStorage.
- Native scanner/gallery/camera flow.

## Broken Or Risky Integrations Fixed

- Mobile weather no longer calls Open-Meteo directly; it routes through Render `/api/weather` and caches last good response.
- Home dashboard navigation now opens real crop, wiki, leaderboard, and notification screens.
- React Native unsupported style properties were removed from mobile screens.
- Missing `Alert` import and invalid Ionicons references were corrected.

## Backend Dependency Issues

- `OPENROUTER_API_KEY` is optional; backend has fallback AI/scanner/schemes behavior when unavailable.
- `BHARATFARM_APK_URL` must be set on Render for production APK download mode.
- Unsplash/Pexels keys are optional; image endpoints degrade gracefully.
