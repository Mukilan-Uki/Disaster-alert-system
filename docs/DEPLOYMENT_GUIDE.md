# Deployment Guide

This covers deploying the redesigned client and the unchanged Express server.
No backend deployment steps changed — this only documents the new build requirements
introduced by Tailwind CSS.

## 1. Install dependencies

Step 1:
From the project root, install client dependencies.
```bash
cd client
npm install
```

Step 2:
This pulls in the new dependencies added for the redesign: `tailwindcss`, `postcss`,
`autoprefixer`, `framer-motion`, `lucide-react`.

## 2. Configure branding

Step 1:
Copy `client/.env.example` to `client/.env`.

Step 2:
Fill in `REACT_APP_*` values — see `ENVIRONMENT_VARIABLES.md`.

Step 3:
Rebuild after any change, since CRA inlines these at build time.

## 3. Build the client

```bash
cd client
npm run build
```

This produces a static `client/build` directory exactly as before — Tailwind is
compiled via PostCSS during this step, no extra tooling required.

## 4. Deploy targets

### Netlify / Vercel (static client)
- Build command: `npm run build`
- Publish directory: `build`
- Add all `REACT_APP_*` variables from `.env.example` in the dashboard's environment
  variable settings before triggering a build.

### GitHub Pages
- Existing `predeploy`/`deploy` scripts (`gh-pages -d build`) are unchanged and still work.

### Server (Express + MongoDB)
- No changes were made to `server/`. Deploy as before (e.g. Render, Railway, a VPS).
- Confirm `server/.env` is populated per `server/.env.example`.

## 5. Post-deploy checklist

- [ ] Visit `/` and confirm fonts (Space Grotesk / Inter / IBM Plex Mono) load
- [ ] Toggle dark mode and refresh — preference should persist
- [ ] Submit the register flow end-to-end against the live API
- [ ] Hit a non-existent route and confirm the 404 page renders
- [ ] Check `robots.txt` and `sitemap.xml` are reachable at the deployed domain
