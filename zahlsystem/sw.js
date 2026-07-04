const CACHE_NAME = 'zahlsystem-cache-v2';
const PRECACHE_URLS = [
    '/zahlsystem/',
    '/zahlsystem/index.html',
    '/zahlsystem/bestellungen.html',
    '/zahlsystem/style.css',
    '/style.css',
    '/picture/favicon.ico',
    '/picture/Buchenberg_Wappen.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.match(request).then(cachedResponse => {
            const networkFetch = fetch(request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
                }
                return networkResponse;
            }).catch(() => cachedResponse);
            return cachedResponse || networkFetch;
        })
    );
});
