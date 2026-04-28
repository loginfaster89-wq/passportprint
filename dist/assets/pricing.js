/* Shared pricing module for Studio Print — Choose-your-Plan modal +
   Complete-Payment modal + Razorpay checkout. Previously only
   passport-photo.html had this UI inline, and the homepage + legal
   pages either linked to `#pricing` (which scrolled / navigated to
   the homepage pricing section) or fired Razorpay directly without
   showing a plan-picker first. Now every page that includes this
   module shares the same 2-step flow: Pricing link → Choose Plan
   modal → "Upgrade now" → Complete Payment → Razorpay. passport-photo
   keeps its own inline copy (minimum-diff; SKILL hard rule #1) and
   this module never overrides it.

   Include AFTER assets/auth.js so window.currentUser / window.openAuth
   are available:

     <link rel="stylesheet" href="assets/pricing.css">
     <script src="assets/pricing.js" defer></script>

   Razorpay Checkout SDK + preconnects must also be on the page (see
   index.html head for the canonical snippet). Without the SDK the
   "Pay Securely" button falls back to navigating to
   passport-photo.html#buy-<plan> so users never get stuck. */

(function () {
  'use strict';

  // If passport-photo's inline modal is already on the page, step aside —
  // that file's own openPlans / startCheckout / completePayment already
  // power the flow and this shared module would only cause double-modals.
  if (document.getElementById('plansModal') || typeof window.openPlans === 'function') {
    return;
  }

  var BACKEND_URL = 'https://passportprint-studio.onrender.com';
  var AUTH_TOKEN_KEY = 'pps_token_v1';

  // Mirrors the PLANS constant in passport-photo.html so feature copy +
  // pricing stays in lock-step. Pricing numbers also appear in
  // index.html, terms.html, refund.html, shipping.html — if any of
  // these change, update all four per SKILL hard rule #7.
  var PLANS = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      tagline: 'Try it out — 2 sheets/day after login.',
      features: [
        'Passport Photo tool',
        'ID Card Print tool',
        '300 DPI A4 output',
        '2 sheets per day'
      ]
    },
    weekly: {
      id: 'weekly',
      name: 'Weekly',
      price: 59,
      period: '/week',
      tagline: '7 days of unlimited Studio Print output.',
      features: [
        'Unlimited A4 sheets',
        'Passport Photo + ID Card Print',
        'All passport country presets',
        'Unlimited ID downloads / prints',
        'HD 600 DPI passport export'
      ]
    },
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      price: 149,
      period: '/month',
      tagline: 'Best value for daily counter work.',
      features: [
        'Everything in Weekly',
        '30 days on one payment',
        'Best for daily counter work',
        'Priority email support',
        'Best value — saves ₹27/month vs weekly'
      ]
    }
  };

  // ── Utilities ──
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function currentUser() {
    try {
      if (typeof window.currentUser === 'function') return window.currentUser();
    } catch (_) {}
    return null;
  }

  function effectivePlan(user) {
    if (!user) return 'free';
    var plan = user.plan || 'free';
    var exp = user.planExpiresAt || 0;
    if (plan !== 'free' && exp && Date.now() > exp) return 'free';
    return plan;
  }

  // Toast: delegates to the shared auth.js notify if present, otherwise
  // reuses the auth.css .sp-toast element.
  var _spToastTimer = null;
  function notify(msg) {
    if (!msg) return;
    try {
      if (typeof window.showToast === 'function') { window.showToast(msg); return; }
    } catch (_) {}
    var el = document.getElementById('spToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'spToast';
      el.className = 'sp-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('sp-toast-show');
    clearTimeout(_spToastTimer);
    _spToastTimer = setTimeout(function () {
      el.classList.remove('sp-toast-show');
    }, 3200);
  }

  // ── Backend ──
  async function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var token = null;
    try { token = localStorage.getItem(AUTH_TOKEN_KEY); } catch (_) {}
    if (token) headers['Authorization'] = 'Bearer ' + token;
    var res = await fetch(BACKEND_URL + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    var data = null;
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) {
      var err = new Error((data && data.error) || ('HTTP ' + res.status));
      err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  // ── Modal markup (injected once on first open) ──
  var PLANS_OVERLAY_ID = 'spPlansOverlay';
  var PAY_OVERLAY_ID = 'spPayOverlay';

  function ensureModals() {
    if (document.getElementById(PLANS_OVERLAY_ID)) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = [
      '<div class="sp-plans-overlay" id="' + PLANS_OVERLAY_ID + '" role="dialog" aria-modal="true" aria-labelledby="spPlansTitle">',
      '  <div class="sp-plans-modal">',
      '    <div class="sp-plans-header">',
      '      <div class="sp-plans-title" id="spPlansTitle">Choose your <em>Plan</em></div>',
      '      <button type="button" class="sp-plans-close" aria-label="Close">✕</button>',
      '    </div>',
      '    <div class="sp-plans-body">',
      '      <div class="sp-plans-tagline">',
      '        Use all live Studio Print tools on one plan.<br>',
      '        <span class="accent">Passport Photo + ID Card Print · Secure Razorpay payments · No auto-renewal</span>',
      '      </div>',
      '      <div class="sp-plans-grid" id="spPlansGrid"></div>',
      '      <div class="sp-plans-note">',
      '        <strong>💡 Note:</strong> All payments are processed securely through Razorpay (UPI, Cards and Net Banking all supported). Your plan activates instantly once payment succeeds. Cancel anytime.',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="sp-pay-overlay" id="' + PAY_OVERLAY_ID + '" data-plan-id="" role="dialog" aria-modal="true" aria-labelledby="spPayTitle">',
      '  <div class="sp-pay-modal">',
      '    <div class="sp-pay-header">',
      '      <div class="sp-pay-title" id="spPayTitle">Complete <em>Payment</em></div>',
      '      <button type="button" class="sp-pay-close" aria-label="Close">✕</button>',
      '    </div>',
      '    <div class="sp-pay-body">',
      '      <div class="sp-pay-summary">',
      '        <div class="sp-pay-row"><span>Plan</span><strong id="spPayPlanName">—</strong></div>',
      '        <div class="sp-pay-row"><span>Duration</span><strong id="spPayPlanPeriod">—</strong></div>',
      '        <div class="sp-pay-row"><span>Price</span><strong id="spPayPlanPrice">—</strong></div>',
      '        <div class="sp-pay-row total"><span>Total</span><span id="spPayTotal">—</span></div>',
      '      </div>',
      '      <div class="sp-pay-label">Payment Method</div>',
      '      <div class="sp-pay-methods">',
      '        <div class="sp-pay-method active" data-method="razorpay">💳 Card / UPI / Netbanking<small>Razorpay · GPay / PhonePe / Paytm</small></div>',
      '      </div>',
      '      <button type="button" class="sp-pay-cta" id="spPayCta">🔒 Pay Securely</button>',
      '      <div class="sp-pay-secure">🔒 256-bit secure encryption · Your data is safe</div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    wireModalEvents();
  }

  function openOverlay(id) {
    var o = document.getElementById(id);
    if (!o) return;
    o.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay(id) {
    var o = document.getElementById(id);
    if (!o) return;
    o.classList.remove('active');
    // Only release body scroll if no other sp-*-overlay is still active.
    var anyActive = document.querySelector('.sp-plans-overlay.active, .sp-pay-overlay.active, .sp-auth-overlay.active');
    if (!anyActive) document.body.style.overflow = '';
  }

  function wireModalEvents() {
    var plansOverlay = document.getElementById(PLANS_OVERLAY_ID);
    var payOverlay = document.getElementById(PAY_OVERLAY_ID);
    if (plansOverlay) {
      plansOverlay.querySelector('.sp-plans-close').addEventListener('click', function () {
        closeOverlay(PLANS_OVERLAY_ID);
      });
      plansOverlay.addEventListener('click', function (e) {
        if (e.target === plansOverlay) closeOverlay(PLANS_OVERLAY_ID);
      });
    }
    if (payOverlay) {
      payOverlay.querySelector('.sp-pay-close').addEventListener('click', function () {
        closeOverlay(PAY_OVERLAY_ID);
      });
      payOverlay.addEventListener('click', function (e) {
        if (e.target === payOverlay) closeOverlay(PAY_OVERLAY_ID);
      });
      payOverlay.querySelectorAll('.sp-pay-method').forEach(function (m) {
        m.addEventListener('click', function () {
          payOverlay.querySelectorAll('.sp-pay-method').forEach(function (x) {
            x.classList.remove('active');
          });
          m.classList.add('active');
        });
      });
      payOverlay.querySelector('#spPayCta').addEventListener('click', completePayment);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (document.getElementById(PAY_OVERLAY_ID) && document.getElementById(PAY_OVERLAY_ID).classList.contains('active')) {
        closeOverlay(PAY_OVERLAY_ID);
      } else if (document.getElementById(PLANS_OVERLAY_ID) && document.getElementById(PLANS_OVERLAY_ID).classList.contains('active')) {
        closeOverlay(PLANS_OVERLAY_ID);
      }
    });
  }

  // ── Render plans ──
  function renderPlans() {
    ensureModals();
    var grid = document.getElementById('spPlansGrid');
    if (!grid) return;
    var user = currentUser();
    var curPlan = effectivePlan(user);
    grid.innerHTML = '';
    ['free', 'weekly', 'monthly'].forEach(function (id) {
      var p = PLANS[id];
      var isCur = curPlan === p.id;
      var isFeatured = p.id === 'monthly';
      var priceHtml = p.price === 0
        ? '<div class="sp-plan-price"><span class="currency">₹</span>0<span class="period">forever</span></div>'
        : '<div class="sp-plan-price"><span class="currency">₹</span>' + p.price + '<span class="period">' + escapeHtml(p.period) + '</span></div>';
      var btnHtml;
      if (isCur) {
        btnHtml = '<button type="button" class="sp-plan-btn sp-plan-btn-current">✓ Your Plan</button>';
      } else if (p.id === 'free') {
        btnHtml = '<button type="button" class="sp-plan-btn sp-plan-btn-free" data-plan-action="free">Switch to Free</button>';
      } else {
        btnHtml = '<button type="button" class="sp-plan-btn sp-plan-btn-primary" data-plan-action="buy" data-plan-id="' + escapeHtml(p.id) + '">Upgrade now</button>';
      }
      var feats = p.features.map(function (f) { return '<li>' + escapeHtml(f) + '</li>'; }).join('');
      var card = document.createElement('div');
      card.className = 'sp-plan-card' + (isFeatured ? ' featured' : '') + (isCur ? ' current' : '');
      card.innerHTML =
        '<div class="sp-plan-name">' + escapeHtml(p.name) + '</div>' +
        '<div class="sp-plan-tagline">' + escapeHtml(p.tagline) + '</div>' +
        priceHtml +
        '<ul class="sp-plan-features">' + feats + '</ul>' +
        btnHtml;
      grid.appendChild(card);
    });

    // Wire the fresh buttons.
    grid.querySelectorAll('[data-plan-action="buy"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        startCheckout(btn.getAttribute('data-plan-id'));
      });
    });
    var freeBtn = grid.querySelector('[data-plan-action="free"]');
    if (freeBtn) {
      freeBtn.addEventListener('click', function () {
        // The only user-facing action here is "acknowledge you're on Free"
        // since downgrade is automatic when a paid plan expires. Just
        // close the modal — no backend call.
        closeOverlay(PLANS_OVERLAY_ID);
        notify('You are on the Free plan.');
      });
    }
  }

  function openPlans() {
    renderPlans();
    openOverlay(PLANS_OVERLAY_ID);
  }

  // ── Checkout ──
  function startCheckout(planId) {
    var p = PLANS[planId];
    if (!p || p.price === 0) return;

    var user = currentUser();
    if (!user) {
      // Require auth before showing the payment summary. auth.js modal
      // dismisses with class change on #spAuthModal — watch for that
      // and continue the buy flow once the user is logged in.
      closeOverlay(PLANS_OVERLAY_ID);
      if (typeof window.openAuth !== 'function') {
        // No shared auth on this page — graceful fallback.
        location.href = 'passport-photo.html#buy-' + planId;
        return;
      }
      window.openAuth('signup');
      notify('Please sign in to continue.');
      var overlay = document.getElementById('spAuthModal');
      if (!overlay) return;
      var mo = new MutationObserver(function () {
        if (!overlay.classList.contains('active')) {
          mo.disconnect();
          setTimeout(function () {
            if (currentUser()) startCheckout(planId);
          }, 60);
        }
      });
      mo.observe(overlay, { attributes: true, attributeFilter: ['class'] });
      return;
    }

    ensureModals();
    var payOverlay = document.getElementById(PAY_OVERLAY_ID);
    document.getElementById('spPayPlanName').textContent = p.name;
    document.getElementById('spPayPlanPrice').textContent = '₹' + p.price;
    document.getElementById('spPayPlanPeriod').textContent = p.period;
    document.getElementById('spPayTotal').textContent = '₹' + p.price;
    payOverlay.setAttribute('data-plan-id', planId);
    // Reset method selection to the default razorpay pill.
    payOverlay.querySelectorAll('.sp-pay-method').forEach(function (m) {
      m.classList.toggle('active', m.getAttribute('data-method') === 'razorpay');
    });
    closeOverlay(PLANS_OVERLAY_ID);
    openOverlay(PAY_OVERLAY_ID);
  }

  async function completePayment() {
    var payOverlay = document.getElementById(PAY_OVERLAY_ID);
    if (!payOverlay) return;
    var planId = payOverlay.getAttribute('data-plan-id');
    var p = PLANS[planId];
    if (!p) return;
    var user = currentUser();
    if (!user) { notify('Please sign in to continue.'); return; }

    var cta = document.getElementById('spPayCta');
    if (cta) { cta.disabled = true; cta.textContent = 'Processing…'; }

    function reset() {
      if (cta) { cta.disabled = false; cta.textContent = '🔒 Pay Securely'; }
    }

    if (!window.Razorpay) {
      // SDK never loaded — bail to the passport-photo flow which has its
      // own SDK loader + retry logic.
      reset();
      closeOverlay(PAY_OVERLAY_ID);
      location.href = 'passport-photo.html#buy-' + planId;
      return;
    }

    try {
      var order = await api('/api/create-order', { method: 'POST', body: { plan: planId } });
      var rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Studio Print',
        description: p.name + ' Plan',
        image: new URL('assets/logo.png', window.location.origin + window.location.pathname).href,
        order_id: order.orderId,
        prefill: { name: user.name || '', email: user.email || '' },
        theme: { color: '#f0a500' },
        handler: async function (resp) {
          try {
            await api('/api/verify-payment', {
              method: 'POST',
              body: {
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
                plan: planId
              }
            });
            notify(p.name + ' plan activated.');
            closeOverlay(PAY_OVERLAY_ID);
            try {
              if (typeof window.refreshAuthUI === 'function') window.refreshAuthUI();
            } catch (_) {}
          } catch (ex) {
            notify('Verification failed: ' + ex.message);
          } finally {
            reset();
          }
        },
        modal: {
          ondismiss: function () {
            notify('Payment cancelled.');
            reset();
          }
        }
      });
      rzp.open();
    } catch (ex) {
      notify('Could not start payment: ' + ex.message);
      reset();
    }
  }

  // ── Header / footer "Pricing" link wiring ──
  // Any anchor whose href ends in `#pricing` (homepage hash on index.html,
  // cross-page link `index.html#pricing` on legal/info pages) becomes a
  // trigger for the shared modal. We intercept the click, stop the
  // navigation, and open the modal right here. Hash still changes to
  // `#pricing` for deep-linking / refresh.
  function wirePricingLinks() {
    var links = document.querySelectorAll('a[href$="#pricing"], a[href="#plans"]');
    links.forEach(function (a) {
      if (a.__spPricingWired) return;
      a.__spPricingWired = true;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var planId = a.getAttribute('data-plan');
        if (planId && PLANS[planId]) {
          startCheckout(planId);
        } else {
          history.replaceState(null, '', '#pricing');
          openPlans();
        }
      });
    });
  }

  // Open on hash load / hashchange so a direct visit to `foo.html#pricing`
  // auto-surfaces the modal.
  function handleHash() {
    var h = (location.hash || '').slice(1);
    if (h === 'pricing' || h === 'plans') {
      openPlans();
    } else if (h.indexOf('buy-') === 0) {
      var planId = h.slice(4);
      if (PLANS[planId]) startCheckout(planId);
    }
  }

  function wireStartFree() {
    document.querySelectorAll('[data-action="start-free"]').forEach(function (a) {
      if (a.__spStartFreeWired) return;
      a.__spStartFreeWired = true;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var user = currentUser();
        if (user) {
          var el = document.getElementById('features');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof window.openAuth === 'function') {
          window.openAuth();
        }
      });
    });
  }

  function init() {
    ensureModals();
    wirePricingLinks();
    wireStartFree();
    handleHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  window.addEventListener('hashchange', handleHash);

  // Public API — also useful for index.html's pricing-card CTAs.
  window.openPlans = openPlans;
  window.startCheckout = startCheckout;
})();
