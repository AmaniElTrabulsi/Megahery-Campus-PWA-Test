const CACHE_NAME='megaherz-pwa-v2';
const FILES_TO_CACHE=[
  '/',
  '/index.html?v=2',
  '/manifest.json?v=2',
  '/images/background.jpg?v=2',
  '/images/treasure-map-small.webp?v=2',
  '/images/treasure-map.webp?v=2',
  '/images/character.png?v=2',
  '/docs/sample1.pdf?v=2',
  '/docs/sample2.pdf?v=2'
];

self.addEventListener('install', event=>{ event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES_TO_CACHE))); self.skipWaiting(); });
self.addEventListener('activate', event=>{ event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>{ if(key!==CACHE_NAME) return caches.delete(key); })))); self.clients.claim(); });
self.addEventListener('fetch', event=>{ if(event.request.url.startsWith(self.location.origin)){
  event.respondWith(caches.match(event.request).then(resp=>resp||fetch(event.request)));
}});
