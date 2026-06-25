import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import {
  getWeatherRisk,
  getMultipleCitiesWeather,
  getWeatherIcon,
} from "../../services/weatherService";
import {
  fetchActiveAlerts,
  checkMyWeather,
} from "../../services/alertService";
import {
  subscribeToPushNotifications,
  isPushSupported,
} from "../../services/pushService";
import { useLanguage } from "../../context/LanguageContext";
import LocationBanner from "../../components/LocationBanner/LocationBanner";
import WeatherCard from "../../components/WeatherCard/WeatherCard";
import RiskBadge from "../../components/RiskBadge/RiskBadge";
import MapComponent from "../../components/Map/MapComponent";
import "./Dashboard.css";

function Dashboard() {
  const { user, isAuthenticated, updateUserLocation, refreshUser } = useAuth();
  const { t } = useLanguage();  const { requestLocation, loading: geoLoading } = useGeolocation();

  const [city, setCity] = useState(
    user?.lastKnownLocation?.city ||
      process.env.REACT_APP_DEFAULT_CITY ||
      "Colombo"
  );
  const [weather, setWeather] = useState(null);
  const [riskLevel, setRiskLevel] = useState("safe");
  const [risks, setRisks] = useState([]);
  const [allCitiesWeather, setAllCitiesWeather] = useState([]);
  const [activeLocation, setActiveLocation] = useState(
    user?.lastKnownLocation || null
  );
  const [storedAlerts, setStoredAlerts] = useState([]);
  const [actionMsg, setActionMsg] = useState("");

  const loadWeather = useCallback(async () => {
    try {
      let data;
      if (activeLocation?.lat && activeLocation?.lng) {
        data = await getWeatherRisk({
          lat: activeLocation.lat,
          lng: activeLocation.lng,
        });
      } else {
        data = await getWeatherRisk({ city });
      }

      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });

      setWeather({ ...data, timestamp });
      setRiskLevel(data.riskLevel || "safe");
      setRisks(data.risks || []);
      if (data.city) setCity(data.city);
    } catch (err) {
      console.error(err);
    }
  }, [activeLocation, city]);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadWeather]);

  useEffect(() => {
    getMultipleCitiesWeather().then(setAllCitiesWeather);
  }, []);

  useEffect(() => {
    if (user?.lastKnownLocation) {
      setActiveLocation(user.lastKnownLocation);
      if (user.lastKnownLocation.city) {
        setCity(user.lastKnownLocation.city);
      }
    }
  }, [user]);

  const loadStoredAlerts = useCallback(async () => {
    if (!isAuthenticated) {
      setStoredAlerts([]);
      return;
    }
    try {
      const alerts = await fetchActiveAlerts();
      setStoredAlerts(alerts);
    } catch (err) {
      console.error(err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadStoredAlerts();
    const interval = setInterval(loadStoredAlerts, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadStoredAlerts]);

  const handleUpdateLocation = async () => {
    try {
      const loc = await requestLocation();
      const updated = {
        ...loc,
        city,
      };
      setActiveLocation(updated);
      if (isAuthenticated) {
        await updateUserLocation(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveLocation(null);
    loadWeather();
  };

  const handleEnablePush = async () => {
    setActionMsg("");
    try {
      await subscribeToPushNotifications();
      await refreshUser();
      setActionMsg("Push notifications enabled.");
    } catch (err) {
      setActionMsg(err.message || "Could not enable push.");
    }
  };

  const handleRunMonitor = async () => {
    setActionMsg("");
    try {
      const result = await checkMyWeather();
      setActionMsg(
        `Risk check: ${result.alertsSent || 0} alert(s) — level: ${result.level || "safe"}`
      );
      loadStoredAlerts();
    } catch (err) {
      setActionMsg(err.response?.data?.error || "Risk check failed.");
    }
  };

  const liveAlertCards = risks.length
    ? risks.map((r, i) => ({
        id: i,
        type: r.type,
        severity: r.severity,
        title: r.title,
        description: r.message,
        area: weather?.city || city,
        time: "Just now",
        icon: r.severity === "danger" ? "🔴" : "🟡",
      }))
    : [
        {
          id: 0,
          type: "status",
          severity: "safe",
          title: t("dashboard.allClear"),
          description: t("dashboard.allClearDesc"),
          area: weather?.city || city,
          time: t("dashboard.live"),
          icon: "✅",
        },
      ];

  const storedCards = storedAlerts.map((a) => ({
    id: a.id,
    type: a.type,
    severity: a.severity,
    title: a.title,
    description: a.message,
    area: a.affectedCities?.[0] || weather?.city || city,
    time: new Date(a.createdAt).toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
    }),
    icon: a.severity === "danger" ? "🔴" : a.severity === "warning" ? "🟡" : "✅",
  }));

  const alertCards = storedCards.length > 0 ? storedCards : liveAlertCards;

  return (
    <div className="dashboard container">
      <header className="dashboard-header">
        <h1>
          {isAuthenticated
            ? `${t("dashboard.greeting")}, ${user.name.split(" ")[0]}`
            : t("dashboard.title")}
        </h1>
        <p>{t("dashboard.subtitle")}</p>
      </header>

      <LocationBanner
        location={activeLocation || { city }}
        onRefresh={handleUpdateLocation}
        loading={geoLoading}
      />

      <form className="dashboard-search glass-card" onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("dashboard.searchPlaceholder")}
          className="dashboard-search__input"
        />
        <button type="submit" className="btn-primary-app">{t("dashboard.check")}</button>
      </form>

      <div className="dashboard-main">
        <WeatherCard weather={weather} />
        <RiskBadge level={riskLevel} />
      </div>

      {risks.length > 0 && (
        <section className="dashboard-risks glass-card">
          <h2>{t("dashboard.activeRisks")}</h2>
          <ul>
            {risks.map((r) => (
              <li key={r.type} className={`risk-item risk-${r.severity}`}>
                <strong>{r.title}</strong>
                <span>{r.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="dashboard-map">
        <MapComponent
          alerts={alertCards}
          selectedCity={city}
          weatherData={allCitiesWeather}
        />
      </section>

      <section className="dashboard-actions glass-card">
        <h2>{t("dashboard.quickActions")}</h2>
        {actionMsg && <p className="dashboard-action-msg">{actionMsg}</p>}
        <div className="dashboard-actions__grid">
          {isAuthenticated ? (
            <>
              <Link to="/alerts" className="btn-outline-app">{t("dashboard.alertHistory")}</Link>
              <Link to="/profile" className="btn-outline-app">{t("dashboard.profile")}</Link>
              {isPushSupported() && !user?.hasPushSubscription && (
                <button type="button" className="btn-primary-app" onClick={handleEnablePush}>
                  {t("dashboard.enablePush")}
                </button>
              )}
              <button type="button" className="btn-outline-app" onClick={handleRunMonitor}>
                {t("dashboard.runCheck")}
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary-app">{t("dashboard.signupAlerts")}</Link>
              <Link to="/login" className="btn-outline-app">{t("nav.login")}</Link>
            </>
          )}
        </div>
      </section>

      <section className="dashboard-alerts">
        <h2>{t("dashboard.alertStatus")}</h2>
        <div className="alerts-grid">
          {alertCards.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card glass-card severity-${alert.severity}`}
            >
              <div className="alert-card__header">
                <span>{alert.icon}</span>
                <span className="alert-type">{alert.type}</span>
              </div>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <footer>
                <span>📍 {alert.area}</span>
                <span>🕐 {alert.time}</span>
              </footer>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-cities">
        <h2>{t("dashboard.weatherSriLanka")}</h2>
        <div className="cities-grid">
          {allCitiesWeather.map((c, i) => (
            <div key={i} className="city-card glass-card">
              <div className="city-name">{c.city}</div>
              <img
                src={getWeatherIcon(c.icon)}
                alt=""
                className="city-icon"
              />
              <div className="city-temp">{c.temperature}°C</div>
              <div className="city-desc">{c.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
