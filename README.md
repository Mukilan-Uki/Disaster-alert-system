# Sri Lanka Disaster Alert System

A **React-based disaster management application** providing real-time weather alerts, interactive maps, and preparedness information for Sri Lanka.

## Features
- ** Real-time Weather**: Live data from OpenWeatherMap API
- ** Interactive Map**: Sri Lanka map with Leaflet/OpenStreetMap
- ** Responsive Design**: Works perfectly on mobile & desktop
- ** Disaster Alerts**: City-wise risk assessment
- ** Emergency Info**: Important contact numbers

## Tech Stack
- **Frontend**: React.js
- **APIs**: OpenWeatherMap + Leaflet Maps
- **Styling**: CSS3 with media queries
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Mukilan-Uki/Disaster-alert-system.git

# 2. Navigate to project
cd Disaster-alert-system

# 3. Install dependencies (frontend and backend are separate)
cd client && npm install
cd ../server && npm install

# 4. Start both dev servers from the project root
cd ..
npm run dev
```

This starts the React app at `http://localhost:3000` and the Express API at `http://localhost:5000`.

To run only the frontend or backend:

```bash
# Frontend only
cd client && npm start

# Backend only
cd server && npm start