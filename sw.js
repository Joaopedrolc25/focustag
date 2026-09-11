/* FocusTag service worker — funciona offline sem travar em versão antiga */
var CACHE = 'focustag-v2';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/mark.svg',
  './assets/icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Rede primeiro: sempre busca a versão mais nova. Só usa o cache se estiver
   offline. Isso evita ficar preso numa versão antiga da página. */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(function (res) {
      try {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      } catch (x) {}
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match('./index.html');
      });
    })
  );
});
