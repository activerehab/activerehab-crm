const CACHE_NAME = "activerehab-crm-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Let network handle dynamic API routes, cache static assets
  if (event.request.url.includes("/api/") || event.request.url.includes("/events")) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Push notification support
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "ActiveRehab Clinic Notification";
  const options = {
    body: data.body || "New patient enquiry received on WhatsApp",
    icon: "/logo.jpg",
    badge: "/logo.jpg",
    vibrate: [200, 100, 200],
    data: { url: data.url || "/inbox" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || "/inbox")
  );
});
