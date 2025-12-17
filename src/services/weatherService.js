const API_KEY = 'b43f8cec4db488dc333b7f34253cced9'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cache = {};

const getAlertTypeFromWeather = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return 'storm';
  if (weatherId >= 300 && weatherId < 400) return 'rain';
  if (weatherId >= 500 && weatherId < 600) return 'flood';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 700 && weatherId < 800) return 'fog';
  if (weatherId === 800) return 'clear';
  if (weatherId > 800) return 'clouds';
  
  return 'weather';
};

const getSeverity = (weatherData) => {
  const { main, wind } = weatherData;
  
  if (main.humidity > 90 && weatherData.weather[0].main === 'Rain') {
    return 'high';
  }
  
  if (wind.speed > 8) {
    return 'medium';
  }
  
  return 'low';
};

export const getWeatherByCity = async (cityName = 'Colombo') => {
  try {
    const cacheKey = cityName.toLowerCase();
    const now = Date.now();
    
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp < 10 * 60 * 1000)) {
      return cache[cacheKey].data;
    }
    
    const response = await fetch(
      `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const formattedData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      alertType: getAlertTypeFromWeather(data.weather[0].id),
      severity: getSeverity(data),
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      timestamp: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Colombo',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    cache[cacheKey] = {
      data: formattedData,
      timestamp: now
    };
    
    return formattedData;
    
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    return getMockWeatherData(cityName);
  }
};

export const getMockWeatherData = (cityName = 'Colombo') => {
  const mockData = {
    colombo: {
      city: 'Colombo',
      country: 'LK',
      temperature: 31,
      feelsLike: 35,
      humidity: 78,
      pressure: 1012,
      windSpeed: 5.2,
      weather: 'Rain',
      description: 'moderate rain',
      icon: '10d',
      alertType: 'flood',
      severity: 'medium',
      coordinates: { lat: 6.9271, lon: 79.8612 },
      timestamp: '02:30 PM'
    },
    kandy: {
      city: 'Kandy',
      country: 'LK',
      temperature: 24,
      feelsLike: 26,
      humidity: 85,
      pressure: 1010,
      windSpeed: 3.1,
      weather: 'Clouds',
      description: 'broken clouds',
      icon: '04d',
      alertType: 'weather',
      severity: 'low',
      coordinates: { lat: 7.2906, lon: 80.6337 },
      timestamp: '02:32 PM'
    },
    galle: {
      city: 'Galle',
      country: 'LK',
      temperature: 29,
      feelsLike: 33,
      humidity: 82,
      pressure: 1013,
      windSpeed: 6.8,
      weather: 'Thunderstorm',
      description: 'thunderstorm with light rain',
      icon: '11d',
      alertType: 'storm',
      severity: 'high',
      coordinates: { lat: 6.0535, lon: 80.2210 },
      timestamp: '02:35 PM'
    }
  };
  
  return mockData[cityName.toLowerCase()] || mockData.colombo;
};

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getMultipleCitiesWeather = async (cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna','Batticaloa','Ampara','Trincomalee','Badulla']) => {
  try {
    const promises = cities.map(city => getWeatherByCity(city));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error fetching multiple cities:', error);
    return cities.map(city => getMockWeatherData(city));
  }
};