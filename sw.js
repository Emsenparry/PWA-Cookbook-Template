const staticCacheName = 'site-static-v1'
const dynamicCacheName = 'site-dynamic-v1'

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

// Her installere vi vores service worker
self.addEventListener('install', event => {
    // console.log('serviceworker has been installed');
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            // console.log(('Caching all asstes'));
            cache.addAll(assets)
        })
    )
})

// Efter sw er blevet installeret skal den aktiveres. Vi aktivere den ved hjælp af 'active'
self.addEventListener('activate', event => {
    console.log('serviceworker has been activated');

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key)))
        })
    )
    return;
})

self.addEventListener('fetch', event => {
    // Fix af problem med dynamisk cache og chrome-extension bug
    if(!(event.request.url.indexOf('http') === 0)) return;
    // console.log(event.request);

    // Kontroller svar på request
    event.respondWith(
        // Kig efter file match i cache
        caches.match(event.request).then(cacheRes => {
            // Returner hvis match fra cache - ellers hent fil på server
            return cacheRes || fetch(event.request).then(fetchRes => {
                // Åbner dynamisk cache
                return caches.open(dynamicCacheName).then(cache => {
                    // Tilføj side til dynamisk cache
                    cache.put(event.request.url, fetchRes.clone()) //Clone tager en kopi af variablen
                    return fetchRes
                })
            })
        })
    )

})

