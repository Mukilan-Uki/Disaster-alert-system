Frontend Structure (src/)

- `components/` - Reusable UI components (presentational, small widgets).
- `pages/` - Route-level views rendered by React Router.
- `services/` - API wrappers and clients (OpenWeatherMap client, etc.).
- `features/` - Feature-specific folders (e.g., weather, alerts) for grouped logic.
- `hooks/` - Custom React hooks.
- `context/` - React context or store for global state.
- `utils/` - Small helper functions, formatters.
- `assets/` - Images, icons and static assets used by the UI.
- `styles/` - Global/shared CSS variables and theme files (optional).

Notes:
- Many component-level CSS files are kept co-located next to their components to keep styles local and easy to maintain.
- `server/` holds the backend Express app and database configuration; it is a separate Node.js project within this repo.
