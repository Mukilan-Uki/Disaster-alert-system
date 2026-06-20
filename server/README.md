# Disaster Alert Server

Minimal Express server that provides a weather proxy endpoint.

Setup

1. Create `server/.env` with:

```
OPENWEATHER_API_KEY=your_api_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/disaster_alert?retryWrites=true&w=majority
PORT=5000
```

2. Install dependencies and run:

```
cd server
npm install
npm start
```

The server exposes `GET /api/weather?city=Colombo` which proxies OpenWeatherMap.
