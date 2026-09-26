const CACHE_NAME = "lucky-pwa-a411742e4b6428f1";
const APP_SHELL = "/lucky-bean-pwa/index.html";
const PRECACHE_URLS = [
  "/lucky-bean-pwa/index.html",
  "/lucky-bean-pwa/manifest.webmanifest",
  "/lucky-bean-pwa/brand/background-grid-texture.png",
  "/lucky-bean-pwa/brand/cats-craft-hero.png",
  "/lucky-bean-pwa/brand/lucky-geometric-mark.svg",
  "/lucky-bean-pwa/brand/pacman-pattern.png",
  "/lucky-bean-pwa/brand/together-logo.png",
  "/lucky-bean-pwa/brand/upload-add.png",
  "/lucky-bean-pwa/fonts/AlimamaShuHeiTi.otf",
  "/lucky-bean-pwa/fonts/Barlow-Medium.otf",
  "/lucky-bean-pwa/pwa/apple-touch-icon.png",
  "/lucky-bean-pwa/pwa/icon-192.png",
  "/lucky-bean-pwa/pwa/icon-512.png",
  "/lucky-bean-pwa/samples/yellow-cartoon-example.png",
  "/lucky-bean-pwa/assets/index-BP24mYTn.js",
  "/lucky-bean-pwa/assets/index-CtBX09LO.css"
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('lucky-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api') || url.pathname === '/health') return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => response.ok ? response : Promise.reject(new Error('navigation failed'))).catch(() => caches.match(APP_SHELL)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(async response => {
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })));
});
