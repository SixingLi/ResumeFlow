/* ResumeFlow V1.2 Service Worker */

const CACHE = "resumeflow-v1.2";

const ASSETS = [

  "./",

  "./index.html",

  "./style.css",

  "./app.js",

  "./manifest.json"

];

/* =========================================================

   Install

========================================================= */

self.addEventListener("install", event => {

  event.waitUntil(

    caches

      .open(CACHE)

      .then(cache => cache.addAll(ASSETS))

      .then(() => self.skipWaiting())

  );

});

/* =========================================================

   Activate

   删除旧版本缓存

========================================================= */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches

      .keys()

      .then(keys =>

        Promise.all(

          keys

            .filter(key => key !== CACHE)

            .map(key => caches.delete(key))

        )

      )

      .then(() => self.clients.claim())

  );

});

/* =========================================================

   Fetch

   Network First

========================================================= */

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {

    return;

  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        // 网络请求成功

        // 更新缓存

        const copy = response.clone();

        caches

          .open(CACHE)

          .then(cache => {

            cache.put(

              event.request,

              copy

            );

          });

        return response;

      })

      .catch(() => {

        // 网络失败时使用缓存

        return caches.match(

          event.request

        );

      })

  );

});