/* Studio Print service worker — P28.
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

const CACHE_VERSION = 'studioprint-v25';
const RUNTIME_CACHE = 'studioprint-runtime-v25';

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
  '/assets/forms/ration-card-rajasthan.pdf',
  '/assets/forms/previews/ration-card-rajasthan.png',
  '/assets/forms/nfsa-rajasthan.pdf',
  '/assets/forms/previews/nfsa-rajasthan.png',
  '/assets/forms/income-certificate-format-rajasthan.pdf',
  '/assets/forms/previews/income-certificate-format-rajasthan.png',
  '/assets/forms/marriage-registration-rajasthan.pdf',
  '/assets/forms/previews/marriage-registration-rajasthan.png',
  '/assets/forms/character-certificate-rajasthan.pdf',
  '/assets/forms/previews/character-certificate-rajasthan.png',
  '/assets/forms/shop-act-form-1-rajasthan.pdf',
  '/assets/forms/previews/shop-act-form-1-rajasthan.png',
  '/assets/forms/labour-physical-verification-rajasthan.pdf',
  '/assets/forms/previews/labour-physical-verification-rajasthan.png',
  '/assets/forms/aadhaar-form-1.pdf',
  '/assets/forms/previews/aadhaar-form-1.png',
  '/assets/forms/pan-49a.pdf',
  '/assets/forms/previews/pan-49a.png',
  '/assets/forms/pan-49aa.pdf',
  '/assets/forms/previews/pan-49aa.png',
  '/assets/forms/voter-form-6.pdf',
  '/assets/forms/previews/voter-form-6.png',
  '/assets/forms/voter-form-6b.pdf',
  '/assets/forms/previews/voter-form-6b.png',
  '/assets/forms/voter-form-7.pdf',
  '/assets/forms/previews/voter-form-7.png',
  '/assets/forms/voter-form-8.pdf',
  '/assets/forms/previews/voter-form-8.png',
  '/assets/forms/epfo-composite-claim-aadhaar.pdf',
  '/assets/forms/previews/epfo-composite-claim-aadhaar.png',
  '/assets/forms/epfo-form-11.pdf',
  '/assets/forms/previews/epfo-form-11.png',
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
    if (network && network.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, network.clone()).catch(() => {});
    }
    return network;
  } catch (_) {
    const cached = await caches.match(request);
    if (cached) return cached;
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
