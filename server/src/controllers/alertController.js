const Alert = require("../models/Alert");
const { checkUserWeather } = require("../services/weatherMonitorService");

function formatAlert(alert, userId) {
  const readEntry = alert.readBy?.find(
    (r) => r.userId?.toString() === userId?.toString()
  );
  return {
    id: alert._id,
    type: alert.type,
    title: alert.title,
    message: alert.message,
    severity: alert.severity,
    affectedCities: alert.affectedCities,
    weatherSnapshot: alert.weatherSnapshot,
    status: alert.status,
    isRead: !!readEntry,
    readAt: readEntry?.readAt,
    createdAt: alert.createdAt,
    expiresAt: alert.expiresAt,
  };
}

exports.getActiveAlerts = async (req, res, next) => {
  try {
    const now = new Date();
    const alerts = await Alert.find({
      affectedUsers: req.user._id,
      status: "active",
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      alerts: alerts.map((a) => formatAlert(a, req.user._id)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getAlertHistory = async (req, res, next) => {
  try {
    const alerts = await Alert.find({
      affectedUsers: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      alerts: alerts.map((a) => formatAlert(a, req.user._id)),
    });
  } catch (err) {
    next(err);
  }
};

exports.markAlertRead = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      affectedUsers: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const alreadyRead = alert.readBy.some(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      alert.readBy.push({ userId: req.user._id, readAt: new Date() });
      await alert.save();
    }

    res.json({ message: "Alert marked as read", alert: formatAlert(alert, req.user._id) });
  } catch (err) {
    next(err);
  }
};

exports.checkMyWeather = async (req, res, next) => {
  try {
    if (!req.user.lastKnownLocation?.lat) {
      return res.status(400).json({
        error: "Update your location first to run a personalized risk check",
      });
    }
    const result = await checkUserWeather(req.user);
    res.json({
      message: "Risk check completed",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
