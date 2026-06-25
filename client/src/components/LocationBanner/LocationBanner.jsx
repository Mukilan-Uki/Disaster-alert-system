import { useLanguage } from "../../context/LanguageContext";
import "./LocationBanner.css";

function LocationBanner({ location, onRefresh, loading }) {
  const { t } = useLanguage();

  const label = location?.city
    ? `${location.city}${location.district ? `, ${location.district}` : ""}`
    : location?.lat
      ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
      : t("dashboard.locationNotSet");

  return (
    <div className="location-banner glass-card">
      <div className="location-banner__info">
        <span className="location-banner__pin">📍</span>
        <div>
          <span className="location-banner__label">{t("dashboard.yourLocation")}</span>
          <span className="location-banner__value">{label}</span>
        </div>
      </div>
      {onRefresh && (
        <button
          type="button"
          className="btn-outline-app location-banner__btn"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? t("dashboard.detecting") : t("dashboard.update")}
        </button>
      )}
    </div>
  );
}

export default LocationBanner;
