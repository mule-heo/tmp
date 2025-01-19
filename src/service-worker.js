import { manifest, version } from "@parcel/service-worker";

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest);
}
addEventListener("install", (e) => e.waitUntil(install()));

async function activate() {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => key !== version && caches.delete(key)));
}
addEventListener("activate", (e) => e.waitUntil(activate()));

// Fetch event: Network first strategy
async function fetchAndCache(request) {
  const cache = await caches.open(version);
  try {
    const response = await fetch(request); // Try fetching the resource from the network
    if (response.ok) {
      cache.put(request, response.clone()); // Cache the network response
    }
    return response; // Return the network response
  } catch (_err) {
    // If the network request fails (i.e., offline), fallback to cache
    const cached = await cache.match(request);
    return (
      cached ||
      new Response("You are offline and no cached content is available.", {
        status: 503,
        statusText: "Service Unavailable",
      })
    );
  }
}
addEventListener("fetch", (e) => e.respondWith(fetchAndCache(e.request)));
