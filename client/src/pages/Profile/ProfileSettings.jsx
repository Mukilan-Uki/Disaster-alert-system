import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isPushSupported,
} from "../../services/pushService";
import api from "../../services/api";
import "./ProfileSettings.css";

const PREF_LABELS = {
  flood: "Flood",
  cyclone: "Cyclone / High Wind",
  heavyRain: "Heavy Rain",
  heat: "Extreme Heat",
  landslide: "Landslide",
};

function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [preferences, setPreferences] = useState(
    user?.alertPreferences || {}
  );
  const [channels, setChannels] = useState(
    user?.notificationChannels || {}
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await api.put("/users/profile", {
        name,
        phone,
        alertPreferences: preferences,
        notificationChannels: channels,
      });
      await refreshUser();
      setMessage(t("profile.saved"));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleEnablePush = async () => {
    setPushLoading(true);
    setError("");
    try {
      await subscribeToPushNotifications();
      await refreshUser();
      setMessage("Push notifications enabled.");
    } catch (err) {
      setError(err.message || "Could not enable push notifications.");
    } finally {
      setPushLoading(false);
    }
  };

  const handleDisablePush = async () => {
    setPushLoading(true);
    try {
      await unsubscribeFromPushNotifications();
      await refreshUser();
      setMessage("Push notifications disabled.");
    } catch (err) {
      setError(err.message || "Could not disable push.");
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <div className="profile-page container">
      <header className="profile-page__header">
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
        <Link to="/dashboard" className="btn-outline-app">{t("profile.back")}</Link>
      </header>

      {message && <div className="profile-message success">{message}</div>}
      {error && <div className="profile-message error">{error}</div>}

      <form className="profile-form glass-card" onSubmit={handleSave}>
        <section>
          <h2>Account</h2>
          <div className="form-group">
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={user?.email || ""} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="profile-phone">Phone (optional)</label>
            <input
              id="profile-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94771234567"
            />
          </div>
        </section>

        <section>
          <h2>Alert Preferences</h2>
          <div className="preference-grid">
            {Object.entries(PREF_LABELS).map(([key, label]) => (
              <label key={key} className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences[key] !== false}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, [key]: e.target.checked }))
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2>Notification Channels</h2>
          <label className="preference-item">
            <input
              type="checkbox"
              checked={channels.email !== false}
              onChange={(e) =>
                setChannels((c) => ({ ...c, email: e.target.checked }))
              }
            />
            Email alerts (coming soon)
          </label>
        </section>

        <section>
          <h2>{t("profile.language")}</h2>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="lang-select"
          >
            <option value="en">English</option>
            <option value="si">සිංහල (Sinhala)</option>
          </select>
        </section>

        <button
          type="submit"
          className="btn-primary-app"
          disabled={saving}
          style={{ width: "100%" }}
        >
          {saving ? t("profile.saving") : t("profile.save")}
        </button>
      </form>

      {isPushSupported() && (
        <section className="profile-push glass-card">
          <h2>Web Push Notifications</h2>
          <p>
            Status:{" "}
            <strong>
              {user?.hasPushSubscription ? "Enabled ✓" : "Not enabled"}
            </strong>
          </p>
          {user?.hasPushSubscription ? (
            <button
              type="button"
              className="btn-outline-app"
              onClick={handleDisablePush}
              disabled={pushLoading}
            >
              Disable Push
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary-app"
              onClick={handleEnablePush}
              disabled={pushLoading}
            >
              {pushLoading ? "Enabling…" : "Enable Push Notifications"}
            </button>
          )}
        </section>
      )}
    </div>
  );
}

export default ProfileSettings;
