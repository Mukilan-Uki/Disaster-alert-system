import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import {
  fetchAlertHistory,
  markAlertRead,
} from "../../services/alertService";
import "./AlertsHistory.css";

function AlertsHistory() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertHistory()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const updated = await markAlertRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = alerts.filter((a) => {
    if (filter === "unread") return !a.isRead;
    if (filter === "danger") return a.severity === "danger";
    if (filter === "warning") return a.severity === "warning";
    return true;
  });

  return (
    <div className="alerts-history container">
      <header className="alerts-history__header">
        <h1>{t("alerts.title")}</h1>
        <p>{t("alerts.subtitle")}</p>
        <Link to="/dashboard" className="btn-outline-app">{t("alerts.back")}</Link>
      </header>

      <div className="alerts-history__filters">
        {["all", "unread", "danger", "warning"].map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? t("alerts.all") : f === "unread" ? t("alerts.unread") : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="alerts-history__empty">{t("alerts.loading")}</p>}

      {!loading && filtered.length === 0 && (
        <div className="alerts-history__empty glass-card">
          <p>{t("alerts.empty")}</p>
        </div>
      )}

      <div className="alerts-history__list">
        {filtered.map((alert) => (
          <article
            key={alert.id}
            className={`history-card glass-card severity-${alert.severity} ${
              alert.isRead ? "read" : "unread"
            }`}
          >
            <div className="history-card__top">
              <span className={`severity-pill risk-${alert.severity}`}>
                {alert.severity}
              </span>
              <span className="history-card__type">{alert.type}</span>
              {!alert.isRead && <span className="unread-dot" />}
            </div>
            <h3>{alert.title}</h3>
            <p>{alert.message}</p>
            <footer>
              <span>
                {new Date(alert.createdAt).toLocaleString("en-LK", {
                  timeZone: "Asia/Colombo",
                })}
              </span>
              {alert.affectedCities?.[0] && (
                <span>📍 {alert.affectedCities[0]}</span>
              )}
            </footer>
            {!alert.isRead && (
              <button
                type="button"
                className="btn-outline-app btn-sm"
                onClick={() => handleMarkRead(alert.id)}
              >
                {t("alerts.markRead")}
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default AlertsHistory;
