
import { precacheAndRoute } from 'workbox-precaching';

// Workbox injects the manifest here at build time.
// This line is essential for the service worker to cache all the necessary assets.
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
