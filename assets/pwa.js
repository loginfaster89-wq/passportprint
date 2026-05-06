/* Studio Print — service worker registration (P28).
 *
 * Kept tiny and dependency-free. Registers /sw.js with root scope so one SW
 * controls the whole site (including passport-photo.html which does not load
 * this script itself — the SW still auto-controls it after the first visit).
 *
 * No-ops on browsers without SW support and on non-https origins except
 * localhost (the browser enforces that anyway).
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  var didControllerReload = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (didControllerReload) return;
    didControllerReload = true;
    try {
      if (sessionStorage.getItem('sp-sw-reload-v68')) return;
      sessionStorage.setItem('sp-sw-reload-v68', '1');
    } catch (_) {}
    window.location.reload();
  });

  var register = function () {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then(function (registration) {
        registration.update().catch(function () {});
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(function () {
        // Registration can fail on file:// preview or private-mode browsers —
        // swallow silently so the page still works.
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }
})();

