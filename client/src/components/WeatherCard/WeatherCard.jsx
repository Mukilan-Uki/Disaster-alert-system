import { getWeatherIcon } from "../../services/weatherService";
import "./WeatherCard.css";

function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="weather-card glass-card">
      <div className="weather-card__header">
        <img
          src={getWeatherIcon(weather.icon)}
          alt={weather.description}
          className="weather-card__icon"
        />
        <div>
          <h3 className="weather-card__city">
            {weather.city}
            {weather.country ? `, ${weather.country}` : ""}
          </h3>
          <p className="weather-card__desc">{weather.description}</p>
        </div>
      </div>
      <div className="weather-card__temp">{weather.temperature}°C</div>
      <div className="weather-card__stats">
        <div>
          <span className="stat-label">Feels like</span>
          <span className="stat-value">{weather.feelsLike ?? "—"}°C</span>
        </div>
        <div>
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{weather.humidity ?? "—"}%</span>
        </div>
        <div>
          <span className="stat-label">Wind</span>
          <span className="stat-value">
            {weather.windSpeed ?? "—"} km/h
          </span>
        </div>
        <div>
          <span className="stat-label">Updated</span>
          <span className="stat-value">{weather.timestamp || "Now"}</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
