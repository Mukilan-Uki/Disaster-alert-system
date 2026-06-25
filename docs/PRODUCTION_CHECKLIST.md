# Production Checklist — What's Done vs. Still Open

This redesign pass touched the **frontend only**. The Express/MongoDB backend,
auth flow, alert logic, weather monitoring job, and all API contracts are
**untouched** — exactly as instructed.

## ✅ Shipped in this pass

- [x] Tailwind CSS + PostCSS build pipeline added to the existing CRA app
- [x] Centralized branding config (`src/config/appConfig.js`) — no hardcoded
      brand strings in the new components
- [x] Reusable design system: Button, Card, Badge, Input, Modal, Toast, Tabs,
      Skeleton, EmptyState, Loader (`src/components/ui/`)
- [x] Dark mode with persistence + system-preference fallback (`ThemeContext`)
- [x] Landing page rebuilt with all 11 requested sections (hero, live alert
      preview, weather intelligence preview, features, map preview, safety
      preparedness, emergency contacts, testimonials, FAQ, final CTA, footer)
- [x] Navigation redesigned (responsive, icon set, dark-mode toggle, language
      toggle preserved)
- [x] Login & Register redesigned: split-screen layout, password strength
      indicator, all existing auth logic (3-step register, geolocation,
      preferences) preserved byte-for-byte in behavior
- [x] 404 / 500 / Offline error pages
- [x] Basic SEO: Open Graph + Twitter card tags, `robots.txt`, `sitemap.xml`
- [x] Accessible base patterns: visible focus rings, `aria-*` on interactive
      components, `prefers-reduced-motion` respected globally

## 🟡 Partially covered

- Dashboard / Alerts / Profile / Admin pages **still use the original CSS** —
  they were not restyled in this pass and will look visually inconsistent
  next to the new landing/auth pages until restyled.
- i18n: new landing/auth copy is in English only. The existing `en`/`si`
  translation files were not extended with keys for the new sections.

## 🔴 Not started (explicitly deferred — see note below)

- Admin-managed CMS for landing/FAQ/safety-tips/footer content (currently
  still hardcoded in the React components, not database-backed)
- Skeleton loading states wired into live data fetches on Dashboard/Alerts
- Full WCAG audit (contrast ratios, screen-reader pass, full keyboard-trap
  testing on every page)
- Mobile/tablet-specific (not just scaled) layouts beyond what Tailwind's
  responsive utilities give by default
- Remaining documentation files: `PROJECT_SETUP.md`, `LOCAL_SETUP.md`,
  `MONGODB_SETUP.md`, `GOOGLE_AUTH_SETUP.md`, `WEATHER_API_SETUP.md`,
  `DATABASE_SCHEMA.md`, `PROJECT_ARCHITECTURE.md`, `API_DOCUMENTATION.md`,
  `ADMIN_GUIDE.md`, `USER_GUIDE.md`
- Security review pass (the brief asked for one; none was performed here)

This list exists so nothing above silently gets assumed "done." Tell me which
of these to pick up next and I'll continue in the same pattern: real, working
code, nothing stubbed without saying so.
