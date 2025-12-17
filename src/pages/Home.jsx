import { useState, useEffect } from 'react';
import { getWeatherByCity, getMultipleCitiesWeather, getWeatherIcon } from '../services/weatherService';
import './Home.css';
import MapComponent from '../components/MapComponent';

function Home() {
  const [location, setLocation] = useState('Colombo');
  const [weatherData, setWeatherData] = useState(null);
  const [allCitiesWeather, setAllCitiesWeather] = useState([]);

  const fetchWeather = async () => {
    
    try {
      const data = await getWeatherByCity(location);
      setWeatherData(data);
      
      const citiesData = await getMultipleCitiesWeather();
      setAllCitiesWeather(citiesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const mockAlerts = [
    {
      id: 1,
      type: weatherData?.alertType || 'flood',
      severity: weatherData?.severity || 'medium',
      title: `${weatherData?.city || 'Colombo'} Weather Alert`,
      description: weatherData 
        ? `Current conditions: ${weatherData.description}, Temp: ${weatherData.temperature}°C`
        : 'Heavy rainfall expected in Western Province',
      area: weatherData?.city || 'Colombo',
      time: weatherData?.timestamp || 'Just now',
      icon: weatherData ? getWeatherIcon(weatherData.icon) : '🌊'
    },
    {
      id: 2,
      type: 'landslide',
      severity: 'medium',
      title: 'Landslide Alert - Hill Country',
      description: 'Moderate risk in Nuwara Eliya, Badulla districts',
      area: 'Central Province',
      time: '5 hours ago',
      icon: '⛰️'
    },
    {
      id: 3,
      type: 'storm',
      severity: 'low',
      title: 'Thunderstorm Warning - Coastal Areas',
      description: 'Possible thunderstorms in Southern coastal areas',
      area: 'Southern Province',
      time: '1 day ago',
      icon: '⛈️'
    }
  ];

  const emergencyContacts = [
    { name: 'Disaster Management Center', number: '1990' },
    { name: 'Police Emergency', number: '119' },
    { name: 'Ambulance', number: '110' },
    { name: 'Fire & Rescue', number: '111' }
  ];

  return (
    <div className="container">
      <div className="top-section row">
      <div className="hero-section col  text-light">
        <h1 className="hero-title"><i className='fa-solid fa-bell'></i> Sri Lanka Disaster Alert System</h1>
        <p className="hero-subtitle">
          Real-time alerts and preparedness information for natural disasters in Sri Lanka
        </p>
      </div>

      <div className='col'>
        <h2 className=' text-light'><i class="fa-solid fa-location-dot"></i> Check Weather</h2>
        <form onSubmit={handleSearch} className="location-input-container form-floating">
          <input
            type="text"
            className="location-input form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or district..."
            required
          />
          <label className="form-label">Type any City</label>
          <button type="submit" className="location-button">
            Check
          </button>
        </form>
        </div>
        </div>
        
        <div className="location-section my-5">
        {weatherData && (
          <div className="current-weather glass">
            <div className="weather-header">
              <h3>
                <img 
                  src={getWeatherIcon(weatherData.icon)} 
                  alt={weatherData.weather}
                  className="weather-icon-large"
                />
                {weatherData.city}, {weatherData.country}
              </h3>
              <div className={`weather-severity risk-${weatherData.severity}`}>
                {weatherData.severity.toUpperCase()} RISK
              </div>
            </div>
            
            <div className="weather-details">
              <div className="weather-main">
                <div className="temperature">{weatherData.temperature}°C</div>
                <div className="weather-condition">{weatherData.description}</div>
                <div className="feels-like">Feels like {weatherData.feelsLike}°C</div>
              </div>
              
              <div className="weather-stats my-5">
                <div className="stat">
                  <span className="stat-label">Humidity:</span>
                  <span className="stat-value">{weatherData.humidity}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Wind:</span>
                  <span className="stat-value">{weatherData.windSpeed} m/s</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Pressure:</span>
                  <span className="stat-value">{weatherData.pressure} hPa</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Updated:</span>
                  <span className="stat-value">{weatherData.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="cities-weather-section text-light">
        <h2 className='text-center'><i className="fa-solid fa-globe"></i> Weather Across Sri Lanka</h2>
        <div className="cities-grid">
          {allCitiesWeather.map((city, index) => (
            <div key={index} className="city-weather-card glass">
              <div className="city-name">{city.city}</div>
              <img 
                src={getWeatherIcon(city.icon)} 
                alt={city.weather}
                className="city-weather-icon"
              />
              <div className="city-temp">{city.temperature}°C</div>
              <div className="city-condition">{city.description}</div>
              <div className={`city-risk risk-${city.severity}`}>
                {city.severity} risk
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="map-section my-5">
        <MapComponent alerts={mockAlerts} selectedCity={location}   weatherData={allCitiesWeather} />
      </div>
      
      <div className="alerts-section my-5">
        <h2 className='text-center text-light'><i class="fa-solid fa-bell"></i> Active Alerts</h2>
          <div className="alerts-grid row">
            {mockAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`m-3 p-3 col alert-card glass text-light severity-${alert.severity}`}
              >
                <div className="alert-header text-center m-3 fs-5">
                  {alert.icon.startsWith('http') ? (
                    <img src={alert.icon} alt="weather" className="alert-weather-icon" />
                  ) : (
                    <span className="alert-icon">{alert.icon}</span>
                  )}
                  <span className="alert-type">{alert.type.toUpperCase()}</span>
                  <span className={`alert-severity ${alert.severity}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <h3 className="alert-title text-center">{alert.title}</h3>
                <p className="alert-description text-center">{alert.description}</p>
                <div className="alert-footer fs-4">
                  <span className="alert-area"><i className="fa-solid fa-location"></i> {alert.area}</span><br />
                  <span className="alert-time"><i class="fa-solid fa-clock"></i> {alert.time}</span>
                </div>
              </div>
            ))}
          </div>
      </div>
      
      <div className="contacts-section my-5">
        <h2 className='text-center text-light'><i class="fa-solid fa-hand"></i> Emergency Contacts</h2>
        <div className="contacts-grid row my-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-card text-center m-3 p-3 col">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-number fw-bold fs-3">{contact.number}</div>
              <button className="contact-button btn btn-danger"><i class="fa-solid fa-phone"></i> Call Now</button>
            </div>
          ))}
        </div>
      </div>
      
      <h2 className='text-center my-4 text-light'><i class="fa-solid fa-bolt"></i> Quick Actions</h2>
      <div className="actions-section d-flex justify-content-center">
        <div className="actions-buttons btn-group">
          <button className="action-button btn btn-outline-light">
          <i class="fa-solid fa-book"></i> View Preparedness Checklist
          </button>
          <button className="action-button btn btn-light">
          <i class="fa-solid fa-map"></i> Find Nearest Shelter
          </button>
          <button className="action-button btn btn-outline-light">
          <i class="fa-solid fa-tower-broadcast"></i> Subscribe to Alerts
          </button>
          <button className="action-button btn btn-light">
          <i class="fa-solid fa-chart-simple"></i> View Historical Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;