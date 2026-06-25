import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import { triggerWeatherMonitor } from "../../services/alertService";
import "./AdminPanel.css";

function AdminPanel() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("official");
  const [severity, setSeverity] = useState("warning");
  const [cities, setCities] = useState("");
  const [targetAll, setTargetAll] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data)).catch(console.error);
  }, []);

  const handleIssueAlert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFeedback("");
    try {
      const affectedCities = cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const res = await api.post("/admin/alerts", {
        title,
        message,
        type,
        severity,
        affectedCities,
        targetAll,
      });
      setFeedback(
        `${t("admin.success")}: ${res.data.usersNotified}/${res.data.usersTargeted} users notified`
      );
      setTitle("");
      setMessage("");
      api.get("/admin/stats").then((r) => setStats(r.data));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to issue alert");
    } finally {
      setLoading(false);
    }
  };

  const handleRunMonitor = async () => {
    setFeedback("");
    try {
      const res = await triggerWeatherMonitor();
      setFeedback(
        `Monitor: ${res.alertsSent} alert(s) sent to ${res.usersChecked} user(s)`
      );
    } catch (err) {
      setError(err.response?.data?.error || "Monitor failed");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="admin-page container">
        <div className="glass-card admin-denied">
          <h1>403</h1>
          <p>Admin access required. Set your email in server ADMIN_EMAILS env.</p>
          <Link to="/dashboard" className="btn-outline-app">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page container">
      <header className="admin-page__header">
        <h1>{t("admin.title")}</h1>
        <p>{t("admin.subtitle")}</p>
        <Link to="/dashboard" className="btn-outline-app">← Dashboard</Link>
      </header>

      {error && <div className="admin-msg error">{error}</div>}
      {feedback && <div className="admin-msg success">{feedback}</div>}

      {stats && (
        <section className="admin-stats glass-card">
          <h2>{t("admin.stats")}</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-num">{stats.users}</span>
              <span className="stat-label">{t("admin.users")}</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{stats.alerts}</span>
              <span className="stat-label">{t("admin.alerts")}</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{stats.activeAlerts}</span>
              <span className="stat-label">{t("admin.activeAlerts")}</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{stats.notifications}</span>
              <span className="stat-label">{t("admin.notifications")}</span>
            </div>
          </div>
          <p className="admin-meta">
            {t("admin.emailStatus")}:{" "}
            {stats.emailConfigured ? t("admin.configured") : t("admin.notConfigured")}
            {" · "}
            {t("admin.cronStatus")}:{" "}
            {stats.cronEnabled ? t("admin.enabled") : t("admin.disabled")}
          </p>
        </section>
      )}

      <form className="admin-form glass-card" onSubmit={handleIssueAlert}>
        <h2>{t("admin.issueAlert")}</h2>
        <div className="form-group">
          <label>{t("admin.alertTitle")}</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>{t("admin.alertMessage")}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t("admin.alertType")}</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="official">Official</option>
              <option value="flood">Flood</option>
              <option value="cyclone">Cyclone</option>
              <option value="heavyRain">Heavy Rain</option>
              <option value="heat">Heat</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t("admin.severity")}</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>{t("admin.cities")}</label>
          <input
            value={cities}
            onChange={(e) => setCities(e.target.value)}
            placeholder={t("admin.citiesPlaceholder")}
            disabled={targetAll}
          />
        </div>
        <label className="preference-item">
          <input
            type="checkbox"
            checked={targetAll}
            onChange={(e) => setTargetAll(e.target.checked)}
          />
          {t("admin.targetAll")}
        </label>
        <button type="submit" className="btn-primary-app" disabled={loading} style={{ width: "100%", marginTop: 16 }}>
          {loading ? t("admin.issuing") : t("admin.issue")}
        </button>
      </form>

      <section className="admin-actions glass-card">
        <button type="button" className="btn-outline-app" onClick={handleRunMonitor}>
          {t("admin.runMonitor")}
        </button>
      </section>
    </div>
  );
}

export default AdminPanel;
