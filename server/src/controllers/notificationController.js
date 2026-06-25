const Notification = require("../models/Notification");
const { getVapidPublicKey } = require("../services/notificationService");

exports.getVapidKey = (req, res) => {
  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return res.status(503).json({ error: "Web Push not configured on server" });
  }
  res.json({ publicKey });
};

exports.subscribe = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    if (!subscription?.endpoint) {
      return res.status(400).json({ error: "Valid push subscription required" });
    }

    req.user.pushSubscription = subscription;
    req.user.notificationChannels.webPush = true;
    await req.user.save();

    res.json({ message: "Push subscription saved" });
  } catch (err) {
    next(err);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    req.user.pushSubscription = undefined;
    req.user.notificationChannels.webPush = false;
    await req.user.save();
    res.json({ message: "Push subscription removed" });
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ sentAt: -1 })
      .limit(100)
      .populate("alertId", "type severity status");

    res.json({
      notifications: notifications.map((n) => ({
        id: n._id,
        alertId: n.alertId?._id,
        alertType: n.alertType,
        channel: n.channel,
        status: n.status,
        title: n.title,
        body: n.body,
        sentAt: n.sentAt,
        readAt: n.readAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.readAt = new Date();
    notification.status = "delivered";
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
};
