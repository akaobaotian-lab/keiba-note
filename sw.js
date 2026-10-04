// アプリの画面だけ端末に置いておく（電波が弱くても開けるように）。予想と記録は GitHub の API から毎回取るのでここでは扱わない
// 画面は「まず取りに行き、取れなければ置いてある物」。新しい版を載せたらすぐ反映される
const CACHE = "keiba-note-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
