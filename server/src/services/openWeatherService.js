const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY =
  process.env.OPENWEATHER_API_KEY || process.env.REACT_APP_WEATHER_API_KEY;

async function fetchWeatherByCity(city = "Colombo") {
  try {
    const resp = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const d = resp.data;
    return {
      city: d.name,
      country: d.sys?.country,
      temperature: Math.round(d.main.temp),
      description: d.weather?.[0]?.description,
      icon: d.weather?.[0]?.icon,
      coordinates: { lat: d.coord.lat, lon: d.coord.lon },
    };
  } catch (err) {
    console.error("OpenWeather fetch error:", err.message || err);
    // Fallback: return mock data so frontend remains functional without API key
    const mockData = {
      colombo: {
        city: "Colombo",
        country: "LK",
        temperature: 31,
        description: "moderate rain",
        icon: "10d",
        coordinates: { lat: 6.9271, lon: 79.8612 },
      },
      kandy: {
        city: "Kandy",
        country: "LK",
        temperature: 24,
        description: "broken clouds",
        icon: "04d",
        coordinates: { lat: 7.2906, lon: 80.6337 },
      },
    };

    return mockData[city.toLowerCase()] || mockData.colombo;
  }
}

module.exports = { fetchWeatherByCity };
