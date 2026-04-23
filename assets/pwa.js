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

  var register = function () {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
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
