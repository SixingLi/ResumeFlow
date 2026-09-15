/* =========================================================
   ResumeFlow V1.3.8 Service Worker
========================================================= */

const CACHE =
  "resumeflow-v1.3.8";


const ASSETS = [

  "./",

  "./index.html",

  "./style.css?v=1.3.8",

  "./app.js?v=1.3.8",

  "./manifest.json"

];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE)
        .then(
          cache =>
            cache.addAll(
              ASSETS
            )
        )
        .then(
          () =>
            self.skipWaiting()
        )

    );

  }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>

            Promise.all(

              keys
                .filter(
                  key =>
                    key !== CACHE
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            )

        )
        .then(
          () =>
            self.clients.claim()
        )

    );

  }
);


/* =========================================================
   FETCH
   Network First
========================================================= */

self.addEventListener(
  "fetch",
  event => {

    if(
      event.request.method
      !== "GET"
    ){

      return;

    }


    /*
      GitHub Pages / 外部资源：
      网络优先。
    */

    event.respondWith(

      fetch(
        event.request
      )
      .then(
        response => {

          if(
            response &&
            response.status === 200
          ){

            const copy =
              response.clone();


            caches
              .open(CACHE)
              .then(
                cache => {

                  cache.put(
                    event.request,
                    copy
                  );

                }
              );

          }


          return response;

        }
      )
      .catch(
        () =>

          caches.match(
            event.request
          )

      )

    );

  }
);