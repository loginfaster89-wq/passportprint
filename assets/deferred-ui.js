/* Lazy-load shared auth + pricing UI on static pages.
   Goal: keep homepage / legal pages light until the visitor actually
   interacts with login or plan controls. Tool pages keep their direct
   includes because they use the flows more heavily. */
(function () {
  'use strict';

  function loadCss(href, key) {
    if (document.querySelector('link[data-sp-deferred-css="' + key + '"]')) {
      return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.spDeferredCss = key;
      link.onload = function () { resolve(); };
      link.onerror = function () { reject(new Error('Could not load ' + href)); };
      document.head.appendChild(link);
    });
  }

  function loadScript(src, key) {
    if (document.querySelector('script[data-sp-deferred-js="' + key + '"]')) {
      return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset.spDeferredJs = key;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function loadAuthBundle() {
    return Promise.all([
      loadCss('assets/auth.css?v=ui-polish-v65', 'auth'),
      loadScript('assets/auth.js?v=ui-polish-v65', 'auth')
    ]);
  }

  function loadPricingBundle() {
    return Promise.all([
      loadCss('assets/pricing.css?v=ui-polish-v65', 'pricing'),
      loadAuthBundle(),
      loadScript('assets/pricing.js?v=ui-polish-v65', 'pricing')
    ]);
  }

  window.StudioPrintDeferred = window.StudioPrintDeferred || {};
  window.StudioPrintDeferred.loadAuthBundle = loadAuthBundle;
  window.StudioPrintDeferred.loadPricingBundle = loadPricingBundle;

  function getCachedUser() {
    try {
      var session = JSON.parse(localStorage.getItem('pps_session_v1') || 'null');
      if (!session || !session.email) return null;
      var users = JSON.parse(localStorage.getItem('pps_users_v1') || '{}');
      return users[session.email] || null;
    } catch (_) {
      return null;
    }
  }

  function setHeaderLabel() {
    var btn = document.getElementById('hdrAuthBtn');
    if (!btn) return;
    var user = getCachedUser();
    if (!user) {
      btn.innerHTML = '<span class="hdr-lbl">Login</span>';
      btn.title = 'Login / Signup';
      return;
    }
    var name = user.name || (user.email ? user.email.split('@')[0] : 'Account');
    btn.innerHTML = '<span class="hdr-lbl">' + String(name)
      .replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      }) + '</span>';
    btn.title = user.email ? ('Logged in as ' + user.email) : 'Account';
  }

  function bindAuthButton() {
    var btn = document.getElementById('hdrAuthBtn');
    if (!btn) return;
    setHeaderLabel();
    btn.addEventListener('click', function (e) {
      if (typeof window.openAuth === 'function' || typeof window.openAccount === 'function') {
        return;
      }
      e.preventDefault();
      var user = getCachedUser();
      loadAuthBundle().then(function () {
        if (user && typeof window.openAccount === 'function') {
          window.openAccount();
        } else if (typeof window.openAuth === 'function') {
          window.openAuth('login');
        }
      }).catch(function () {});
    });
  }

  function openPricingTarget(planId) {
    if (planId && typeof window.startCheckout === 'function') {
      window.startCheckout(planId);
      return;
    }
    if (typeof window.openPlans === 'function') {
      try { history.replaceState(null, '', '#pricing'); } catch (_) {}
      window.openPlans();
    }
  }

  function bindPricingLinks() {
    var links = document.querySelectorAll('a[href$="#pricing"], a[href="#plans"], [data-plan]');
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        if (link.__spDeferredPricing) return;
        link.__spDeferredPricing = true;
        link.addEventListener('click', function (e) {
          if (typeof window.openPlans === 'function' || typeof window.startCheckout === 'function') {
            return;
          }
          var planId = link.getAttribute('data-plan');
          e.preventDefault();
          loadPricingBundle().then(function () {
            openPricingTarget(planId);
          }).catch(function () {});
        });
      })(links[i]);
    }
  }

  function bindStartFree() {
    var links = document.querySelectorAll('[data-action="start-free"]');
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        if (link.__spDeferredStartFree) return;
        link.__spDeferredStartFree = true;
        link.addEventListener('click', function (e) {
          if (typeof window.currentUser === 'function' || typeof window.openAuth === 'function') {
            return;
          }
          e.preventDefault();
          loadAuthBundle().then(function () {
            var features = document.getElementById('features');
            if (typeof window.currentUser === 'function' && window.currentUser() && features) {
              features.scrollIntoView({ behavior: 'smooth' });
            } else if (typeof window.openAuth === 'function') {
              window.openAuth('login');
            }
          }).catch(function () {});
        });
      })(links[i]);
    }
  }

  function handleHashBoot() {
    var hash = (location.hash || '').slice(1);
    if (!hash) return;
    if (hash === 'pricing' || hash === 'plans' || hash.indexOf('buy-') === 0) {
      loadPricingBundle().then(function () {
        if (hash.indexOf('buy-') === 0) {
          openPricingTarget(hash.slice(4));
        } else {
          openPricingTarget('');
        }
      }).catch(function () {});
    }
  }

  function init() {
    bindAuthButton();
    bindPricingLinks();
    bindStartFree();
    handleHashBoot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
