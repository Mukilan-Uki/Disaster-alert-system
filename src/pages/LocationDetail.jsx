import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWeatherByCity, getWeatherIcon } from '../services/weatherService';
import './LocationDetail.css';

function LocationDetail() {
  const { locationName = 'colombo' } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherByCity(locationName);
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [locationName]);

  const locationData = {
    colombo: {
      name: 'Colombo',
      population: '5.6 million',
      commonDisasters: ['Floods', 'Urban flooding', 'Landslides', 'Thunderstorms'],
      shelters: [
        { name: 'Colombo Public Library', capacity: '500 people' },
        { name: 'Town Hall', capacity: '300 people' },
        { name: 'Sugathadasa Stadium', capacity: '1000 people' }
      ],
      emergencyContacts: ['1990', '011-2674444'],
      hospitals: ['National Hospital Colombo', 'Lanka Hospitals', 'Nawaloka Hospital'],
      floodProneAreas: ['Bambalapitiya', 'Wellawatta', 'Kirulapone', 'Kotahena'],
      lastAlert: 'Flood warning - 2 days ago'
    },
    kandy: {
      name: 'Kandy',
      population: '1.5 million',
      commonDisasters: ['Landslides', 'Flash floods', 'Earth tremors'],
      shelters: [
        { name: 'D.S. Senanayake Hall', capacity: '400 people' },
        { name: 'Kandy City Center', capacity: '200 people' }
      ],
      emergencyContacts: ['1990', '081-2222222'],
      hospitals: ['Kandy General Hospital', 'Asiri Hospitals Kandy'],
      floodProneAreas: ['Peradeniya', 'Gampola', 'Gelioya'],
      lastAlert: 'Landslide alert - 5 days ago'
    }
  };

  const data = locationData[locationName] || locationData.colombo;
  
  const calculateRiskLevel = () => {
    if (!weather) return 'Medium';
    
    if (weather.severity === 'high') return 'High';
    if (weather.severity === 'medium') return 'Medium';
    return 'Low';
  };

  const riskLevel = calculateRiskLevel();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading {data.name} weather data...</p>
      </div>
    );
  }

  return (
    <div className="location-detail-container">
      <div className="location-header">
        <div>
          <h1 className=' text-light'>
            <i className='fa-solid fa-location-dot'></i> {data.name} - Disaster Preparedness
            {weather && (
              <span className="weather-badge">
                <img src={getWeatherIcon(weather.icon)} alt={weather.weather} />
                {weather.temperature}°C | {weather.description}
              </span>
            )}
          </h1>
          <p className="location-subtitle text-light">
            Last updated: {weather?.timestamp || 'Just now'}
          </p>
        </div>
        
        <div className={`risk-badge risk-${riskLevel.toLowerCase()}`}>
          <div className="risk-label">Risk Level</div>
          <div className="risk-value">{riskLevel}</div>
          {weather && (
            <div className="risk-factor">
              Based on: {weather.severity} weather conditions
            </div>
          )}
        </div>
      </div>
      
      {weather && (
        <div className="weather-stats-detail">
          <h2><span className="fas fa-sun text-warning"></span>  Current Weather Conditions</h2>
          <div className="weather-metrics">
            <div className="metric">
              <div className="metric-label">Temperature</div>
              <div className="metric-value">{weather.temperature}°C</div>
            </div>
            <div className="metric">
              <div className="metric-label">Feels Like</div>
              <div className="metric-value">{weather.feelsLike}°C</div>
            </div>
            <div className="metric">
              <div className="metric-label">Humidity</div>
              <div className="metric-value">{weather.humidity}%</div>
            </div>
            <div className="metric">
              <div className="metric-label">Wind Speed</div>
              <div className="metric-value">{weather.windSpeed} m/s</div>
            </div>
            <div className="metric">
              <div className="metric-label">Pressure</div>
              <div className="metric-value">{weather.pressure} hPa</div>
            </div>
            <div className="metric">
              <div className="metric-label">Alert Type</div>
              <div className="metric-value alert-type-badge">{weather.alertType}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="location-stats">
        <div className="stat-card">
          <div className="stat-icon fas fa-users text-primary"></div>
          <div className="stat-value">{data.population}</div>
          <div className="stat-label">Population</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon fa-solid fa-exclamation-triangle text-warning"></div>
          <div className="stat-value">{data.commonDisasters.length}</div>
          <div className="stat-label">Common Disaster Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon fas fa-home"></div>
          <div className="stat-value">{data.shelters.length}</div>
          <div className="stat-label">Designated Shelters</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon fas fa-bell text-warning"></div>
          <div className="stat-value">{data.lastAlert}</div>
          <div className="stat-label">Last Alert</div>
        </div>
      </div>
      
      <div className="location-sections">
        <div className="info-section">
          <h2><i className="fa-solid fa-exclamation-triangle text-warning"></i> Common Disasters in {data.name}</h2>
          <ul className="disaster-list">
            {data.commonDisasters.map((disaster, index) => (
              <li key={index} className="disaster-item">
                <span className="disaster-icon">⚡</span>
                {disaster}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="info-section">
          <h2><i className='fas fa-home'></i> Designated Shelters</h2>
          <div className="shelters-grid">
            {data.shelters.map((shelter, index) => (
              <div key={index} className="shelter-card">
                <h3>{shelter.name}</h3>
                <p className="shelter-capacity">Capacity: {shelter.capacity}</p>
                <button className="shelter-button">View on Map</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="info-section">
          <h2><i className='fas fa-book'></i> Preparedness Checklist</h2>
          <div className="checklist">
            {[
              'Emergency kit ready (water, food, medicine)',
              'Important documents in waterproof bag',
              'Family meeting point established',
              'Emergency contacts saved offline',
              'Battery pack fully charged',
              'Know evacuation routes',
              'Monitor weather updates regularly'
            ].map((item, index) => (
              <div key={index} className="checklist-item">
                <input type="checkbox" id={`check-${index}`} />
                <label htmlFor={`check-${index}`}>{item}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="info-section">
          <h2><i className='fa-solid fa-location text-danger'></i> Emergency Procedures</h2>
          <div className="procedures">
            <div className="procedure-card">
              <h3><i className='fas fa-phone text-dark'></i> Immediate Actions</h3>
              <ol>
                <li>Stay calm and alert</li>
                <li>Listen to official announcements</li>
                <li>Check on family members</li>
                <li>Prepare evacuation bag</li>
                <li>Move to higher ground if flooding</li>
              </ol>
            </div>
            <div className="procedure-card">
              <h3><i className='fas fa-life-ring text-danger'></i> During Disaster</h3>
              <ol>
                <li>Do not walk through moving water</li>
                <li>Avoid electrical equipment</li>
                <li>Stay away from damaged areas</li>
                <li>Use flashlight, not candles</li>
                <li>Listen to battery-powered radio</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationDetail;