const User = require("../models/User");
const { fetchWeatherByCoords } = require("./openWeatherService");
const { evaluateRisk } = require("./riskEngine");
const { sendAlertNotification } = require("./notificationService");

async function checkUserWeather(user) {
  const { lat, lng } = user.lastKnownLocation || {};
  if (lat == null || lng == null) return { userId: user._id, skipped: true };

  const weather = await fetchWeatherByCoords(lat, lng);
  const { overallLevel, risks } = evaluateRisk(weather, user.alertPreferences);

  if (overallLevel === "safe" || risks.length === 0) {
    return { userId: user._id, level: "safe", alertsSent: 0 };
  }

  let alertsSent = 0;
  for (const risk of risks) {
    const alert = await sendAlertNotification(user, risk, weather);
    if (alert) alertsSent += 1;
  }

  return {
    userId: user._id,
    level: overallLevel,
    alertsSent,
    city: weather.city,
  };
}

async function runWeatherMonitor() {
  const users = await User.find({
    isActive: true,
    "lastKnownLocation.lat": { $exists: true },
    "lastKnownLocation.lng": { $exists: true },
  });

  console.log(`[WeatherMonitor] Checking ${users.length} user(s)...`);

  const results = [];
  for (const user of users) {
    try {
      const result = await checkUserWeather(user);
      results.push(result);
    } catch (err) {
      console.error(`[WeatherMonitor] User ${user._id} failed:`, err.message);
    }
  }

  const sent = results.reduce((sum, r) => sum + (r.alertsSent || 0), 0);
  console.log(`[WeatherMonitor] Done. Alerts sent: ${sent}`);
  return results;
}

module.exports = { runWeatherMonitor, checkUserWeather };
