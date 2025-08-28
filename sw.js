const CACHE = "puri-honumara-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
  // ikonların varsa: "./icons/p-192.png", "./icons/p-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // only GET
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then(res => {
      return (
        res ||
        fetch(req)
          .then((net) => {
            // runtime cache
            const copy = net.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return net;
          })
          .catch(() => caches.match("./"))
      );
    })
  );
});
