// sw.js
const CACHE = "puri-honumara-v11";
const ASSETS = ["./","./index.html","./manifest.json"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith((async()=>{
    try{
      const net = await fetch(e.request);
      const cache = await caches.open(CACHE);
      cache.put(e.request, net.clone());
      return net;
    }catch(_){
      const hit = await caches.match(e.request);
      return hit || new Response("Offline", {status:503});
    }
  })());
});
