Developer setup and verification

1. Install dependencies

```
# root (orchestration scripts: npm run dev)
npm install

# frontend
cd client
npm install

# backend
cd ../server
npm install
```

2. Create local env files (do NOT commit):

```
# server/.env  (copy from server/.env.example)
OPENWEATHER_API_KEY=your_openweather_key
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/disaster_alert?retryWrites=true&w=majority
PORT=5000
DEFAULT_CITY=Colombo

# client/.env  (copy from .env.example at repo root)
REACT_APP_WEATHER_API_KEY=your_openweather_key
```

3. Run dev servers (from project root)

```
npm run dev
```

4. Quick verification checklist

- Visit `http://localhost:3000` to load the React app.
- Confirm the map loads and pages navigate.
- Verify backend health: `http://localhost:5000/api/health`
- Verify weather API: `http://localhost:5000/api/weather?city=Colombo`
- Seed a `cities` document in MongoDB (see `Database-Design.md`) to test risk metadata in the weather response.
- Check browser console for runtime errors.
