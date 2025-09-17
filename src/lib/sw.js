
import { precacheAndRoute } from 'workbox-precaching';

// Workbox injects the manifest here at build time.
// This line is essential for the service worker to cache all the necessary assets.
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// The offline fallback page is no longer needed with this precaching strategy,
// as the actual pages will be served from the cache when offline.
const CACHE = "pwabuilder-page";
const offlineFallbackPage = "/offline.html";

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        console.log("Fetch failed; returning offline page instead.", error);
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
