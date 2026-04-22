/* ─────────────────────────────────────────────────────────
   Shared auth module for homepage + legal/policy pages.
   Provides: openAuth(), closeModal(), setAuthTab(),
             doLogin(), doSignup(), doVerifySignupOtp(),
             resendSignupOtp(), openAccount(), logout(),
             refreshAuthUI().

   Uses the SAME backend + localStorage keys as
   passport-photo.html, so signing in here carries over
   when the user navigates to the Passport Photo tool.

   passport-photo.html has its own inline copy of this
   logic — this file is intentionally never loaded there.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // If passport-photo.html (or any other page) already defined openAuth,
  // bail out to avoid double-registering.
  if (typeof window.openAuth === 'function') return;

  var BACKEND_URL = 'https://passportprint-studio.onrender.com';
  var AUTH_TOKEN_KEY   = 'pps_token_v1';
  var AUTH_SESSION_KEY = 'pps_session_v1';
  var AUTH_STORE_KEY   = 'pps_users_v1';

  // ── Storage helpers (compatible with passport-photo.html) ──
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveUsers(u) {
    try { localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(u)); } catch (e) {}
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)); }
    catch (e) { return null; }
  }
  function setSession(s) {
    try {
      if (s) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {}
  }
  function currentUser() {
    var s = getSession(); if (!s) return null;
    return getUsers()[s.email] || null;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isGmailAddress(s) {
    if (typeof s !== 'string') return false;
    return /^[a-z0-9][a-z0-9._+\-]{0,62}[a-z0-9]@gmail\.com$/.test(s.trim().toLowerCase());
  }

  // ── API ──
  function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(BACKEND_URL + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        if (!res.ok) {
          var err = new Error((data && data.error) || ('HTTP ' + res.status));
          err.status = res.status; err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  // ── Modal helpers ──
  function openModal(id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.remove('active');
    document.body.style.overflow = '';
  }
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  // ── Toast ──
  var _toastEl = null, _toastTimer = null;
  function showToast(msg) {
    if (!_toastEl) {
      _toastEl = document.createElement('div');
      _toastEl.className = 'sp-toast';
      document.body.appendChild(_toastEl);
    }
    _toastEl.textContent = msg || '';
    _toastEl.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () {
      _toastEl.classList.remove('show');
    }, 2800);
  }

  // ── DOM: inject modals ──
  function injectModals() {
    if (document.getElementById('authModal')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = [
      '<div class="modal-overlay auth-modal" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">',
      '  <div class="modal">',
      '    <div class="modal-header">',
      '      <div class="modal-title" id="authModalTitle">Studio <em>Print</em></div>',
      '      <button type="button" class="modal-close" aria-label="Close" data-close="authModal">&times;</button>',
      '    </div>',
      '    <div class="modal-body">',
      '      <div class="auth-tabs">',
      '        <button type="button" class="auth-tab active" data-tab="login">Login</button>',
      '        <button type="button" class="auth-tab" data-tab="signup">Sign Up</button>',
      '      </div>',
      '      <form id="authLoginForm" autocomplete="on" novalidate>',
      '        <div class="form-group">',
      '          <label class="form-label" for="authLiEmail">Email</label>',
      '          <input type="email" class="form-input" id="authLiEmail" autocomplete="email" required>',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label" for="authLiPwd">Password</label>',
      '          <input type="password" class="form-input" id="authLiPwd" autocomplete="current-password" required>',
      '        </div>',
      '        <button type="submit" class="btn btn-primary" style="margin-top:6px;">Login</button>',
      '      </form>',
      '      <form id="authSignupForm" autocomplete="on" novalidate style="display:none;">',
      '        <div class="form-group">',
      '          <label class="form-label" for="authSuName">Name</label>',
      '          <input type="text" class="form-input" id="authSuName" autocomplete="name" required>',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label" for="authSuEmail">Gmail address</label>',
      '          <input type="email" class="form-input" id="authSuEmail" autocomplete="email"',
      '                 pattern="[a-zA-Z0-9._%+\\-]+@gmail\\.com"',
      '                 placeholder="yourname@gmail.com"',
      '                 title="Only @gmail.com addresses are accepted" required>',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label" for="authSuPwd">Password (min 6)</label>',
      '          <input type="password" class="form-input" id="authSuPwd" autocomplete="new-password" minlength="6" required>',
      '        </div>',
      '        <div style="font-size:11px;color:var(--muted);margin:-4px 0 8px;">Only official Gmail (@gmail.com) addresses are allowed. We\'ll email you a 6-digit code to verify.</div>',
      '        <button type="submit" class="btn btn-primary" style="margin-top:6px;">Send OTP</button>',
      '      </form>',
      '      <form id="authOtpForm" autocomplete="off" novalidate style="display:none;">',
      '        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:12px;font-size:12px;line-height:1.6;color:var(--muted);">',
      '          We sent a 6-digit verification code to',
      '          <strong id="authOtpEmailDisplay" style="color:var(--text);display:block;margin:4px 0;word-break:break-all;">&mdash;</strong>',
      '          Check your inbox (and Spam folder) to complete signup.',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label" for="authOtpCode">Verification code</label>',
      '          <input type="text" inputmode="numeric" pattern="\\d{6}" maxlength="6"',
      '                 class="form-input" id="authOtpCode" autocomplete="one-time-code"',
      '                 placeholder="123456"',
      '                 style="letter-spacing:8px;font-family:\'DM Mono\',ui-monospace,Menlo,monospace;text-align:center;font-size:18px;font-weight:600;" required>',
      '        </div>',
      '        <div id="authOtpCountdown" style="font-size:11px;color:var(--muted);margin:-6px 0 8px;"></div>',
      '        <button type="submit" class="btn btn-primary" style="margin-top:6px;">Verify &amp; Create Account</button>',
      '        <div style="margin-top:8px;display:flex;gap:8px;">',
      '          <button type="button" class="btn btn-ghost" style="flex:1;" data-action="resend-otp">Resend Code</button>',
      '          <button type="button" class="btn btn-ghost" style="flex:1;" data-action="back-signup">&larr; Back</button>',
      '        </div>',
      '      </form>',
      '      <div class="form-error" id="authError"></div>',
      '      <div class="form-success" id="authSuccess" style="display:none;"></div>',
      '      <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);line-height:1.6;">',
      '        <strong style="color:var(--text);">&#x2139; Info:</strong>',
      '        Your account is kept secure. Passwords are stored hashed and all data is sent over HTTPS.',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="modal-overlay auth-modal" id="accountModal" role="dialog" aria-modal="true" aria-labelledby="accountModalTitle">',
      '  <div class="modal">',
      '    <div class="modal-header">',
      '      <div class="modal-title" id="accountModalTitle">My <em>Account</em></div>',
      '      <button type="button" class="modal-close" aria-label="Close" data-close="accountModal">&times;</button>',
      '    </div>',
      '    <div class="modal-body">',
      '      <div class="pay-summary">',
      '        <div class="pay-row"><span>Name</span><strong id="authAccName">&mdash;</strong></div>',
      '        <div class="pay-row"><span>Email</span><strong id="authAccEmail">&mdash;</strong></div>',
      '        <div class="pay-row"><span>Current Plan</span><strong id="authAccPlan" style="color:var(--accent);">Free</strong></div>',
      '        <div class="pay-row"><span>Expires</span><strong id="authAccExpiry">&mdash;</strong></div>',
      '      </div>',
      '      <a class="btn btn-primary" href="passport-photo.html">Open Passport Photo tool</a>',
      '      <button type="button" class="btn btn-ghost" style="margin-top:8px;" data-action="logout">Logout</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  function bindEvents() {
    // Tab switch
    document.querySelectorAll('#authModal .auth-tab').forEach(function (t) {
      t.addEventListener('click', function () { setAuthTab(t.dataset.tab); });
    });
    // Close buttons
    document.querySelectorAll('.auth-modal [data-close]').forEach(function (b) {
      b.addEventListener('click', function () { closeModal(b.dataset.close); });
    });
    // Click overlay to close (only direct overlay click)
    document.querySelectorAll('.auth-modal').forEach(function (ov) {
      ov.addEventListener('click', function (e) {
        if (e.target === ov) closeModal(ov.id);
      });
    });
    // Escape to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllModals();
    });
    // Forms
    var loginF = document.getElementById('authLoginForm');
    if (loginF) loginF.addEventListener('submit', doLogin);
    var signF = document.getElementById('authSignupForm');
    if (signF) signF.addEventListener('submit', doSignup);
    var otpF = document.getElementById('authOtpForm');
    if (otpF) otpF.addEventListener('submit', doVerifySignupOtp);
    // Resend / back
    var resendBtn = document.querySelector('[data-action="resend-otp"]');
    if (resendBtn) resendBtn.addEventListener('click', resendSignupOtp);
    var backBtn = document.querySelector('[data-action="back-signup"]');
    if (backBtn) backBtn.addEventListener('click', function () { setAuthTab('signup'); });
    // Logout in account modal
    var logoutBtn = document.querySelector('#accountModal [data-action="logout"]');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    // Login/account button in header
    var hdrBtn = document.getElementById('hdrAuthBtn');
    if (hdrBtn && !hdrBtn.dataset.bound) {
      hdrBtn.addEventListener('click', function () {
        if (currentUser()) openAccount(); else openAuth();
      });
      hdrBtn.dataset.bound = '1';
    }
  }

  // ── Auth UI ──
  function openAuth(tab) {
    if (typeof tab !== 'string') tab = 'login';
    injectModals();
    openModal('authModal');
    setAuthTab(tab);
    var err = document.getElementById('authError'); if (err) err.textContent = '';
    var ok = document.getElementById('authSuccess'); if (ok) ok.style.display = 'none';
  }

  function setAuthTab(tab) {
    document.querySelectorAll('#authModal .auth-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    var lf = document.getElementById('authLoginForm');
    var sf = document.getElementById('authSignupForm');
    var of = document.getElementById('authOtpForm');
    if (lf) lf.style.display = tab === 'login' ? 'block' : 'none';
    if (sf) sf.style.display = tab === 'signup' ? 'block' : 'none';
    if (of) of.style.display = tab === 'otp' ? 'block' : 'none';
    var tabs = document.querySelector('#authModal .auth-tabs');
    if (tabs) tabs.style.display = tab === 'otp' ? 'none' : '';
    var err = document.getElementById('authError'); if (err) err.textContent = '';
  }

  function setBusy(formId, busy, busyText, idleText) {
    var f = document.getElementById(formId); if (!f) return;
    var btn = f.querySelector('button[type=submit]'); if (!btn) return;
    btn.disabled = !!busy;
    if (busy && busyText) btn.textContent = busyText;
    if (!busy && idleText) btn.textContent = idleText;
  }

  var _pendingSignup = null;
  var _otpTimerId = null;

  function doLogin(e) {
    if (e) e.preventDefault();
    var email = (document.getElementById('authLiEmail').value || '').trim().toLowerCase();
    var pwd   = document.getElementById('authLiPwd').value;
    var err   = document.getElementById('authError'); err.textContent = '';
    if (!email || !pwd) { err.textContent = 'Please enter both email and password.'; return; }
    if (!isGmailAddress(email)) { err.textContent = 'Only @gmail.com addresses are supported.'; return; }
    setBusy('authLoginForm', true, 'Signing in…');
    api('/api/login', { method: 'POST', body: { email: email, password: pwd } })
      .then(function (res) {
        var token = res.token, user = res.user;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        var users = getUsers(); users[user.email] = user; saveUsers(users);
        setSession({ email: user.email, loggedAt: Date.now() });
        refreshAuthUI();
        closeModal('authModal');
        showToast('Welcome back, ' + (user.name || user.email) + '!');
      })
      .catch(function (ex) {
        err.textContent = (ex && ex.message) ? ex.message : 'Login failed. Please try again.';
      })
      .then(function () {
        setBusy('authLoginForm', false, null, 'Login');
      });
  }

  function doSignup(e) {
    if (e) e.preventDefault();
    var name  = (document.getElementById('authSuName').value || '').trim();
    var email = (document.getElementById('authSuEmail').value || '').trim().toLowerCase();
    var pwd   = document.getElementById('authSuPwd').value;
    var err   = document.getElementById('authError'); err.textContent = '';
    if (!name || !email || !pwd) { err.textContent = 'Please fill in all fields.'; return; }
    if (!isGmailAddress(email)) { err.textContent = 'Only @gmail.com addresses are supported.'; return; }
    if (pwd.length < 6) { err.textContent = 'Password must be at least 6 characters.'; return; }
    setBusy('authSignupForm', true, 'Sending OTP…');
    api('/api/send-signup-otp', { method: 'POST', body: { name: name, email: email, password: pwd } })
      .then(function (res) {
        _pendingSignup = { email: (res && res.email) || email, name: name, pwd: pwd };
        showOtpStep(_pendingSignup.email, (res && res.expiresInSec) || 600);
      })
      .catch(function (ex) {
        err.textContent = (ex && ex.message) ? ex.message : 'Could not send OTP. Please try again.';
      })
      .then(function () {
        setBusy('authSignupForm', false, null, 'Send OTP');
      });
  }

  function doVerifySignupOtp(e) {
    if (e) e.preventDefault();
    var err = document.getElementById('authError'); err.textContent = '';
    var code = (document.getElementById('authOtpCode').value || '').trim();
    if (!/^\d{6}$/.test(code)) { err.textContent = 'Enter the 6-digit code from your email.'; return; }
    if (!_pendingSignup) { err.textContent = 'Please start signup again.'; setAuthTab('signup'); return; }
    setBusy('authOtpForm', true, 'Verifying…');
    api('/api/verify-signup-otp', {
      method: 'POST',
      body: { email: _pendingSignup.email, otp: code },
    })
      .then(function (res) {
        var token = res.token, user = res.user;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        var users = getUsers(); users[user.email] = user; saveUsers(users);
        setSession({ email: user.email, loggedAt: Date.now() });
        refreshAuthUI();
        closeModal('authModal');
        showToast('Welcome, ' + (user.name || user.email) + '!');
        _pendingSignup = null;
        clearInterval(_otpTimerId);
      })
      .catch(function (ex) {
        err.textContent = (ex && ex.message) ? ex.message : 'Verification failed.';
      })
      .then(function () {
        setBusy('authOtpForm', false, null, 'Verify & Create Account');
      });
  }

  function resendSignupOtp() {
    var err = document.getElementById('authError'); err.textContent = '';
    if (!_pendingSignup) { setAuthTab('signup'); return; }
    api('/api/send-signup-otp', { method: 'POST', body: _pendingSignup })
      .then(function (res) {
        startOtpCountdown((res && res.expiresInSec) || 600);
        showToast('Code resent — check your inbox.');
      })
      .catch(function (ex) {
        err.textContent = (ex && ex.message) ? ex.message : 'Could not resend code.';
      });
  }

  function showOtpStep(email, seconds) {
    setAuthTab('otp');
    var disp = document.getElementById('authOtpEmailDisplay');
    if (disp) disp.textContent = email;
    var codeInput = document.getElementById('authOtpCode');
    if (codeInput) { codeInput.value = ''; setTimeout(function () { codeInput.focus(); }, 80); }
    startOtpCountdown(seconds);
  }

  function startOtpCountdown(seconds) {
    clearInterval(_otpTimerId);
    var remaining = Math.max(0, seconds | 0);
    var el = document.getElementById('authOtpCountdown');
    function tick() {
      if (!el) return;
      if (remaining <= 0) {
        el.textContent = 'Code expired — click Resend to get a new one.';
        clearInterval(_otpTimerId);
        return;
      }
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      el.textContent = 'Code expires in ' + m + ':' + (s < 10 ? '0' + s : s);
      remaining--;
    }
    tick();
    _otpTimerId = setInterval(tick, 1000);
  }

  function openAccount() {
    injectModals();
    var user = currentUser();
    if (!user) { openAuth(); return; }
    document.getElementById('authAccName').textContent  = user.name || user.email;
    document.getElementById('authAccEmail').textContent = user.email;
    var plan = (user.plan && user.plan !== 'free' && user.planExpiresAt && Date.now() < user.planExpiresAt)
      ? user.plan : 'free';
    var planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
    document.getElementById('authAccPlan').textContent = planLabel;
    document.getElementById('authAccExpiry').textContent =
      plan !== 'free' && user.planExpiresAt
        ? new Date(user.planExpiresAt).toLocaleDateString()
        : '—';
    openModal('accountModal');
  }

  function logout() {
    setSession(null);
    try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch (e) {}
    refreshAuthUI();
    closeAllModals();
    showToast('Signed out.');
  }

  function refreshAuthUI() {
    var btn = document.getElementById('hdrAuthBtn');
    if (!btn) return;
    var user = currentUser();
    if (user) {
      var name = user.name || (user.email ? user.email.split('@')[0] : '');
      btn.innerHTML = '👤 <span>' + escapeHtml(name) + '</span>';
    } else {
      btn.innerHTML = '👤 <span>Login</span>';
    }
  }

  // ── Restore session on load (backend token check) ──
  function restoreSession() {
    var token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;
    api('/api/me').then(function (res) {
      if (!res || !res.user) return;
      var users = getUsers(); users[res.user.email] = res.user; saveUsers(users);
      setSession({ email: res.user.email, loggedAt: Date.now() });
      refreshAuthUI();
    }).catch(function (e) {
      if (e && e.status === 401) {
        try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch (_) {}
        setSession(null);
        refreshAuthUI();
      }
    });
  }

  // ── Init ──
  function init() {
    injectModals();
    bindEvents();
    refreshAuthUI();
    restoreSession();
    // If the URL contains #login, open the modal automatically (matches
    // the behaviour previously provided by passport-photo.html).
    if (window.location.hash === '#login') {
      try { openAuth('login'); } catch (e) {}
    }
  }

  // Expose globals
  window.openAuth             = openAuth;
  window.closeModal           = closeModal;
  window.closeAllModals       = closeAllModals;
  window.setAuthTab           = setAuthTab;
  window.doLogin              = doLogin;
  window.doSignup             = doSignup;
  window.doVerifySignupOtp    = doVerifySignupOtp;
  window.resendSignupOtp      = resendSignupOtp;
  window.openAccount          = openAccount;
  window.logout               = logout;
  window.refreshAuthUI        = refreshAuthUI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
