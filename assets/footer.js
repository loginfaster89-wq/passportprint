// Shared footer behaviour for Studio Print legal / info pages.
//
// Two jobs, both intentionally defensive so a single malformed element
// never takes the whole script down:
//
// 1. `.email-obf` anchors — reveal on demand. Markup ships with
//    data-u / data-d so the address isn't in the HTML source as plain
//    text (anti-scrape, see PR #77 / issue F8). Optional data-subject
//    pre-fills the mail client subject line.
//
// 2. `form.footer-news` — newsletter signup. No backend endpoint yet,
//    so we build a `mailto:` to the obfuscated owner address with the
//    subscriber's typed email in the body. Same data-u / data-d scheme
//    as the link obfuscator so the email stays out of the HTML source.
//
// Kept as a plain, non-obfuscated file (like `assets/sliders.js` and
// `assets/reveal.js`) so the build pipeline can't silently mangle the
// IIFE or rename the DOM attribute lookups.
(function () {
  'use strict';

  function revealObfLink(el) {
    var u = el.dataset.u;
    var d = el.dataset.d;
    if (!u || !d) return;
    var addr = u + '@' + d;
    var subject = el.dataset.subject;
    el.href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    // If the element is purely an icon (has no visible text beyond SVG),
    // leave the existing markup untouched. Replace plain-text placeholders
    // only when the link currently shows the "reveal email" prompt.
    if (el.dataset.keepLabel !== 'true' && !el.querySelector('svg') && !el.getAttribute('aria-label')) {
      el.textContent = addr;
    }
  }

  function wireNewsletter(form) {
    var u = form.dataset.u;
    var d = form.dataset.d;
    if (!u || !d) return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var input = form.querySelector('input[type=email]');
      var email = input && input.value ? input.value.trim() : '';
      if (!email) {
        if (input) input.focus();
        return;
      }
      var addr = u + '@' + d;
      var subject = 'Newsletter signup — Studio Print';
      var body = 'Please add this email to the Studio Print product-update list: ' + email;
      var href = 'mailto:' + addr +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = href;
    });
  }

  function init() {
    try {
      var links = document.querySelectorAll('.email-obf');
      for (var i = 0; i < links.length; i++) revealObfLink(links[i]);
    } catch (e) { /* ignore — non-critical */ }
    try {
      var forms = document.querySelectorAll('form.footer-news');
      for (var j = 0; j < forms.length; j++) wireNewsletter(forms[j]);
    } catch (e) { /* ignore — non-critical */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
