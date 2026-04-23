// Shared footer behaviour for Studio Print legal / info pages.
//
// Three jobs, all intentionally defensive so a single malformed element
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
// 3. `form.contact-form` — contact page message form (P10). Builds a
//    prefilled `mailto:` from name / email / category / message fields.
//    Same data-u / data-d scheme. Falls back to focusing the first
//    invalid field if validation fails.
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

  function wireContactForm(form) {
    var u = form.dataset.u;
    var d = form.dataset.d;
    if (!u || !d) return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = (form.querySelector('#cfName') || {}).value || '';
      var email = (form.querySelector('#cfEmail') || {}).value || '';
      var category = (form.querySelector('#cfCategory') || {}).value || 'Support';
      var message = (form.querySelector('#cfMessage') || {}).value || '';
      name = name.trim();
      email = email.trim();
      message = message.trim();

      var firstInvalid = null;
      if (!name) firstInvalid = firstInvalid || form.querySelector('#cfName');
      if (!email || email.indexOf('@') === -1) firstInvalid = firstInvalid || form.querySelector('#cfEmail');
      if (!message) firstInvalid = firstInvalid || form.querySelector('#cfMessage');
      if (firstInvalid) { firstInvalid.focus(); return; }

      var addr = u + '@' + d;
      var subject = '[' + category + '] Studio Print — ' + name;
      var body = [
        'Name: ' + name,
        'Email: ' + email,
        'Category: ' + category,
        '',
        message,
        '',
        '— Sent from studioprint.pages.dev/contact.html'
      ].join('\n');
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
    try {
      var cforms = document.querySelectorAll('form.contact-form');
      for (var k = 0; k < cforms.length; k++) wireContactForm(cforms[k]);
    } catch (e) { /* ignore — non-critical */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
