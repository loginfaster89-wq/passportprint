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
