const CACHE_NAME = 'megaherz-campus-v6'; // increment each deploy
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/script.js',
  '/images/background.jpg',
  '/images/map-bg.png',
  '/images/character.png'
];

// Install SW and cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // immediately activate new SW
});

// Activate SW and delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// Fetch: serve cache first, then update in background
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      const fetchPromise = fetch(event.request).then(networkResp => {
        // Update cache in background
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResp.clone());
          return networkResp;
        });
      }).catch(() => cachedResp); // fallback if offline

      // Return cached response immediately if exists, else wait for network
      return cachedResp || fetchPromise;
    })
  );
});
