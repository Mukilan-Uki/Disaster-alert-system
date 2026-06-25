# Database Schema Design - Sri Lanka Disaster Alert System

This project uses **MongoDB** with **Mongoose** models. Documents are stored in two collections.

## Connection

Set `MONGODB_URI` in `server/.env` (see `server/.env.example`).

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/disaster_alert?retryWrites=true&w=majority
```

---

## Collections

### 0. `users` Collection

Stores registered users with location and alert preferences.

**Mongoose model:** `server/src/models/User.js`

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `email` | String | Unique login email |
| `passwordHash` | String | Bcrypt hashed password |
| `phone` | String | Optional phone for SMS |
| `alertPreferences` | Object | Per-disaster toggles (flood, cyclone, etc.) |
| `notificationChannels` | Object | webPush, email, sms toggles |
| `lastKnownLocation` | Object | lat, lng, city, district, updatedAt |
| `isActive` | Boolean | Account status |

---

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

Stores disaster alerts sent to users (created by the risk monitor).

**Mongoose model:** `server/src/models/Alert.js`

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | flood, cyclone, heavyRain, heat, landslide |
| `title`, `message` | String | Alert headline and body |
| `severity` | String | safe, warning, danger |
| `affectedUsers` | ObjectId[] | Users who received this alert |
| `affectedCities` | String[] | City names |
| `weatherSnapshot` | Object | Weather at time of alert |
| `status` | String | active, expired, cancelled |
| `readBy` | Array | Read tracking per user |
| `expiresAt` | Date | Auto-expire time |

### 3. `notifications` Collection

**Mongoose model:** `server/src/models/Notification.js`

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Recipient |
| `alertId` | ObjectId | Linked alert |
| `alertType` | String | Used for 2-hour deduplication |
| `channel` | String | web_push, in_app, email, sms |
| `title`, `body` | String | Notification content |
| `sentAt`, `readAt` | Date | Delivery timestamps |

---

## API usage

- `GET /api/weather/risk` — live weather + risk level
- `GET /api/alerts` — active alerts for logged-in user
- `POST /api/admin/monitor/run` — manually trigger weather monitor (demo)
- `POST /api/notifications/subscribe` — save Web Push subscription

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
