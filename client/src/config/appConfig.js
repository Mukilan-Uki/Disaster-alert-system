// src/config/appConfig.js
//
// Single source of truth for branding. Nothing in the UI should hardcode a
// brand name, color, or contact address — import it from here instead.
//
// All values are sourced from REACT_APP_* environment variables (CRA inlines
// these at build time) with sane fallbacks so the app still runs if a
// variable is missing. To rebrand the product, edit .env and rebuild —
// no component code needs to change.

const env = process.env;

export const appConfig = {
  name: env.REACT_APP_NAME || "AlertLanka",
  shortName: env.REACT_APP_SHORT_NAME || "AlertLanka",
  tagline:
    env.REACT_APP_TAGLINE || "Early warning, built for Sri Lanka.",
  description:
    env.REACT_APP_DESCRIPTION ||
    "Real-time disaster alerts and weather intelligence for every district in Sri Lanka.",

  company: {
    name: env.REACT_APP_COMPANY_NAME || "AlertLanka",
    supportEmail: env.REACT_APP_SUPPORT_EMAIL || "support@alertlanka.lk",
    contactEmail: env.REACT_APP_CONTACT_EMAIL || "hello@alertlanka.lk",
  },

  emergency: {
    // National Disaster Management Centre hotline. Do not remove — this is
    // shown on every alert and error surface.
    hotline: env.REACT_APP_EMERGENCY_CONTACT || "1990",
  },

  theme: {
    primary: env.REACT_APP_PRIMARY_COLOR || "#3FC1C9",
    secondary: env.REACT_APP_SECONDARY_COLOR || "#F2A93B",
  },

  assets: {
    logoUrl: env.REACT_APP_LOGO_URL || "/logo.svg",
    faviconUrl: env.REACT_APP_FAVICON_URL || "/favicon.ico",
    ogImageUrl: env.REACT_APP_OG_IMAGE_URL || "/og-image.png",
  },

  social: {
    twitter: env.REACT_APP_SOCIAL_TWITTER || "",
    facebook: env.REACT_APP_SOCIAL_FACEBOOK || "",
  },

  links: {
    siteUrl: env.REACT_APP_SITE_URL || "https://alertlanka.lk",
  },

  // Map + weather config lives here too so it's not scattered across files.
  weather: {
    apiKey: env.REACT_APP_WEATHER_API_KEY || "",
    defaultCity: env.REACT_APP_DEFAULT_CITY || "Colombo",
    mapTileUrl:
      env.REACT_APP_MAP_TILE_URL ||
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
};

/**
 * Pushes theme.primary / theme.secondary onto CSS custom properties so the
 * whole stylesheet (Tailwind utilities included, via arbitrary value syntax
 * like `text-[var(--brand-primary)]`) reflects the configured brand colors
 * without a rebuild being strictly required for color-only tweaks made via
 * a runtime-injected env (e.g. window.__ENV__ in a containerized deploy).
 */
export function applyBrandTheme() {
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", appConfig.theme.primary);
  root.style.setProperty("--brand-secondary", appConfig.theme.secondary);
  document.title = appConfig.name;
}

export default appConfig;
