const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY =
  process.env.OPENWEATHER_API_KEY || process.env.REACT_APP_WEATHER_API_KEY;

function normalizeWeather(d) {
  return {
    city: d.name,
    country: d.sys?.country,
    temperature: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    pressure: d.main.pressure,
    windSpeed: Math.round((d.wind?.speed || 0) * 3.6),
    windSpeedMs: d.wind?.speed || 0,
    rainfall1h: d.rain?.["1h"] || 0,
    rainfall3h: d.rain?.["3h"] || 0,
    weather: d.weather?.[0]?.main,
    description: d.weather?.[0]?.description,
    icon: d.weather?.[0]?.icon,
    weatherId: d.weather?.[0]?.id,
    coordinates: { lat: d.coord.lat, lng: d.coord.lon },
  };
}

const MOCK_BY_CITY = {
  colombo: {
    city: "Colombo",
    country: "LK",
    temperature: 31,
    feelsLike: 35,
    humidity: 78,
    pressure: 1012,
    windSpeed: 19,
    windSpeedMs: 5.2,
    rainfall1h: 8,
    rainfall3h: 20,
    weather: "Rain",
    description: "moderate rain",
    icon: "10d",
    weatherId: 501,
    coordinates: { lat: 6.9271, lng: 79.8612 },
  },
  kandy: {
    city: "Kandy",
    country: "LK",
    temperature: 24,
    feelsLike: 26,
    humidity: 85,
    pressure: 1010,
    windSpeed: 11,
    windSpeedMs: 3.1,
    rainfall1h: 2,
    rainfall3h: 5,
    weather: "Clouds",
    description: "broken clouds",
    icon: "04d",
    weatherId: 803,
    coordinates: { lat: 7.2906, lng: 80.6337 },
  },
};

function getMockWeather(city = "Colombo") {
  return MOCK_BY_CITY[city.toLowerCase()] || MOCK_BY_CITY.colombo;
}

async function fetchWeatherByCity(city = "Colombo") {
  try {
    const resp = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: "metric" },
    });
    return normalizeWeather(resp.data);
  } catch (err) {
    console.error("OpenWeather fetch error:", err.message || err);
    return getMockWeather(city);
  }
}

async function fetchWeatherByCoords(lat, lng) {
  try {
    const resp = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon: lng, appid: API_KEY, units: "metric" },
    });
    return normalizeWeather(resp.data);
  } catch (err) {
    console.error("OpenWeather coords fetch error:", err.message || err);
    return getMockWeather(process.env.DEFAULT_CITY || "Colombo");
  }
}

module.exports = {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  normalizeWeather,
};
