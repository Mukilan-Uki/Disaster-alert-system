import api from "./api";

export async function fetchActiveAlerts() {
  const { data } = await api.get("/alerts");
  return data.alerts;
}

export async function fetchAlertHistory() {
  const { data } = await api.get("/alerts/history");
  return data.alerts;
}

export async function markAlertRead(alertId) {
  const { data } = await api.put(`/alerts/${alertId}/read`);
  return data.alert;
}

export async function fetchNotifications() {
  const { data } = await api.get("/notifications");
  return data.notifications;
}

export async function markNotificationRead(notificationId) {
  await api.put(`/notifications/${notificationId}/read`);
}

export async function triggerWeatherMonitor() {
  const { data } = await api.post("/admin/monitor/run");
  return data;
}

export async function checkMyWeather() {
  const { data } = await api.post("/alerts/check");
  return data;
}
