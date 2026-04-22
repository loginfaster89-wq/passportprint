/* Shared auth module for Studio Print — login / signup / OTP modal.
   Can be included on any page that has .legal-header with a
   #hdrAuthBtn button. Uses the same backend + localStorage keys as
   passport-photo.html, so a session started on the homepage is carried
   over to the passport-photo tool (and vice versa).

   Include BEFORE use:
     <link rel="stylesheet" href="assets/auth.css">
     <script src="assets/auth.js" defer></script>

   Wire the header button:
     <button class="nav-login" id="hdrAuthBtn" onclick="openAuth()">Login</button>
*/
(function () {
  'use strict';

  var BACKEND_URL = 'https://passportprint-studio.onrender.com';
  var AUTH_TOKEN_KEY = 'pps_token_v1';
  var AUTH_STORE_KEY = 'pps_users_v1';
  var AUTH_SESSION_KEY = 'pps_session_v1';

  // Google Sign-In (One Tap + button). Mirrors the wiring in
  // passport-photo.html so the same OAuth Web Client ID and backend
  // endpoint (/api/google-login) work for the shared modal too.
  // Override at runtime with window.GOOGLE_OAUTH_CLIENT_ID if needed.
  var GOOGLE_CLIENT_ID = (typeof window !== 'undefined' && window.GOOGLE_OAUTH_CLIENT_ID)
    || '216240284102-d63glsohcp2lr85kk1el364f7gecnv9q.apps.googleusercontent.com';
  var GOOGLE_ENABLED = !!GOOGLE_CLIENT_ID
    && /\.apps\.googleusercontent\.com$/.test(GOOGLE_CLIENT_ID)
    && !/^(YOUR_|__REPLACE_)/.test(GOOGLE_CLIENT_ID);

  // ── localStorage helpers ──
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_STORE_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveUsers(u) {
    try { localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(u)); } catch (e) {}
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function setSession(s) {
    try {
      if (s) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {}
  }
  function currentUser() {
    var s = getSession();
    if (!s) return null;
    var users = getUsers();
    return users[s.email] || null;
  }

  // ── API ──
  async function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    var token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    var res = await fetch(BACKEND_URL + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
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

  // ── Gmail validation (matches backend) ──
  function isGmailAddress(s) {
    return typeof s === 'string' &&
      /^[a-z0-9][a-z0-9._+\-]{0,62}[a-z0-9]@gmail\.com$/.test(s.trim().toLowerCase());
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ── Modal markup (injected once) ──
  var MODAL_ID = 'spAuthModal';
  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = [
      '<div class="sp-auth-overlay" id="' + MODAL_ID + '" role="dialog" aria-modal="true" aria-labelledby="spAuthTitle">',
      '  <div class="sp-auth-modal">',
      '    <div class="sp-auth-header">',
      '      <div class="sp-auth-title" id="spAuthTitle">Studio <em>Print</em></div>',
      '      <button type="button" class="sp-auth-close" aria-label="Close">✕</button>',
      '    </div>',
      '    <div class="sp-auth-body">',
      '      <div class="sp-google-wrap" id="spGoogleWrap">',
      '        <div class="sp-google-btn" id="spGoogleBtn"></div>',
      '        <div class="sp-auth-divider"><span>or</span></div>',
      '      </div>',
      '      <div class="sp-auth-tabs" role="tablist">',
      '        <button type="button" class="sp-auth-tab active" data-tab="login" role="tab">Login</button>',
      '        <button type="button" class="sp-auth-tab" data-tab="signup" role="tab">Sign Up</button>',
      '      </div>',
      '      <form id="spLoginForm" class="sp-auth-form" novalidate>',
      '        <div class="sp-field"><label>Email</label>',
      '          <input type="email" id="spLiEmail" autocomplete="email" required></div>',
      '        <div class="sp-field"><label>Password</label>',
      '          <input type="password" id="spLiPwd" autocomplete="current-password" required></div>',
      '        <button type="submit" class="sp-btn sp-btn-primary">Login</button>',
      '      </form>',
      '      <form id="spSignupForm" class="sp-auth-form" style="display:none;" novalidate>',
      '        <div class="sp-field"><label>Name</label>',
      '          <input type="text" id="spSuName" autocomplete="name" required></div>',
      '        <div class="sp-field"><label>Gmail address</label>',
      '          <input type="email" id="spSuEmail" autocomplete="email"',
      '            pattern="[a-zA-Z0-9._%+\\-]+@gmail\\.com"',
      '            placeholder="yourname@gmail.com"',
      '            title="Only @gmail.com addresses are accepted" required></div>',
      '        <div class="sp-field"><label>Password (min 6)</label>',
      '          <input type="password" id="spSuPwd" autocomplete="new-password" minlength="6" required></div>',
      '        <div class="sp-hint">Only official Gmail (@gmail.com) addresses are allowed. We\'ll email you a 6-digit code to verify.</div>',
      '        <button type="submit" class="sp-btn sp-btn-primary">Send OTP</button>',
      '      </form>',
      '      <form id="spOtpForm" class="sp-auth-form" style="display:none;" novalidate>',
      '        <div class="sp-otp-intro">We sent a 6-digit code to <strong id="spOtpEmail">—</strong>. Check your inbox (and Spam).</div>',
      '        <div class="sp-field"><label>Verification code</label>',
      '          <input type="text" inputmode="numeric" pattern="\\d{6}" maxlength="6"',
      '            id="spOtpCode" autocomplete="one-time-code" placeholder="123456" required></div>',
      '        <div class="sp-otp-timer" id="spOtpTimer"></div>',
      '        <button type="submit" class="sp-btn sp-btn-primary">Verify &amp; Create Account</button>',
      '        <div class="sp-otp-row">',
      '          <button type="button" class="sp-btn sp-btn-ghost" id="spOtpResend">Resend Code</button>',
      '          <button type="button" class="sp-btn sp-btn-ghost" id="spOtpBack">Back</button>',
      '        </div>',
      '      </form>',
      '      <div class="sp-auth-error" id="spAuthError" role="alert"></div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(wrap.firstElementChild);

    // Wire events once.
    var overlay = document.getElementById(MODAL_ID);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeAuth();
    });
    overlay.querySelector('.sp-auth-close').addEventListener('click', closeAuth);
    overlay.querySelectorAll('.sp-auth-tab').forEach(function (t) {
      t.addEventListener('click', function () { setAuthTab(t.dataset.tab); });
    });
    document.getElementById('spLoginForm').addEventListener('submit', doLogin);
    document.getElementById('spSignupForm').addEventListener('submit', doSignup);
    document.getElementById('spOtpForm').addEventListener('submit', doVerifyOtp);
    document.getElementById('spOtpResend').addEventListener('click', resendOtp);
    document.getElementById('spOtpBack').addEventListener('click', function () { setAuthTab('signup'); });

    // Hide Google section entirely if not configured so the modal
    // collapses gracefully (no empty space, no broken widget).
    if (!GOOGLE_ENABLED) {
      var gw = document.getElementById('spGoogleWrap');
      if (gw) gw.style.display = 'none';
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeAuth();
    });
  }

  function setAuthTab(tab) {
    var overlay = document.getElementById(MODAL_ID);
    if (!overlay) return;
    overlay.querySelectorAll('.sp-auth-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.getElementById('spLoginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('spSignupForm').style.display = tab === 'signup' ? 'block' : 'none';
    document.getElementById('spOtpForm').style.display = tab === 'otp' ? 'block' : 'none';
    overlay.querySelector('.sp-auth-tabs').style.display = tab === 'otp' ? 'none' : '';
    // Google Sign-In is a shortcut for login + signup; hide it on the
    // OTP step (user has already started the email flow at that point).
    var gw = document.getElementById('spGoogleWrap');
    if (gw && GOOGLE_ENABLED) gw.style.display = tab === 'otp' ? 'none' : '';
    setError('');
  }

  function setError(msg) {
    var el = document.getElementById('spAuthError');
    if (el) el.textContent = msg || '';
  }

  function openAuth(tab) {
    ensureModal();
    if (typeof tab !== 'string') tab = 'login';
    setAuthTab(tab);
    setError('');
    var overlay = document.getElementById(MODAL_ID);
    overlay.classList.add('active');
    // Render the Google button lazily after the modal is visible (GIS
    // measures the host element, so it must be in the DOM + laid out).
    if (GOOGLE_ENABLED && tab !== 'otp') {
      setTimeout(renderGoogleButton, 0);
    }
    setTimeout(function () {
      var focusId = tab === 'signup' ? 'spSuName' : tab === 'otp' ? 'spOtpCode' : 'spLiEmail';
      var el = document.getElementById(focusId); if (el) el.focus();
    }, 50);
  }

  function closeAuth() {
    var overlay = document.getElementById(MODAL_ID);
    if (overlay) overlay.classList.remove('active');
    clearOtpTimer();
  }

  // ── Login ──
  async function doLogin(e) {
    if (e) e.preventDefault();
    var email = document.getElementById('spLiEmail').value.trim().toLowerCase();
    var pwd = document.getElementById('spLiPwd').value;
    setError('');
    if (!email || !pwd) { setError('Please enter email and password.'); return; }
    if (!isGmailAddress(email)) { setError('Only @gmail.com addresses are accepted.'); return; }
    var btn = e && e.target ? e.target.querySelector('button[type=submit]') : null;
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
    try {
      var res = await api('/api/login', { method: 'POST', body: { email: email, password: pwd } });
      var users = getUsers(); users[res.user.email] = res.user; saveUsers(users);
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      setSession({ email: res.user.email, loggedAt: Date.now() });
      refreshAuthUI();
      closeAuth();
    } catch (ex) {
      setError((ex && ex.message) || 'Login failed.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
    }
  }

  // ── Signup → send OTP ──
  var _pending = null;
  var _otpTimerId = null;

  async function doSignup(e) {
    if (e) e.preventDefault();
    var name = document.getElementById('spSuName').value.trim();
    var email = document.getElementById('spSuEmail').value.trim().toLowerCase();
    var pwd = document.getElementById('spSuPwd').value;
    setError('');
    if (!name || !email || !pwd) { setError('All fields are required.'); return; }
    if (!isGmailAddress(email)) { setError('Only @gmail.com addresses are accepted.'); return; }
    if (pwd.length < 6) { setError('Password must be at least 6 characters.'); return; }
    var btn = e && e.target ? e.target.querySelector('button[type=submit]') : null;
    if (btn) { btn.disabled = true; btn.textContent = 'Sending OTP…'; }
    try {
      var res = await api('/api/send-signup-otp', {
        method: 'POST', body: { name: name, email: email, password: pwd }
      });
      _pending = { email: (res && res.email) || email, name: name, pwd: pwd };
      showOtpStep(_pending.email, (res && res.expiresInSec) || 600);
    } catch (ex) {
      setError((ex && ex.message) || 'Could not send OTP.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send OTP'; }
    }
  }

  function showOtpStep(email, seconds) {
    setAuthTab('otp');
    document.getElementById('spOtpEmail').textContent = email;
    var code = document.getElementById('spOtpCode');
    if (code) { code.value = ''; setTimeout(function () { code.focus(); }, 60); }
    startOtpCountdown(seconds);
  }

  function clearOtpTimer() {
    if (_otpTimerId) { clearInterval(_otpTimerId); _otpTimerId = null; }
  }

  function startOtpCountdown(seconds) {
    clearOtpTimer();
    var remaining = Math.max(0, seconds | 0);
    var el = document.getElementById('spOtpTimer');
    function tick() {
      if (!el) return;
      if (remaining <= 0) { el.textContent = 'Code expired. Please resend.'; clearOtpTimer(); return; }
      var m = Math.floor(remaining / 60), s = remaining % 60;
      el.textContent = 'Expires in ' + m + ':' + String(s).padStart(2, '0');
      remaining--;
    }
    tick();
    _otpTimerId = setInterval(tick, 1000);
  }

  async function doVerifyOtp(e) {
    if (e) e.preventDefault();
    setError('');
    var code = (document.getElementById('spOtpCode').value || '').trim();
    if (!/^\d{6}$/.test(code)) { setError('Enter the 6-digit code.'); return; }
    if (!_pending) { setError('Please start signup again.'); setAuthTab('signup'); return; }
    var btn = e && e.target ? e.target.querySelector('button[type=submit]') : null;
    if (btn) { btn.disabled = true; btn.textContent = 'Verifying…'; }
    try {
      var res = await api('/api/verify-signup-otp', {
        method: 'POST', body: { email: _pending.email, otp: code }
      });
      var users = getUsers(); users[res.user.email] = res.user; saveUsers(users);
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      setSession({ email: res.user.email, loggedAt: Date.now() });
      refreshAuthUI();
      closeAuth();
      _pending = null;
      clearOtpTimer();
    } catch (ex) {
      setError((ex && ex.message) || 'Verification failed.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Verify & Create Account'; }
    }
  }

  async function resendOtp() {
    setError('');
    if (!_pending) { setAuthTab('signup'); return; }
    try {
      var res = await api('/api/send-signup-otp', {
        method: 'POST',
        body: { name: _pending.name, email: _pending.email, password: _pending.pwd }
      });
      startOtpCountdown((res && res.expiresInSec) || 600);
    } catch (ex) {
      setError((ex && ex.message) || 'Could not resend OTP.');
    }
  }

  // ── Google Sign-In (One Tap + button) ──
  // Uses Google Identity Services (the <script src="https://accounts.google.com/gsi/client">
  // must be loaded in the page <head>). Mirrors the flow used in
  // passport-photo.html so the backend endpoint /api/google-login handles
  // both paths identically.
  var _googleInitDone = false;
  var _googleBtnRendered = false;
  function initGoogleSignIn() {
    if (_googleInitDone) return true;
    if (!GOOGLE_ENABLED) return false;
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) return false;
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: false,
        ux_mode: 'popup',
        context: 'signin',
        itp_support: true,
      });
      _googleInitDone = true;
      return true;
    } catch (e) {
      console.warn('Google Sign-In init failed:', e);
      return false;
    }
  }
  function renderGoogleButton() {
    // GIS may not be ready yet (async script) — retry a few times.
    if (!GOOGLE_ENABLED) return;
    if (_googleBtnRendered) return;
    if (!initGoogleSignIn()) {
      if (!renderGoogleButton._tries) renderGoogleButton._tries = 0;
      if (renderGoogleButton._tries++ < 20) {
        setTimeout(renderGoogleButton, 150);
      }
      return;
    }
    var host = document.getElementById('spGoogleBtn');
    if (!host) return;
    try {
      google.accounts.id.renderButton(host, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320,
      });
      _googleBtnRendered = true;
    } catch (e) {
      console.warn('Google button render failed:', e);
    }
  }
  async function handleGoogleCredential(resp) {
    setError('');
    if (!resp || !resp.credential) {
      setError('No credential returned from Google.');
      return;
    }
    try {
      var res = await api('/api/google-login', {
        method: 'POST',
        body: { credential: resp.credential },
      });
      var users = getUsers(); users[res.user.email] = res.user; saveUsers(users);
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      setSession({ email: res.user.email, loggedAt: Date.now() });
      refreshAuthUI();
      closeAuth();
    } catch (ex) {
      setError((ex && ex.message) || 'Google sign-in failed.');
    }
  }

  // ── Header button state ──
  function refreshAuthUI() {
    var btn = document.getElementById('hdrAuthBtn');
    if (!btn) return;
    var user = currentUser();
    if (user) {
      var name = user.name || (user.email ? user.email.split('@')[0] : 'Account');
      btn.innerHTML = '<span class="hdr-lbl">' + escapeHtml(name) + '</span>';
      btn.onclick = function () {
        if (confirm('Log out of Studio Print?')) logout();
      };
      btn.title = 'Logged in as ' + user.email + ' — click to log out';
    } else {
      btn.innerHTML = '<span class="hdr-lbl">Login</span>';
      btn.onclick = function () { openAuth('login'); };
      btn.title = 'Login / Signup';
    }
  }

  function logout() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {}
    setSession(null);
    refreshAuthUI();
  }

  // ── Public API ──
  window.openAuth = openAuth;
  window.closeAuth = closeAuth;
  window.setAuthTab = setAuthTab;
  window.logout = logout;
  window.currentUser = currentUser;
  window.refreshAuthUI = refreshAuthUI;

  function init() {
    ensureModal();
    refreshAuthUI();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
