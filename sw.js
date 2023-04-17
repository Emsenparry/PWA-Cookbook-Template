// Her installere vi vores service worker
self.addEventListener('install', event => {
    console.log('serviceworker has been installed');
})


// Efter sw er blevet installeret skal den aktiveres.
// Vi aktivere den ved hjælp af 'active'
self.addEventListener('activate', event => {
    console.log('serviceworker has been activated');
})