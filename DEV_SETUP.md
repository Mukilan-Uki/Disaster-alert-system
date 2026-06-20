Developer setup and verification

1) Install dependencies

```
# root
npm install

# server
cd server
npm install
```

2) Create local env files (do NOT commit):

```
# server/.env
OPENWEATHER_API_KEY=your_openweather_key
DATABASE_URL=postgres://user:pass@localhost:5432/disaster_db
PORT=5000

# frontend: create .env in repo root if you want
REACT_APP_WEATHER_API_KEY=your_openweather_key
```

3) Run dev servers

```
npm run dev
```

4) Quick verification checklist
- Visit `http://localhost:3000` to load the React app.
- Confirm the map loads and pages navigate.
- Verify backend: `http://localhost:5000/api/weather?city=Colombo` (or 5001 if running fallback server).
- Check browser console for runtime errors.
