self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("ruleta-cache").then(cache =>
            cache.addAll(["./", "./index.html", "./app.js", "./manifest.json", "./icon-256.png"])
        )
    );
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then(clientsArr => {
            if (clientsArr.length > 0) return clientsArr[0].focus();
            return clients.openWindow("./");
        })
    );
});
