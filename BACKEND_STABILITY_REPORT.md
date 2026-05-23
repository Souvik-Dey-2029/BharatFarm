# BharatFarm Backend Stability Report

## Routes Audited

- `GET /api/health`
- `GET /api/mobile-config`
- `GET /download-app`
- `GET /api/expo-session`
- `POST /api/expo-session`
- `GET /api/expo-qr.svg`
- `POST /api/chat`
- `POST /api/schemes`
- `POST /api/analyze-leaf`
- `GET /api/wiki`
- `GET /api/quizzes`
- `GET /api/leaderboard`
- `GET /api/achievements`
- `GET /api/weather/geocode`
- `GET /api/weather`
- `POST /api/otp/send`
- `POST /api/otp/verify`
- `POST /api/submit-payment`

## Fixes Applied

- CORS uses open origin without invalid credential mode.
- `/download-app` uses the normalized production APK URL, not raw environment text.
- `/api/mobile-config` now exposes release notes and build status for website and mobile consumers.
- Mobile weather calls now go through the Render backend instead of public APIs directly.
- Mobile API service has endpoint-level offline responses for AI, scanner, schemes, wiki, quizzes, leaderboard, achievements, payments, and weather.

## Deployment Notes

- Render health check path is `/api/health`.
- `OPENROUTER_API_KEY` improves AI quality but is not required for the app to remain usable.
- `BHARATFARM_APK_URL` controls whether the ecosystem runs in production APK mode.
