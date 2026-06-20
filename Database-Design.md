# Database Schema Design - Sri Lanka Disaster Alert System

This project uses **MongoDB** with **Mongoose** models. Documents are stored in two collections.

## Connection

Set `MONGODB_URI` in `server/.env` (see `server/.env.example`).

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/disaster_alert?retryWrites=true&w=majority
```

---

## Collections

### 1. `cities` Collection

Stores disaster-risk metadata for Sri Lankan cities.

**Mongoose model:** `server/src/models/City.js`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | String | yes | Custom document id (e.g. `city_001`) |
| `name` | String | yes | City name (unique) |
| `coordinates.lat` | Number | yes | Latitude |
| `coordinates.lng` | Number | yes | Longitude |
| `riskType` | String | no | Primary risk (e.g. `flood`, `landslide`) |
| `severity` | String | no | Risk level (e.g. `low`, `medium`, `high`) |
| `population` | String | no | Human-readable population estimate |

**Example document:**

```javascript
{
  _id: "city_001",
  name: "Colombo",
  coordinates: { lat: 6.9271, lng: 79.8612 },
  riskType: "flood",
  severity: "high",
  population: "5.6 million"
}
```

---

### 2. `alert` Collection

Stores active disaster alerts affecting one or more cities.

**Mongoose model:** `server/src/models/Alert.js`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | String | yes | Custom document id (e.g. `alert_001`) |
| `type` | String | yes | Alert type (e.g. `flood`, `cyclone`) |
| `title` | String | yes | Short alert headline |
| `affectedCities` | String[] | no | City names impacted by this alert |
| `severity` | String | no | Alert severity level |

**Example document:**

```javascript
{
  _id: "alert_001",
  type: "flood",
  title: "Flood Warning - Colombo",
  affectedCities: ["Colombo"],
  severity: "high"
}
```

---

## API usage

- `GET /api/weather?city=Colombo` fetches live weather from OpenWeatherMap and, when a matching `cities` document exists, merges `riskType`, `severity`, and `population` into the response.

---

## Seed example (MongoDB shell)

```javascript
db.cities.insertOne({
  _id: "city_001",
  name: "Colombo",
  coordinates: { lat: 6.9271, lng: 79.8612 },
  riskType: "flood",
  severity: "high",
  population: "5.6 million"
});

db.alert.insertOne({
  _id: "alert_001",
  type: "flood",
  title: "Flood Warning - Colombo",
  affectedCities: ["Colombo"],
  severity: "high"
});
```
