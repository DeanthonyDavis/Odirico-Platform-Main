// Retire the previous platform worker without touching unrelated browser data.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.delete("odirico-platform-shell-v1")
      .then(() => self.registration.unregister()),
  );
});
