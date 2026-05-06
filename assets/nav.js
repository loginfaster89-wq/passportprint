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
        // Close any other open dropdowns first.
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

    // Click outside or Escape to close.
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

/* Shared low-cost marquee for informational pill/card strips.
   CSS keyframe marquees were unreliable under stale service-worker caches and
   kept animating off-screen. This uses one viewport-gated RAF loop for all
   moving strips, then pauses when hidden or focused. */
(function () {
  'use strict';
  if (window.__spMarqueeReady) return;
  window.__spMarqueeReady = true;

  var SELECTOR = '.sp-pill-marquee .sp-pill-track, .sp-card-marquee .sp-card-track';
  var items = [];
  var raf = 0;
  var last = 0;
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {}

  function pxPerSecond(track) {
    if (track.classList.contains('sp-card-track')) return window.innerWidth < 760 ? 12 : 18;
    return window.innerWidth < 760 ? 16 : 24;
  }

  function disableCssAnimation(track) {
    track.style.setProperty('animation', 'none', 'important');
    track.style.setProperty('will-change', 'auto', 'important');
  }

  function baseChildren(track) {
    return Array.prototype.slice.call(track.children).filter(function (el) {
      return el.getAttribute('data-sp-clone') !== 'true';
    });
  }

  function ensureCopies(item) {
    var track = item.track;
    var base = baseChildren(track);
    if (!base.length) return;

    Array.prototype.slice.call(track.querySelectorAll('[data-sp-clone="true"]')).forEach(function (el) {
      el.parentNode.removeChild(el);
    });

    var guard = 0;
    var minWidth = Math.max((item.wrap && item.wrap.clientWidth) || 0, window.innerWidth || 0) * 2.15;
    while (track.scrollWidth < minWidth && guard < 6) {
      base.forEach(function (el) {
        var clone = el.cloneNode(true);
        clone.setAttribute('data-sp-clone', 'true');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      guard += 1;
    }

    item.cycle = Math.max(1, track.scrollWidth / Math.max(2, guard + 1));
    item.speed = pxPerSecond(track);
  }

  function transform(item) {
    item.track.style.setProperty('transform', 'translate3d(' + (-item.x).toFixed(2) + 'px,0,0)', 'important');
  }

  function hasActiveItems() {
    return items.some(function (item) {
      return item.visible && !item.paused && item.cycle > 1 && !document.hidden;
    });
  }

  function tick(ts) {
    if (!last) last = ts;
    var dt = Math.min(64, ts - last) / 1000;
    last = ts;

    items.forEach(function (item) {
      if (!item.visible || item.paused || item.cycle <= 1) return;
      item.x = (item.x + item.speed * dt) % item.cycle;
      transform(item);
    });

    if (hasActiveItems()) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      last = 0;
    }
  }

  function wake() {
    if (!raf && hasActiveItems()) raf = requestAnimationFrame(tick);
  }

  function setupTrack(track) {
    var wrap = track.closest('.sp-pill-marquee, .sp-card-marquee');
    if (!wrap || track.__spMarqueeItem) return;
    disableCssAnimation(track);
    wrap.classList.add('sp-js-marquee');
    var item = {
      wrap: wrap,
      track: track,
      x: 0,
      cycle: 0,
      speed: pxPerSecond(track),
      paused: false,
      visible: true
    };
    track.__spMarqueeItem = item;
    items.push(item);
    ensureCopies(item);
    transform(item);

    wrap.addEventListener('mouseenter', function () { item.paused = true; }, { passive: true });
    wrap.addEventListener('mouseleave', function () { item.paused = false; wake(); }, { passive: true });
    wrap.addEventListener('focusin', function () { item.paused = true; });
    wrap.addEventListener('focusout', function () { item.paused = false; wake(); });
  }

  function refresh() {
    Array.prototype.slice.call(document.querySelectorAll(SELECTOR)).forEach(setupTrack);
    items.forEach(function (item) {
      item.x = 0;
      ensureCopies(item);
      transform(item);
    });
    wake();
  }

  function init() {
    if (reduceMotion) {
      Array.prototype.slice.call(document.querySelectorAll(SELECTOR)).forEach(disableCssAnimation);
      return;
    }
    refresh();

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var track = entry.target.querySelector('.sp-pill-track, .sp-card-track');
          if (track && track.__spMarqueeItem) {
            track.__spMarqueeItem.visible = entry.isIntersecting;
          }
        });
        wake();
      }, { rootMargin: '160px 0px' });
      items.forEach(function (item) { io.observe(item.wrap); });
    }

    var resizeTimer = 0;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 160);
    }, { passive: true });
    document.addEventListener('visibilitychange', wake);
    setTimeout(refresh, 350);
    setTimeout(refresh, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
