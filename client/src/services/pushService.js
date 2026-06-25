import api from "./api";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register(
      `${process.env.PUBLIC_URL || ""}/sw.js`
    );
  } catch (err) {
    console.warn("Service worker registration failed:", err);
    return null;
  }
}

export async function subscribeToPushNotifications() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied.");
  }

  const { data } = await api.get("/notifications/vapid-public-key");
  if (!data.publicKey) {
    throw new Error("Server has not configured Web Push (VAPID keys).");
  }

  const registration =
    (await navigator.serviceWorker.ready) ||
    (await registerServiceWorker());

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(data.publicKey),
  });

  await api.post("/notifications/subscribe", {
    subscription: subscription.toJSON(),
  });

  return subscription;
}

export async function unsubscribeFromPushNotifications() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) await subscription.unsubscribe();
  await api.delete("/notifications/unsubscribe");
}

export function isPushSupported() {
  return "Notification" in window && "serviceWorker" in navigator;
}
