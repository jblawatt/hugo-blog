
var OFFLINE_VERSION = 1;
var OFFLINE_URL = "/blog/hugo-blog-auf-uberspace/";
var CURRENT_CACHES = {
    offline: "offline-v" + OFFLINE_VERSION
};

function createCacheBustedRequest(url) {
    var request = new Request(url, {cache: "reload"});

    if ("cache" in request) {
        return request;
    }

    var bustedUrl = new URL(url, self.location.href);
    bustedUrl.search += (bustedUrl.search ? "&" : "") + "cachebust=" + Date.now();
    return new Request(bustedUrl);

}


self.addEventListener("install", function (event) {
    console.log("service-worker install");
    event.waitUntil(
        fetch(createCacheBustedRequest(OFFLINE_URL)).then(function (response) {
            return caches.open(CURRENT_CACHES.offline).then(function (cache) {
                return cache.put(OFFLINE_URL, response);
            });
        })
    );

});

self.addEventListener("activate", function (event) {
    console.log("service-worker activate");

    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if(expectedCacheNames.indexOf(cacheName) === -1) {
                        concole.log("deleting the cache for", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

});

self.addEventListener("fetch", function (event) {
    if (event.request.mode === "navigate" ||
            event.request.method == "GET" &&
            event.request.headers.get("accept").includes("text/html")) {
        console.log("handling fetch event for", event.request.url);
        event.respondWith(
            fetch(event.request).cache(function (error) {
                console.log("fetch failed; retuning offline page instead;");
                return caches.match(OFFLINE_URL);
            })
        )
    }
});