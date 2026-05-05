/* Studio Print service worker — P31.
 *
 * Strategy
 *   - Navigation (HTML) requests: network-first, fall back to cache, then to
 *     /offline.html. Lets users bounce around the site with no network.
 *   - Same-origin static assets (/assets/*, icons, manifest, sw.js itself):
 *     cache-first with background revalidate (stale-while-revalidate).
 *   - Cross-origin requests (Google Fonts, Hugging Face model, Razorpay,
 *     GSI, Render backend, etc.): passthrough to network — never cached,
 *     never intercepted on failure. The app behaves exactly as before for
 *     those.
 *
 * Keep this file small and dependency-free; it runs on every page load.
 * Bump CACHE_VERSION when the precache list or this file's logic changes so
 * the activate step can evict the old cache.
 */

const CACHE_VERSION = 'studioprint-v55';
const RUNTIME_CACHE = 'studioprint-runtime-v55';
const ID_PRINT_REFRESH_VERSION = 'id-print-v52';

// Minimum shell we want available offline after the first visit. The SW also
// opportunistically caches other same-origin GETs it sees at runtime, so this
// list only has to cover the "type the URL with no network" case.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/refund.html',
  '/shipping.html',
  '/forms.html',
  '/404.html',
  '/assets/legal.css',
  '/assets/auth.css',
  '/assets/nav.js',
  '/assets/auth.js',
  '/assets/deferred-ui.js',
  '/assets/footer.js',
  '/assets/sliders.js',
  '/assets/reveal.js',
  '/assets/pwa.js',
  '/assets/manifest.webmanifest',
  '/assets/logo.svg',
  '/assets/favicon-32.png',
  '/assets/apple-touch-icon.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/icon-maskable-512.png',
  '/assets/forms/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // addAll is atomic — if any URL fails, the install fails. Use Promise.allSettled
      // via individual puts so a single 404 during deploy can't brick the SW install.
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((response) => {
              if (response && response.ok) return cache.put(url, response.clone());
              return null;
            })
            .catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_VERSION && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((clientList) =>
        Promise.all(clientList.map((client) => {
          try {
            const url = new URL(client.url);
            const isIdPrint = url.pathname === '/id-print' || url.pathname === '/id-print.html';
            if (!isIdPrint || url.searchParams.get('sw-refresh') === ID_PRINT_REFRESH_VERSION) return null;
            url.searchParams.set('sw-refresh', ID_PRINT_REFRESH_VERSION);
            return client.navigate(url.href);
          } catch (_) {
            return null;
          }
        }))
      )
  );
});

// Allow the page to tell the SW to take over immediately (used by pwa.js
// when the user clicks a "reload to update" affordance in the future).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isSameOrigin(url) {
  try {
    return new URL(url, self.location.href).origin === self.location.origin;
  } catch (_) {
    return false;
  }
}

function isHtmlRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

async function networkFirstHtml(request) {
  try {
    const network = await fetch(request);
    return network;
  } catch (_) {
    const offline = await caches.match('/offline.html');
    if (offline) return offline;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
      return response;
    })
    .catch(() => null);
  return cached || (await networkPromise) || new Response('Offline', { status: 503 });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (!isSameOrigin(request.url)) return; // never intercept cross-origin

  // Skip Range requests (video / audio) — SW caching breaks partial responses.
  if (request.headers.has('range')) return;

  if (isHtmlRequest(request)) {
    event.respondWith(networkFirstHtml(request));
    return;
  }

  // Same-origin assets: stale-while-revalidate.
  event.respondWith(staleWhileRevalidate(request));
});

