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
JWT_SECRET=your_long_random_secret_here
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

- Visit `http://localhost:3000` for the landing page.
- Register at `/register` (3-step signup with location permission).
- Open `/dashboard` for weather + Safe/Warning/Danger risk badge.
- Verify backend health: `http://localhost:5000/api/health`
- Verify weather risk: `http://localhost:5000/api/weather/risk?city=Colombo`
- Test auth: `POST http://localhost:5000/api/auth/register` with JSON body `{ "name", "email", "password" }`
- Check browser console for runtime errors.
