const webpush = require("web-push");
const Alert = require("../models/Alert");
const Notification = require("../models/Notification");
const { sendEmailAlert } = require("./emailService");

const DEDUP_MS = 2 * 60 * 60 * 1000;

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@alertlanka.lk";

  if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    return true;
  }
  return false;
}

async function wasRecentlySent(userId, alertType) {
  const since = new Date(Date.now() - DEDUP_MS);
  const recent = await Notification.findOne({
    userId,
    alertType,
    sentAt: { $gte: since },
    status: { $in: ["sent", "delivered"] },
  });
  return !!recent;
}

async function deliverToUser(user, alert, payload, alertType) {
  const channels = [];
  let channel = "in_app";

  if (user.notificationChannels?.webPush !== false) {
    const sent = await sendWebPush(user, payload);
    if (sent) {
      channels.push("web_push");
      channel = "web_push";
    }
  }

  if (user.notificationChannels?.email !== false) {
    const emailed = await sendEmailAlert(user, {
      title: payload.title,
      body: payload.body,
    });
    if (emailed) channels.push("email");
  }

  await Notification.create({
    userId: user._id,
    alertId: alert._id,
    alertType: alertType || alert.type,
    channel: channels.includes("web_push") ? "web_push" : channel,
    status: "sent",
    title: payload.title,
    body: payload.body,
    sentAt: new Date(),
  });

  return channels;
}

async function sendAlertNotification(user, risk, weatherSnapshot) {
  const recentlySent = await wasRecentlySent(user._id, risk.type);
  if (recentlySent) return null;

  const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
  const alert = await Alert.create({
    type: risk.type,
    title: risk.title,
    message: risk.message,
    severity: risk.severity,
    affectedUsers: [user._id],
    affectedCities: user.lastKnownLocation?.city
      ? [user.lastKnownLocation.city]
      : [],
    weatherSnapshot,
    status: "active",
    expiresAt,
  });

  await deliverToUser(
    user,
    alert,
    {
      title: risk.title,
      body: risk.message,
      alertId: alert._id.toString(),
      severity: risk.severity,
    },
    risk.type
  );

  return alert;
}

async function broadcastOfficialAlert(users, alertData) {
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const userIds = users.map((u) => u._id);
  const cities = alertData.affectedCities || [];

  const alert = await Alert.create({
    type: alertData.type || "official",
    title: alertData.title,
    message: alertData.message,
    severity: alertData.severity || "warning",
    affectedUsers: userIds,
    affectedCities: cities,
    status: "active",
    expiresAt,
    weatherSnapshot: { source: "admin", issuedAt: new Date() },
  });

  let delivered = 0;
  for (const user of users) {
    const channels = await deliverToUser(
      user,
      alert,
      {
        title: alertData.title,
        body: alertData.message,
        alertId: alert._id.toString(),
        severity: alertData.severity,
      },
      alertData.type || "official"
    );
    if (channels.length > 0) delivered += 1;
  }

  return { alert, usersNotified: delivered };
}

async function sendWebPush(user, payload) {
  if (!user.pushSubscription?.endpoint) return false;

  const configured = configureWebPush();
  if (!configured) {
    console.warn("Web Push skipped: VAPID keys not configured");
    return false;
  }

  try {
    await webpush.sendNotification(
      user.pushSubscription,
      JSON.stringify(payload)
    );
    return true;
  } catch (err) {
    console.error("Web Push failed:", err.message || err);
    if (err.statusCode === 410 || err.statusCode === 404) {
      user.pushSubscription = undefined;
      await user.save();
    }
    return false;
  }
}

function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || null;
}

module.exports = {
  sendAlertNotification,
  broadcastOfficialAlert,
  sendWebPush,
  getVapidPublicKey,
  configureWebPush,
};
