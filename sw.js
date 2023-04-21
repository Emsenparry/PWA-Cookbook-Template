// Navn på App Shell Cache til assets filer
const staticCacheName = 'site-static-v1'
// Navn på dynamisk cache
const dynamicCacheName = 'site-dynamic-v1'

// Array med assets filer til statisk cache
const assets = [
    '/',
    './index.html',
    './js/app.js',
    './js/ui.js',
    './js/materialize.min.js',
    './css/styles.css',
    './css/materialize.min.css',
    './img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
]

const limitCacheSize = (cacheName, numAllowedFiles) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > numAllowedFiles) {
                cache.delete(keys[0]).then(limitCacheSize(cacheName, numAllowedFiles))
            }
        })
    })
}

// Her installere vi vores service worker
self.addEventListener('install', event => {
    // console.log('serviceworker has been installed');
    // Vent til alle opgaver er udført
    event.waitUntil(

        /* Tilføj assets filer til statisk cache*/

        // Åbn statisk cache
        caches.open(staticCacheName).then(cache => {
            // Tilføj array af assets filer til cache
            cache.addAll(assets)
        })
    )
})

// Efter sw er blevet installeret skal den aktiveres. Vi aktivere den ved hjælp af 'active'
self.addEventListener('activate', event => {
    console.log('serviceworker has been activated');
    // Vent til alle opgaver er udført
    event.waitUntil(
        /* Slet tidligere cache versioner */

        // Kald alle cache nøgler (navn på cache samlinger)
        caches.keys().then(keys => {
            // Returnerer et array af promise (et promis for hver fil)
            return Promise.all(keys
                // Filtrer alle som ikke er medlem af den nuværende cache version
                .filter(key => key !== staticCacheName)
                // Map filter array og slet filer
                .map(key => caches.delete(key)))
        })
    )
    return;
})

// Fetch event
self.addEventListener('fetch', event => {

    // Fix af problem med dynamisk cache og chrome-extension bug
    if (!(event.request.url.indexOf('http') === 0)) return;

    // Kontroller svar på request
    event.respondWith(
        // Kig efter file match i cache
        caches.match(event.request).then(cacheRes => {
            // Returner hvis match fra cache - ellers hent fil på server
            return cacheRes || fetch(event.request)

                .then(fetchRes => {
                    // Åbner dynamisk cache
                    return caches.open(dynamicCacheName).then(cache => {
                        // Tilføj side til dynamisk cache
                        //Clone tager en kopi af variablen
                        cache.put(event.request.url, fetchRes.clone())

                        limitCacheSize(dynamicCacheName, 2)

                        //Returner request
                        return fetchRes
                    })
                })
        }).catch(() => {
            if (event.request.url.indexOf('.html') > -1) {
                return caches.match('/pages/fallback.html')
            }
        })
    )
})




