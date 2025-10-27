const CACHE_NAME = 'megaherz-campus-v7'; // increment this every deploy
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
  self.skipWaiting(); // activate immediately
});

// Activate SW and delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve cache first, update in background
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      const fetchPromise = fetch(event.request).then(networkResp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResp.clone());
          return networkResp;
        });
      }).catch(() => cachedResp);
      return cachedResp || fetchPromise;
    })
  );
});

// Listen for message from page to check updates
self.addEventListener('message', event => {
  if(event.data && event.data.type === 'CHECK_FOR_UPDATE') {
    self.skipWaiting(); // force SW to activate if new
  }
});
