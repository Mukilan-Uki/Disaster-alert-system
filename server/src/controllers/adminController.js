const User = require("../models/User");
const Alert = require("../models/Alert");
const Notification = require("../models/Notification");
const { runWeatherMonitor } = require("../services/weatherMonitorService");
const { broadcastOfficialAlert } = require("../services/notificationService");
const { isEmailConfigured } = require("../services/emailService");

exports.triggerMonitor = async (req, res, next) => {
  try {
    const results = await runWeatherMonitor();
    const alertsSent = results.reduce((sum, r) => sum + (r.alertsSent || 0), 0);
    res.json({
      message: "Weather monitor completed",
      usersChecked: results.length,
      alertsSent,
      results,
    });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [users, alerts, notifications, activeAlerts] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Alert.countDocuments(),
      Notification.countDocuments(),
      Alert.countDocuments({ status: "active" }),
    ]);

    res.json({
      users,
      alerts,
      notifications,
      activeAlerts,
      emailConfigured: isEmailConfigured(),
      cronEnabled: process.env.ENABLE_WEATHER_CRON !== "false",
    });
  } catch (err) {
    next(err);
  }
};

exports.createOfficialAlert = async (req, res, next) => {
  try {
    const { title, message, type, severity, affectedCities, targetAll } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    let users;
    if (targetAll) {
      users = await User.find({ isActive: true });
    } else if (affectedCities?.length) {
      const normalized = affectedCities.map((c) => c.toLowerCase());
      const allUsers = await User.find({
        isActive: true,
        "lastKnownLocation.city": { $exists: true },
      });
      users = allUsers.filter((u) =>
        normalized.includes(u.lastKnownLocation.city?.toLowerCase())
      );
    } else {
      return res.status(400).json({
        error: "Provide affectedCities or set targetAll to true",
      });
    }

    if (users.length === 0) {
      return res.status(404).json({ error: "No users found for the target area" });
    }

    const { alert, usersNotified } = await broadcastOfficialAlert(users, {
      title: title.trim(),
      message: message.trim(),
      type: type || "official",
      severity: severity || "warning",
      affectedCities: affectedCities || [],
    });

    res.status(201).json({
      message: "Official alert issued",
      alertId: alert._id,
      usersTargeted: users.length,
      usersNotified,
    });
  } catch (err) {
    next(err);
  }
};
