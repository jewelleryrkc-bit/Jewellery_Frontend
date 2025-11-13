/* eslint-disable @typescript-eslint/no-unused-vars */
// public/service-worker.js

// eslint-disable-next-line @typescript-eslint/no-unused-vars
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activated");
});

self.addEventListener("fetch", (event) => {
 
    if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open("v1").then((cache) =>
      cache.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        );
      })
    )
  );
});
