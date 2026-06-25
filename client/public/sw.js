/* eslint-disable no-restricted-globals */
self.addEventListener("push", (event) => {
  let data = { title: "Disaster Alert", body: "New alert for your area." };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    /* use defaults */
  }

  const options = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: data.severity === "danger" ? [200, 100, 200] : [100],
    data: { url: "/#/dashboard", alertId: data.alertId },
    tag: data.alertId || "disaster-alert",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = `${self.location.origin}${self.location.pathname}#/dashboard`;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      if (list.length > 0 && list[0].focus) {
        return list[0].focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
      return undefined;
    })
  );
});
