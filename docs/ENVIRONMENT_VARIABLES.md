# Environment Variables Reference

## Client (`client/.env`)

| Variable | Purpose | Default |
|---|---|---|
| `REACT_APP_NAME` | Full product name shown in copy/title | AlertLanka |
| `REACT_APP_SHORT_NAME` | Compact name used in the nav/footer logo | AlertLanka |
| `REACT_APP_TAGLINE` | One-line tagline | Early warning, built for Sri Lanka. |
| `REACT_APP_DESCRIPTION` | Used in hero copy, meta description, footer | — |
| `REACT_APP_COMPANY_NAME` | Legal/company name in footer | AlertLanka |
| `REACT_APP_SUPPORT_EMAIL` | Shown in footer | support@alertlanka.lk |
| `REACT_APP_CONTACT_EMAIL` | Shown on landing final CTA | hello@alertlanka.lk |
| `REACT_APP_PRIMARY_COLOR` | Brand primary color (hex) | #3FC1C9 |
| `REACT_APP_SECONDARY_COLOR` | Brand secondary color (hex) | #F2A93B |
| `REACT_APP_LOGO_URL` | Path/URL to logo asset | /logo.svg |
| `REACT_APP_FAVICON_URL` | Path/URL to favicon | /favicon.ico |
| `REACT_APP_OG_IMAGE_URL` | Open Graph share image | /og-image.png |
| `REACT_APP_SITE_URL` | Canonical site URL, used in sitemap | https://alertlanka.lk |
| `REACT_APP_WEATHER_API_KEY` | OpenWeatherMap key (existing) | — |
| `REACT_APP_MAP_TILE_URL` | Leaflet tile URL (existing) | OpenStreetMap |
| `REACT_APP_EMERGENCY_CONTACT` | DMC hotline number shown everywhere | 1990 |
| `REACT_APP_DEFAULT_CITY` | Default city for weather preview | Colombo |

All of these are consumed in one place: `client/src/config/appConfig.js`. No component should read `process.env` directly — import `appConfig` instead.

> CRA inlines `REACT_APP_*` variables at **build time**. Changing `.env` requires a rebuild (`npm run build`) to take effect in production — it is not a runtime config server.

## Server (`server/.env`)

See `server/.env.example` for the existing, unmodified backend variables (Mongo URI, JWT secret, OpenWeather key, SMTP/web-push credentials, etc.). These were not changed as part of this UI pass.
