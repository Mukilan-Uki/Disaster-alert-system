const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const BACKEND_API = API_BASE_URL ? `${API_BASE_URL}/api` : "";

const cache = {};

const getAlertTypeFromWeather = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return "storm";
  if (weatherId >= 300 && weatherId < 400) return "rain";
  if (weatherId >= 500 && weatherId < 600) return "flood";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "fog";
  if (weatherId === 800) return "clear";
  if (weatherId > 800) return "clouds";

  return "weather";
};

const getSeverity = (weatherData) => {
  const { main, wind } = weatherData;

  if (main.humidity > 90 && weatherData.weather[0].main === "Rain") {
    return "high";
  }

  if (wind.speed > 8) {
    return "medium";
  }

  return "low";
};

export const getWeatherRisk = async ({ city, lat, lng } = {}) => {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const relativePath =
      lat != null && lng != null
        ? `/weather/risk?lat=${lat}&lng=${lng}`
        : `/weather/risk?city=${encodeURIComponent(city || "Colombo")}`;

    const url = BACKEND_API
      ? `${BACKEND_API}${relativePath}`
      : `/api${relativePath}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error("Risk API error");

    const data = await response.json();
    return {
      city: data.city,
      country: data.country,
      temperature: data.temperature,
      feelsLike: data.feelsLike,
      humidity: data.humidity,
      pressure: data.pressure,
      windSpeed: data.windSpeed,
      rainfall1h: data.rainfall1h,
      rainfall3h: data.rainfall3h,
      weather: data.weather,
      description: data.description,
      icon: data.icon,
      coordinates: data.coordinates,
      riskLevel: data.riskLevel || "safe",
      risks: data.risks || [],
      riskType: data.riskType,
      population: data.population,
    };
  } catch (error) {
    console.error("Error fetching weather risk:", error);
    const mock = getMockWeatherData(city || "Colombo");
    return {
      ...mock,
      riskLevel:
        mock.severity === "high"
          ? "danger"
          : mock.severity === "medium"
            ? "warning"
            : "safe",
      risks: [],
    };
  }
};

export const getWeatherByCity = async (cityName = "Colombo") => {
  try {
    const cacheKey = cityName.toLowerCase();
    const now = Date.now();

    if (cache[cacheKey] && now - cache[cacheKey].timestamp < 10 * 60 * 1000) {
      return cache[cacheKey].data;
    }
    // Prefer backend proxy if available: try relative `/api/weather` first
    let data;
    try {
      const proxyResp = await fetch(
        BACKEND_API
          ? `${BACKEND_API}/weather?city=${encodeURIComponent(cityName)}`
          : `/api/weather?city=${encodeURIComponent(cityName)}`,
      );
      if (proxyResp.ok) {
        data = await proxyResp.json();
      } else {
        // backend responded but with error, fall back to OpenWeather directly
        throw new Error("Backend proxy error");
      }
    } catch (errProxy) {
      // Fallback to direct OpenWeather API call (requires REACT_APP_WEATHER_API_KEY)
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      data = await response.json();
    }

    // If server proxy returned a simplified object, normalize it here
    const formattedData = {
      city: data.name || data.city,
      country: (data.sys && data.sys.country) || data.country,
      temperature: data.main
        ? Math.round(data.main.temp)
        : Math.round(data.temperature),
      feelsLike: data.main ? Math.round(data.main.feels_like) : data.feelsLike,
      humidity: data.main ? data.main.humidity : data.humidity,
      pressure: data.main ? data.main.pressure : data.pressure,
      windSpeed: data.wind ? data.wind.speed : data.windSpeed,
      weather: data.weather ? data.weather[0].main : data.weather,
      description: data.weather
        ? data.weather[0].description
        : data.description,
      icon: data.weather ? data.weather[0].icon : data.icon,
      alertType: data.weather
        ? getAlertTypeFromWeather(data.weather[0].id)
        : data.alertType,
      severity: getSeverity(data),
      coordinates: data.coord
        ? { lat: data.coord.lat, lon: data.coord.lon }
        : data.coordinates,
      timestamp: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    cache[cacheKey] = {
      data: formattedData,
      timestamp: now,
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching weather:", error);

    return getMockWeatherData(cityName);
  }
};

export const getMockWeatherData = (cityName = "Colombo") => {
  const mockData = {
    colombo: {
      city: "Colombo",
      country: "LK",
      temperature: 31,
      feelsLike: 35,
      humidity: 78,
      pressure: 1012,
      windSpeed: 5.2,
      weather: "Rain",
      description: "moderate rain",
      icon: "10d",
      alertType: "flood",
      severity: "medium",
      coordinates: { lat: 6.9271, lon: 79.8612 },
      timestamp: "02:30 PM",
    },
    kandy: {
      city: "Kandy",
      country: "LK",
      temperature: 24,
      feelsLike: 26,
      humidity: 85,
      pressure: 1010,
      windSpeed: 3.1,
      weather: "Clouds",
      description: "broken clouds",
      icon: "04d",
      alertType: "weather",
      severity: "low",
      coordinates: { lat: 7.2906, lon: 80.6337 },
      timestamp: "02:32 PM",
    },
    galle: {
      city: "Galle",
      country: "LK",
      temperature: 29,
      feelsLike: 33,
      humidity: 82,
      pressure: 1013,
      windSpeed: 6.8,
      weather: "Thunderstorm",
      description: "thunderstorm with light rain",
      icon: "11d",
      alertType: "storm",
      severity: "high",
      coordinates: { lat: 6.0535, lon: 80.221 },
      timestamp: "02:35 PM",
    },
  };

  return mockData[cityName.toLowerCase()] || mockData.colombo;
};

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getMultipleCitiesWeather = async (
  cities = [
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Badulla",
  ],
) => {
  try {
    const promises = cities.map((city) => getWeatherByCity(city));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error fetching multiple cities:", error);
    return cities.map((city) => getMockWeatherData(city));
  }
};
