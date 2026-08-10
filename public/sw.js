const CACHE_NAME = "ep-os-v1";
const STATIC_ASSETS = [
    "/",
    "/habits",
    "/goals",
    "/courses",
    "/schedule",
    "/trades",
    "/journal",
    "/identity",
    "/rules",
    "/review",
    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
];

// Install: cache core pages
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => { })
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first for HTML, cache-first for everything else
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin requests
    if (url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        // Navigation: try network, fall back to cached "/"
        event.respondWith(
            fetch(request).catch(() => caches.match("/").then((r) => r || new Response("Offline", { status: 503 })))
        );
    } else {
        // Assets: cache-first
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
                    }
                    return response;
                }).catch(() => cached || new Response("", { status: 503 }));
            })
        );
    }
});
