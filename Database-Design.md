# Database Schema Design - Sri Lanka Disaster Alert System

## Collections

### 1. `cities` Collection
Stores information about Sri Lankan cities.

```javascript
{
  _id: "city_001",
  name: "Colombo",
  coordinates: { lat: 6.9271, lng: 79.8612 },
  riskType: "flood",
  severity: "high",
  population: "5.6 million"
}

### 2. `alert` Collection

{
  _id: "alert_001",
  type: "flood",
  title: "Flood Warning - Colombo",
  affectedCities: ["Colombo"],
  severity: "high"
}