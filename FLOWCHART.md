# Application Flowchart - Disaster Alert System

## User Journey

             [User Opens App]
                    ↓
            [Home Page Loads]
                    ↓
        [Weather Data Fetched] → OpenWeatherMap API
                    ↓
            [Map Displayed] → Leaflet/OpenStreetMap
                    ↓
        [User Clicks City Marker]
                    ↓
        [Popup Shows Weather Info]
                    ↓
        [User Clicks "View Details"]
                    ↓
        [Location Details Page]
                    ↓
        [Sees Preparedness Checklist]


## Page Flow
1. **Home Page** (`/`)
   - Shows weather dashboard
   - Displays interactive map
   - Lists active alerts

2. **Location Details** (`/location/:city`)
   - Shows specific city info
   - Displays disaster preparedness
   - Emergency contacts

## Data Flow
- **Weather Data**: React → OpenWeatherMap API → Display
- **Map Data**: React → Leaflet → OpenStreetMap → Display
- **Navigation**: React Router DOM between pages