const CACHE_NAME = 'megaherz-pwa-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html?v=1',
  '/manifest.json?v=1',
  '/images/background.jpg?v=1',
  '/images/treasure-map.png?v=1',
  '/images/character.png?v=1',
  '/docs/sample1.pdf?v=1',
  '/docs/sample2.pdf?v=1'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching offline assets');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
