/* Shared nav behavior: hamburger toggle + Features dropdown.
   Used by the homepage and every legal/policy page that includes
   .legal-header markup. Vanilla JS, no deps. */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function init() {
    var header = $('.legal-header');
    if (!header) return;
    var nav = $('nav', header);
    var toggle = $('.nav-toggle', header);

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    $all('.has-dropdown', header).forEach(function (dd) {
      var btn = $('.nav-dd-btn', dd);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = !dd.classList.contains('open');
        $all('.has-dropdown.open', header).forEach(function (other) {
          if (other !== dd) {
            other.classList.remove('open');
            var b = $('.nav-dd-btn', other);
            if (b) b.setAttribute('aria-expanded', 'false');
          }
        });
        dd.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', function (e) {
      $all('.has-dropdown.open', header).forEach(function (dd) {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
          var b = $('.nav-dd-btn', dd);
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      $all('.has-dropdown.open', header).forEach(function (dd) {
        dd.classList.remove('open');
        var b = $('.nav-dd-btn', dd);
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Marquee pause/play manager.
   CSS @keyframes drives the animation — it fires on first paint with zero
   timing dependency. This script only adds:
     (a) prefers-reduced-motion kill-switch
     (b) hover + focus pause via animationPlayState
     (c) IntersectionObserver pause when strips scroll off-screen

   The previous RAF-loop approach used disableCssAnimation() which raced
   against deferred font load: scrollWidth was 0 at defer time, cycle
   computed as 0 or 1, and the loop never started. Removed entirely. */
(function () {
  'use strict';
  if (window.__spMarqueeReady) return;
  window.__spMarqueeReady = true;

  var WRAP_SEL  = '.sp-pill-marquee, .sp-card-marquee';
  var TRACK_SEL = '.sp-pill-track, .sp-card-track';

  var reduceMotion = false;
  try { reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (_) {}

  function setPlay(wrap, state) {
    var t = wrap.querySelector(TRACK_SEL);
    if (t) t.style.animationPlayState = state;
  }

  function init() {
    var wraps = Array.prototype.slice.call(document.querySelectorAll(WRAP_SEL));

    if (reduceMotion) {
      wraps.forEach(function (wrap) {
        var t = wrap.querySelector(TRACK_SEL);
        if (t) { t.style.animation = 'none'; t.style.transform = 'none'; }
      });
      return;
    }

    wraps.forEach(function (wrap) {
      wrap.addEventListener('mouseenter', function () { setPlay(wrap, 'paused');  }, { passive: true });
      wrap.addEventListener('mouseleave', function () { setPlay(wrap, 'running'); }, { passive: true });
      wrap.addEventListener('focusin',    function () { setPlay(wrap, 'paused');  });
      wrap.addEventListener('focusout',   function () { setPlay(wrap, 'running'); });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          setPlay(entry.target, entry.isIntersecting ? 'running' : 'paused');
        });
      }, { rootMargin: '200px 0px' });
      wraps.forEach(function (wrap) { io.observe(wrap); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
