import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css";

function MapComponent({ selectedCity = null, weatherData = [] }) {
  const SRI_LANKA_CENTER = [7.8731, 80.7718];
  const DEFAULT_ZOOM = 7;

  const sriLankanCities = weatherData.map((cityWeather) => {
    const getDefaultCoords = (cityName) => {
      const cityCoords = {
        colombo: [6.9271, 79.8612],
        kandy: [7.2906, 80.6337],
        galle: [6.0535, 80.221],
        jaffna: [9.6615, 80.0255],
        trincomalee: [8.5874, 81.2152],
        anuradhapura: [8.3114, 80.4037],
        "nuwara eliya": [6.9497, 80.7891],
        hambantota: [6.1247, 81.1185],
        ratnapura: [6.6804, 80.4026],
        badulla: [6.9934, 81.055],
      };
      return cityCoords[cityName.toLowerCase()] || SRI_LANKA_CENTER;
    };

    return {
      name: cityWeather.city,
      coords: cityWeather.coordinates
        ? [cityWeather.coordinates.lat, cityWeather.coordinates.lon]
        : getDefaultCoords(cityWeather.city),
      type: cityWeather.alertType,
      severity: cityWeather.severity,
      temperature: cityWeather.temperature,
      humidity: cityWeather.humidity,
      weatherDescription: cityWeather.description,
      icon: cityWeather.icon,
    };
  });

  const createCustomIcon = (alertType) => {
    let iconColor = "blue";

    switch (alertType) {
      case "flood":
        iconColor = "#1e90ff";
        break;
      case "landslide":
        iconColor = "#8b4513";
        break;
      case "storm":
        iconColor = "#483d8b";
        break;
      case "tsunami":
        iconColor = "#00ced1";
        break;
      case "drought":
        iconColor = "#ff8c00";
        break;
      default:
        iconColor = "#808080";
    }

    return L.divIcon({
      html: `<div style="
        background-color: ${iconColor};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      className: "custom-marker-icon",
    });
  };

  const floodProneAreas = [
    {
      name: "Colombo Flood Zone",
      coordinates: [
        [6.95, 79.84],
        [6.93, 79.86],
        [6.91, 79.88],
        [6.89, 79.85],
        [6.92, 79.82],
        [6.95, 79.84],
      ],
      color: "#1e90ff",
    },
    {
      name: "Kalutara Coastal Area",
      coordinates: [
        [6.58, 79.95],
        [6.56, 79.98],
        [6.54, 80.01],
        [6.52, 80.0],
        [6.55, 79.96],
        [6.58, 79.95],
      ],
      color: "#1e90ff",
    },
  ];

  const highRiskZones = [
    { center: [6.93, 79.86], radius: 5000, type: "flood" }, // Colombo
    { center: [6.95, 80.79], radius: 4000, type: "landslide" }, // Nuwara Eliya
    { center: [6.68, 80.4], radius: 4500, type: "flood" }, // Ratnapura
  ];

  const selectedCityData = selectedCity
    ? sriLankanCities.find(
        (city) => city.name.toLowerCase() === selectedCity.toLowerCase()
      )
    : null;

  return (
    <div className="map-wrapper">
      <div className="map-header">
        <h2><i className="fas fa-map"></i> Sri Lanka Disaster Risk Map</h2>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color flood"></div>
            <span>Flood Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-color landslide"></div>
            <span>Landslide Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-color storm"></div>
            <span>Storm Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low-risk"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={selectedCityData ? selectedCityData.coords : SRI_LANKA_CENTER}
          zoom={selectedCityData ? 10 : DEFAULT_ZOOM}
          style={{ height: "500px", width: "100%", borderRadius: "10px" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          {sriLankanCities.map((city, index) => (
            <Marker
              key={index}
              position={city.coords}
              icon={createCustomIcon(city.type)}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{city.name}</h3>

                  {city.temperature && (
                    <div className="weather-info-popup">
                      <p>
                        <strong><i className="fas fa-thermometer-half text-danger"></i> Temperature:</strong> {city.temperature}°C
                      </p>
                      <p>
                        <strong>💧 Humidity:</strong> {city.humidity}%
                      </p>
                      {city.weatherDescription && (
                        <p>
                          <strong><i className="fas fa-sun text-warning"></i> Conditions:</strong>
                          {city.weatherDescription}
                        </p>
                      )}
                    </div>
                  )}

                  <p>
                    <strong>Risk Type:</strong> {city.type}
                  </p>
                  <p>
                    <strong>Severity:</strong>
                    <span className={`popup-severity ${city.severity}`}>
                      {city.severity.toUpperCase()}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="map-controls">
        <div className="map-stats">
          <div className="stat">
            <span className="stat-number">{sriLankanCities.length}</span>
            <span className="stat-label">Cities Monitored</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {sriLankanCities.filter((c) => c.severity === "high").length}
            </span>
            <span className="stat-label">High Risk Areas</span>
          </div>
          <div className="stat">
            <span className="stat-number">3</span>
            <span className="stat-label">Active Warnings</span>
          </div>
        </div>

        <div className="map-actions">
          <button
            className="control-button"
            onClick={() => (window.location.href = "/location/colombo")}
          >
            <i className="fas fa-location-dot text-danger"></i> View Colombo Details
          </button>
          <button className="control-button"><i className="fas fa-download"></i> Download Risk Map</button>
          <button className="control-button"><i className="fas fa-print"></i> Print Map</button>
        </div>
      </div>

      <div className="map-footer">
        <p>
          <strong><i className="fas fa-exclamation-triangle text-warning"></i> Map Legend:</strong> Markers show disaster risk levels.
          Click any marker for details. Blue areas indicate flood-prone regions.
        </p>
        <p>
          <strong><i className="fas fa-thumbtack text-danger"></i> Note:</strong> This map shows simulated risk data for
          demonstration purposes. For official alerts, contact Disaster
          Management Center (1990).
        </p>
      </div>
    </div>
  );
}

export default MapComponent;
