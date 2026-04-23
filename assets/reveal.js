/* Scroll-reveal — lightweight IntersectionObserver that flips `.in-view` on
 * elements with `.reveal` once they enter the viewport. Runs once per element;
 * no re-trigger on scroll-back. Deliberately plain JS (not obfuscated) so the
 * build pipeline leaves it untouched. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';
  var reduce = false;
  try {
    reduce = window.matchMedia &&
             window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {}

  function run() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Reduced-motion OR browsers without IntersectionObserver: show everything
    // immediately with no animation.
    if (reduce || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in-view');
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      for (var j = 0; j < entries.length; j++) {
        var e = entries[j];
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      }
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    for (var k = 0; k < els.length; k++) io.observe(els[k]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
