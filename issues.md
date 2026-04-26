# Studio Print — Full-site audit (2026-04-23)

Audit of https://studioprint.pages.dev/ from an end-user perspective across
three viewports, informed by the test plan
`test-plan-website-audit.md` (prior session) and extended with **2026
design/polish** observations so the next coding session has a single
source of truth for what needs fixing.

**No code was changed in this PR** — only notes. Fixes happen in
follow-up PRs per the project's one-PR-per-logical-task rule.

**Audit method**
- Headless Chromium via Playwright at three viewports:
  - Desktop  `1440 × 900`  (DSF 1)
  - iPad Air `820 × 1180` (DSF 2, touch, iPad UA)
  - iPhone 13 `390 × 844` (DSF 3, touch, iPhone UA)
- Per page: full-page screenshot, console log, network log, DOM probes
  (horizontal-scroll, grid slider state, header geometry, broken
  images, anchor count).
- 8 pages covered: `/`, `/passport-photo.html`, `/about.html`,
  `/contact.html`, `/privacy.html`, `/terms.html`, `/refund.html`,
  `/shipping.html`.
- Raw evidence (screenshots, per-page JSON logs, aggregate `audit.json`)
  lives under `/home/ubuntu/audit-evidence/` on the Devin VM and is
  not committed.

**Environment checks that passed cleanly (so next session can skip)**
- All 8 pages returned HTTP 200 at all viewports.
- No horizontal scroll anywhere (`document.scrollWidth ≤ window.innerWidth`).
- No broken `<img>` (no `naturalWidth===0` after load).
- Footer legal links resolve to local pages (no 404 observed).
- Pricing numbers consistent on `index.html`, `terms.html`, `refund.html`,
  `shipping.html` — free: 2 sheets/day, weekly ₹59/7 days, monthly ₹149/30 days.
- PR #66 header fix holds: Login + ☰ pin right together on `≤900px`
  on all non-passport-photo pages (confirmed on contact/about/privacy
  at 820px and 390px).
- Slider activation (PR #64 / #65): `why-grid` and `steps-grid` become
  sliders with 4 dots at 820px and at 390px — no orphan rows, no
  console errors from `sliders.js`.

---

## A. Functional / bug findings

Severity: **blocker** (breaks a core flow), **medium** (degrades UX
but workable), **nit** (polish).

| # | Page | Viewport | Severity | Finding |
|---|------|----------|----------|---------|
| F1 | `passport-photo.html` | desktop 1440, iphone 390 | **blocker** | Razorpay Checkout SDK fetches `https://checkout-static-next.razorpay.com/build/undefined` → HTTP 403 + `net::ERR_ABORTED`. The literal string `undefined` in the URL means a JS variable is undefined when the SDK builds its asset path. Payments / upgrade flow likely partially broken on these viewports. **Does not repro on iPad-820** (different SDK code path). Needs: verify `razorpay_checkout_v1` script version pin + confirm whatever global the SDK reads (e.g. `window.Razorpay`, build hash) is set before the SDK boots. |
| F2 | `passport-photo.html` | iphone 390, ipad 820 | **medium** | Google One-Tap ("Sign in with Google" bubble) auto-prompts on page load and covers the Login button + part of the sidebar on iPad and most of the upload card on iPhone. This is Google Identity Services (`accounts.google.com/gsi/client`) with `auto_select` or default prompt behaviour enabled. Desktop did not auto-prompt in this audit (likely cookie heuristic). Fix: pass `cancel_on_tap_outside:true`, restrict prompt to the explicit "Continue with Google" button only, or call `google.accounts.id.disableAutoSelect()` on first load. |
| ~~F3~~ | home `/` | ipad 820 | **resolved PR #73** | `.features-grid` does not become a slider at exactly 820px. It renders as a **2-column CSS grid with 5 cards**, so the "LIVE" `.feature-card.primary` (Passport Photo) sits next to a SOON card with an **uneven height** — primary has `min-height:230px` while SOON cards have "In the works" label. Visually looks like a dead / empty card. `sliders.js` `hasOrphanRow()` may be returning false because the CSS primary-span only activates at `min-width:820px`. Either tighten the breakpoint or let primary span in the 2-col layout too. |
| ~~F4~~ | home `/` | ipad 820, iphone 390 | **resolved PR #74** | Hero headline wrap: at 820px the phrase `Every print job.` ends line 1 with `One` attached (orange) → "Every print job. One / browser tab." — the accent phrase `One browser tab.` gets split. At 390px it breaks as "Every print / job. One / browser tab.", dividing the white phrase too. Desktop is correct ("Every print job." / "One browser tab."). Suggested fix: `text-wrap:balance` on `.hero h1`, or an explicit `<br class="hero-break">` between the two sentences hidden on desktop. |
| ~~F5~~ | home `/` | ipad 820 | **resolved PR #78** | Pricing card "Shop counter" title wraps to two lines while "Try it out" and "Quick job" fit on one, creating a visual height imbalance between the three cards. "for 30 days" also wraps to two lines. Tight font-size clamp or `white-space:nowrap` with a smaller title at `820px` would even them out. |
| ~~F6~~ | home `/` | all | **resolved PR #127** | `.audience-grid` centred with `max-width:720px` + auto margins so the 2 cards no longer stretch across the full container on desktop. |
| F7 | `passport-photo.html` | all | nit | Console noise: four `Unrecognized feature: 'publickey-credentials-create' / 'web-share' / 'local-network-access' / 'loopback-network'.` warnings on every load. These come from the `<iframe>` Google GSI injects; Chrome doesn't recognise some Permissions-Policy tokens the GSI iframe requests. Not our code, but clutters the console. Harmless — keep an eye on it if the GSI SDK is ever updated. |
| ~~F8~~ | `about.html`, `contact.html` | all | **resolved PR #77** | Email `loginfaster89@gmail.com` was exposed as plain text (clickable `mailto:` + visible text) on both pages. Scrapable by spam bots within days. Fixed via `<a class="email-obf" data-u="…" data-d="…">` + tiny per-page IIFE that assembles the mailto on DOMContentLoaded. A contact form (P10) is still the full fix. |
| ~~F9~~ | home `/` | desktop 1440 | **resolved PR #80.** Ribbon re-centered on the card's top edge. |
| ~~F10~~ | home `/` | desktop 1440 | **resolved PR #81.** Fake window-chrome dots replaced with a single live-preview indicator. |
| ~~F11~~ | `passport-photo.html` | desktop 1440 | **resolved PR #129** | At 1440×900, almost the entire lower half of the viewport (below the upload card, above the footer) was empty black space. Fixed: upload card shifted upward via `padding-bottom:14vh` at ≥1200 px + trust-spec strip ("300 DPI output · On-device AI · No photo uploads · 6+ country sizes") anchored at bottom of step 1 canvas. Desktop only, auto-hides on step 2+. |
| ~~F12~~ | home `/` | all | **resolved PR #85.** Emoji replaced with inline Lucide-style SVG sprite (`<use href="#i-…">`). No new fonts/deps. |

## B. "2026 multinational" polish gaps

These are NOT bugs — they're positioning/presentation gaps if the goal
is to make Studio Print feel like a polished 2026 multinational product
rather than a well-built indie tool. Each is a candidate logical task
for a follow-up PR.

| # | Area | Finding / suggestion |
|---|------|---------------------|
| ~~P1~~ | Hero | **resolved PR #102.** `accent-glow-pulse` keyframes on `.hero::before` — 7 s ease loop, opacity 0.55→1 and scale 1→1.06. CSS-only (~19 lines), reuses the existing unused `.hero::after` pattern. Fonts/tokens untouched; respects `prefers-reduced-motion`. |
| ~~P2~~ | Hero | **resolved PR #100.** Two decorative A4 passport-photo sheets (left -11°, right +9°) in hero with dashed cut marks + five 5×1 silhouette placeholders (matches post-PR-#58 sheet default). Pure CSS, no raster/SVG asset. Respects `prefers-reduced-motion` + hides on narrow screens. |
| ~~P3~~ | Cards (features/why/steps/audience/pricing) | **resolved PR #76.** `.why/.step/.audience/.pricing-card` pe `transition` + `:hover{translateY(-4px); amber-tinted shadow}`. Uses existing tokens. |
| P4 | Icons | Replace emoji with a consistent SVG icon pack (see F12). Lucide icons are MIT-licensed, small, and render consistently. |
| ~~P5~~ | Motion | **resolved PR #91.** New `assets/reveal.js` + `.reveal/.in-view` CSS on homepage: 6 sections + CTA band fade + slide up (14 px → 0, 450 ms) once on first enter. One-shot observer, respects `prefers-reduced-motion`. |
| ~~P6~~ | FAQ | **resolved PR #82.** `details[open] summary::after{content:"−"}` + soft `faq-fade` keyframe on `.faq-body` for smooth open. |
| ~~P7~~ | Hero CTAs | **resolved PR #76** (tactile half). `.btn:active{transform:scale(.97);}` aur `.pricing-card .pcta:active` bhi. Optional spinner on primary CTA during nav still open — separate item if we want that. |
| ~~P8~~ | Social proof | **resolved PR #103.** Honest `By the numbers` strip on the homepage between TOOLS-PREVIEW and WHY — 4 stat cards using only product facts already documented elsewhere (0 photos uploaded, 2 free sheets/day, ₹149/30 days, 300 DPI A4). No fabricated testimonials or logos. Pure CSS using existing tokens, `.reveal` fade-in like other sections. |
| ~~P9~~ | About page | **resolved PR #96.** Mission-hero (`Make every ₹10 print job feel like a browser tab.`) + founder-style pull-quote + 2024→2026 timeline (Idea / Prototype / Launch / Now) + 'What ships next' card (4 upcoming tools). Inline styles only, existing tokens. |
| ~~P10~~ | Contact page | **resolved PR #98.** Inline `Send us a message` form on `contact.html` (name / email / 7-option category / message), `Replies within 1–2 working days` SLA badge, submit builds a prefilled `mailto:` with structured body. Obfuscated email block kept as fallback. |
| ~~P12~~ | Pricing | **resolved PR #119.** Comparison matrix (Free vs Weekly vs Monthly) — 8-row feature table below pricing cards on homepage. Responsive, existing tokens only. |
| ~~P13~~ | Pricing | **resolved PR #89.** `ribbon-pulse` + `featured-glow` keyframes on `.pricing-card.featured::before` and `.pricing-card.featured` (3.2s infinite, 0.45 → 0.75 alpha). Disabled under `prefers-reduced-motion`. |
| ~~P14~~ | Navigation | **resolved PR #83.** `.sp-mobile-cta` pill on `≤640px`, shows after scroll > 1 viewport. |
| ~~P15~~ | Footer | **resolved PR #95.** Multi-column footer — Product / Resources / Company / Legal + newsletter signup + social icon + locale switcher. Shared across all 8 pages via `legal.css` + `assets/footer.js`. |
| ~~P16~~ | Internationalisation | **resolved PR #125.** Interactive `EN` / `हि` pill toggle in footer on all 8 shared pages. Syncs with `passport-photo.html`'s `localStorage('pps_lang')`. New `assets/lang.js` (19 lines) + `.locale-btn` styles in `legal.css`. Existing tokens only. |
| ~~P17~~ | Accessibility | **resolved PR #76.** Site-wide `:focus-visible{outline:2px solid var(--accent); outline-offset:2px}` added to `assets/legal.css`, with `:focus{outline:none}` fallback so mouse clicks don't show rings. Keyboard users now get a clean amber ring on nav links, Features dropdown, Login button, `<details>`, form elements. |
| ~~P18~~ | Accessibility | **resolved PR #88.** Stable ids on all 8 FAQs (`faq-free-tier`, `faq-privacy`, `faq-countries`, `faq-no-software`, `faq-aadhaar-pan`, `faq-mobile`, `faq-refund`, `faq-print-shop`) + small IIFE opens the targeted `<details>` on hash match and smooth-scrolls. |
| ~~P19~~ | Product-demo | **resolved PR #99.** Inline animated demo strip inside the hero tools-preview card on `index.html`: 3-phase ~9 s loop (upload → background removed → A4 sheet slides in). Pure CSS + tiny DOM primitives, no `<video>` asset. Respects `prefers-reduced-motion`. |
| ~~P20~~ | Loading / perceived perf | **resolved PR #128.** Fixed-position 3 px accent bar at top of page during AI-model download (0→97%), auto-hides on completion. Hooks into existing `onProgress` callback. Cancel also resets bar. |
| ~~P21~~ | Error / empty states | **resolved PR #130.** Inline error banner near upload zone — replaces `alert()` with danger-themed banner (Retry + dismiss). Auto-clears on new file selection. |
| ~~P22~~ | SEO / social | **resolved PR #84.** Proper 1200×630 `assets/og-image.png` + richer social meta across 8 pages. |
| ~~P23~~ | SEO | **resolved PR #90.** `<lastmod>2026-04-23</lastmod>` on every entry + 4 in-page landing sections (`/#features`, `/#how`, `/#pricing`, `/#faq`) with their own priorities. |
| ~~P24~~ | Performance | **resolved PR #124.** Syne + DM Mono self-hosted as woff2 (latin + latin-ext subsets) in `assets/fonts/`. New `assets/fonts.css` replaces Google Fonts CDN link on all 10 pages. |
| ~~P25~~ | Performance | **resolved PR #87.** Backend preconnect added to all 7 shared-header pages (about/contact/privacy/terms/refund/shipping/404). |
| ~~P26~~ | Cookies / privacy | **resolved PR #120.** Self-hosted essentials-only cookie banner on all 9 pages. "OK" click saves to localStorage, doesn't show again. |
| ~~P27~~ | Tooling | **resolved PR #86.** Branded `404.html` with shared legal-header/footer, big amber "404" numeral, two CTAs, `noindex` meta, build.js now minifies it into `dist/`. |
| ~~P28~~ | Tooling | **resolved PRs #93 + #94.** `assets/manifest.webmanifest` + installable icons on index + 7 legal pages (PR #93); `sw.js` with network-first HTML + stale-while-revalidate assets + `/offline.html` fallback (PR #94). Registered via `assets/pwa.js`. |
| ~~P29~~ | Passport-photo step bar | **resolved PR #126.** 2 px accent progress bar at bottom of `.steps` fills 0→33→66→100% as user advances (300 ms ease). Active `.step-num` gets enhanced amber glow + pulse. Minimum diff in `passport-photo.html` only. |
| ~~P30~~ | Homepage density | **resolved PR #123.** 3-step horizontal workflow timeline (`.density-break`) between hero and features — breaks the repeating card-grid rhythm. Surface2 bg, numbered circles, connecting lines. Responsive, existing tokens only. |
| ~~P31~~ | Performance | **resolved PR #132.** `<link rel="preload">` for `syne-latin.woff2` (34 KB) + `dm-mono-400-latin.woff2` (15 KB) on all 10 pages. Eliminates render-blocking font-discovery waterfall, improves FCP/LCP. |
| ~~S1~~ | SEO | **resolved PR #134.** FAQPage JSON-LD structured data (`<script type="application/ld+json">`) in `index.html` `<head>`. All 8 FAQ Q&A pairs marked up for Google rich-result snippets. Zero design change. |
| ~~S2~~ | SEO | **resolved PR #137.** WebApplication JSON-LD in `passport-photo.html` `<head>`. Marks the page as a `PhotographyApplication` web app with 3 pricing tiers (Free/Weekly/Monthly), 5-item feature list, and creator info. Enables app-like rich results in Google Search. Zero design change. |
| ~~S3~~ | SEO | **resolved this PR.** BreadcrumbList JSON-LD on all 6 legal pages (about, contact, privacy, terms, refund, shipping). Each page gets a 2-level breadcrumb (Home → page name) for Google breadcrumb rich results. Zero design change. |
| ~~S4~~ | SEO | **resolved this PR.** Organization JSON-LD on `about.html`. Marks Studio Print as an Organization with name, URL, logo, description and founding date. Enables knowledge-panel / brand rich results. Zero design change. |
| ~~S5~~ | SEO | **resolved this PR.** `<meta name="robots" content="max-image-preview:large">` on all 8 indexable pages (index, passport-photo, about, contact, privacy, terms, refund, shipping). Tells Google it can show large image previews in search results. Skipped on 404 + offline (both `noindex`). Zero design change. |

## C. Suggested PR sequence

All of the quick-win queue from the 2026-04-23 audit is now merged. The**open backlog** for future sessions (larger scope, pick per session):

**Functional nits remaining:**
- ~~`F6` audience grid sparse~~ — **resolved PR #127.** Centred with `max-width:720px`.
- `F7` GSI iframe Permissions-Policy console warnings — not our code; monitor on SDK updates.
- ~~`P20` AI-model progress bar~~ — **resolved PR #128.**
- ~~`F11` passport-photo 1440 empty space below upload card~~ — **resolved PR #129.**

**2026 polish roadmap (ordered by impact):**
1. ~~**P12** — Pricing comparison matrix~~ — **shipped in PR #119.**
2. ~~**P30** — Homepage density break — workflow timeline between HERO and FEATURES.~~ — **shipped in PR #123.**
3. ~~**P24** — Self-host Syne + DM Mono fonts (woff2 subset).~~ — **shipped in PR #124.**
4. ~~**P16** — Language switcher (`हि` ↔ `EN`) UI affordance.~~ — **shipped in PR #125.**
5. ~~**P26** — Cookie banner (self-hosted, essential-only).~~ — **shipped in PR #120.**

**Recently resolved (since last audit refresh):** P10 contact form (PR #98), P19 inline tools-preview demo strip (PR #99), P2 hero A4-sheet mockup (PR #100), P1 hero animated gradient pulse (PR #102), P8 honest numbers strip (PR #103), R1/R2/R3/R5/R6 responsive polish (PR #108), U1 pricing buy-flow (PR #109), passport-photo unlock (PR #110), homepage inline checkout (PR #112), shared pricing modal (PR #114).

**Passport-photo-specific backlog** (`passport-photo.html` is no longer locked — unlocked 2026-04-24 — but still requires minimum-diff care; see AGENTS.md Hard rule #1):
- `F1` Razorpay `/build/undefined` 403 residual (payment flow works, SDK's own bug).
- ~~`F11` 1440 empty space below upload card~~ — **resolved PR #129.**
- ~~`P20` top-of-page thin progress bar for AI-model download~~ — **resolved PR #128.**
- ~~`P21` inline error banner near upload zone~~ — **resolved PR #130.**
- ~~`P29` step-bar progress line fill animation~~ — **shipped PR #126.**

Section B items not listed above are still open but lower-impact — revisit as the project owner picks priorities.

---

## D. Responsive + flow follow-up audit (2026-04-24)

**Method:** headless Chromium (Playwright), same probe as §A, extended to
7 viewports — `iphone-se 375×667`, `iphone-13 390×844`, `ipad-portrait
768×1024`, `ipad-air 820×1180`, `ipad-landscape 1024×768`, `desktop
1440×900`, `desktop-hd 1920×1080` — across all 8 pages. Full
screenshots + per-page JSON saved to `/home/ubuntu/audit-ev/` on the
session VM (not committed).

**Environment checks that passed cleanly (re-confirmed):**
- No horizontal page scroll at any viewport on any page
  (`document.scrollWidth ≤ window.innerWidth`).
- No broken `<img>` (`naturalWidth===0`).
- Footer + header pin behaviour holds (PR #66 fix intact).
- Slider activation (`assets/sliders.js`): `why-grid`, `features-grid`,
  `audience-grid`, `steps-grid` all switch to slider at ≤760 and at
  iPad-portrait 768 (via orphan detection). Desktop 1440+ stays plain
  grid. No `sliders.js` console errors anywhere.
- No console errors on homepage / any legal page at any viewport.
  Only `passport-photo.html` logs the pre-existing Razorpay F1 403
  (still open).

### D.1 Responsive gaps

| # | Page | Viewport | Severity | Finding |
|---|------|----------|----------|---------|
| R1 | `index.html` | iphone-se 375, iphone-13 390 | nit | Hero `<h1>Every print job.<br><em>One browser tab.</em></h1>` wraps the first sentence to two lines ("Every print" / "job.") because `.hero h1{font-size:clamp(34px,6.2vw,64px);max-width:18ch}` + `letter-spacing:-0.6px` still renders ~320 px wide at the 34 px clamp floor vs ~331 px usable width. Fix: tighten the clamp floor at `max-width:420px` (e.g. `clamp(28px,8.6vw,64px)`) or drop `max-width:18ch` on phones so each sentence fits one line. |
| R2 | `index.html` | ipad-portrait 768, ipad-air 820, ipad-landscape 1024, desktop 1440, desktop-hd 1920 | nit | Decorative `.hero-sheet.right` (PR #100) overflows the viewport right edge by 60–300 px on every desktop/tablet viewport — the sheet's bounding box extends past `window.innerWidth`. Page itself does not horizontally scroll because `html,body{overflow-x:hidden}` on `assets/legal.css`, but at 768 px the clipped gray edge is visible as a stripe. Fix: either clamp `right` offset to `max(-3%, -24px)` so the sheet never pokes past a sane limit, or add `overflow:hidden` to the direct `.hero` parent. Currently only `.hero-sheets` itself has `overflow:hidden` and it is `inset:0` inside `.hero` which has no clip. |
| R3 | `index.html` | ipad-portrait 768 | nit | Related to R2 — the `.hero-sheet.right` 1100 px-media rule (`top:58%;right:-10%;opacity:.55`) still leaves enough of the sheet visible at 768 to look like a layout glitch. Either drop the 760-px hide breakpoint down to 820, or scale the sheet smaller and more inset. |
| ~~R4~~ | `passport-photo.html` | iphone-se 375 | **resolved PR #130** | Upload card inner corner brackets shrunk (22→16px, offset −10→−6px) at ≤420px so they no longer clip the right edge on iPhone SE. |
| R5 | all | all | nit | Slider pagination dots are 7×7 px buttons — below the WCAG 2.5.5 AAA 24 px target and the commonly-recommended 44 px mobile target. Fix: keep the 7-px visual dot but expand the clickable area to ~24 px via `padding` + an inner `::before` dot, or use a `::after` transparent hit pad. |
| R6 | legal pages (`about`, `contact`, `privacy`, `terms`, `refund`, `shipping`) | all mobile | nit | Multi-link rows in the new footer (PR #95) render at line-height 17–18 px on phones. Each link has only ~17 px vertical clickable area. Add `padding-block:6px` on `.footer-col a` so each row hits ~30 px without changing visual spacing much. |
| ~~R7~~ | `index.html` | ipad-portrait 768 | **resolved PR #131** | Dedicated `@media (min-width:761px) and (max-width:768px)` breakpoint switches hero-preview grid to single column at iPad portrait. Hero sheets already hidden at 820 px; phone layout at 760 px. The 761–768 px gap no longer leaves the tool-demo cramped in 2-column mode. |

### D.2 Flow / UX findings

| # | Path | Severity | Finding |
|---|------|----------|---------|
| ~~U1~~ | home `.pcta` → login → `passport-photo.html#plans` | **resolved PR #109** | Clicking a paid plan on the homepage pricing cards now takes the user straight to Razorpay for the selected plan. `index.html` CTAs (`a.pcta[data-plan-cta]`) point at `passport-photo.html#buy-weekly` / `#buy-monthly`, and the signup-modal post-login redirect target is built from `data-plan-cta` too. `passport-photo.html` `maybeOpen()` gained a `#buy-<planId>` branch that calls `window.startCheckout(planId)` directly and clears the hash via `history.replaceState` so reload doesn't re-trigger checkout. (Actual function name is `startCheckout`, not `purchasePlan`.) |

### D.3 PR sequence — all shipped

1. ~~**Responsive polish (R1/R2/R3/R5/R6)**~~ — **shipped in PR #108.**
2. ~~**Pricing buy-flow (U1)**~~ — **shipped in PR #109.**
3. ~~**Homepage inline checkout**~~ — **shipped in PR #112.** Pricing CTAs
   open Razorpay directly without page navigation.
4. ~~**Shared pricing modal**~~ — **shipped in PR #114.** `assets/pricing.js`
   + `assets/pricing.css` — 2-step Choose Plan → Complete Payment → Razorpay
   on every page. `auth.js` Upgrade/Change Plan button now opens this modal
   on the current page instead of redirecting to `passport-photo.html#plans`.
~~R4~~ shipped PR #130. ~~R7~~ shipped PR #131.

---

## E. Full responsive re-audit (2026-04-24, session #2)

**Method:** headless Chromium via Playwright, 9 pages × 8 viewports =
72 page-viewport combos. Viewports: iPhone SE 375×667, iPhone 13
390×844, Pixel 7 412×915, iPad portrait 768×1024, iPad Air 820×1180,
iPad landscape 1024×768, desktop 1440×900, desktop HD 1920×1080.
Full-page screenshots + DOM probes (horizontal scroll, broken images,
element overflow, text clipping, console errors, network errors).

**Result: ALL CLEAR — no new issues found.**

| Check | Result |
|-------|--------|
| Horizontal scroll | ZERO on all 72 combos |
| Broken images | ZERO |
| Header present | All pages |
| Footer present | All pages |
| Login button visible | All pages |
| New console errors | None — only pre-existing F1/F7 |
| New network errors | None |
| New layout bugs | None |

**Known issues re-confirmed (unchanged from §A/§D):**
- F1: Razorpay `/build/undefined` 403 — SDK's own bug, payment flow unaffected.
- F7: Google Sign-In SDK 403 in headless — works in real browsers, harmless.
- `charAt` error from sliders.js — cosmetic, no visual impact.
- R2: `.hero-sheet.right` decorative element extends past viewport — clipped by `overflow:hidden`, invisible to users.
- Slider off-screen cards register as DOM overflows but are visually clipped by slider container — expected slider behaviour, not a bug.

**New finding during audit:**
- **F13**: `.stats-grid` (By the numbers section) was not included in
  `sliders.js` SELECTORS — 4 stat cards produce a 3+1 orphan row at
  820 px but never converted to a slider. **Fixed:** added `.stats-grid`
  to SELECTORS + matching `.is-slider` CSS rules in `index.html`.

**Evidence:** screenshots at `/home/ubuntu/audit-evidence-2/screenshots/`, full JSON at `/home/ubuntu/audit-evidence-2/audit.json` (session VM only, not committed).

---

## F. Footer & UX cleanup (2026-04-24, session #3)

Owner-reported issues from real-device testing (iPhone, iPad, Galaxy S24 Ultra).

| # | Area | Finding | Status |
|---|------|---------|--------|
| F14 | Footer (all pages) | Language switcher (`EN` / `हि` toggle) non-functional — clicking Hindi does nothing visible. Removed from all 8 shared pages + CSS + `lang.js` script. | **fixed this PR** |
| F15 | Homepage | "Open Passport Photo →" floating sticky CTA button on mobile (`sp-mobile-cta`) over-glorifies a single feature — unnecessary when more tools (Document Sheet, Certificate Editor, etc.) are planned. Removed element + CSS + JS. | **fixed this PR** |
| F16 | Footer (iPad / tablet) | Footer wastes too much vertical space on iPad — brand column + 4 nav columns stack into separate rows with excessive gaps. Compacted: kept 4-col nav grid at tablet, reduced gaps and padding. | **fixed this PR** |
| F17 | Footer (phone) | Footer bottom bar (`footer-bottom`) left-aligned on phones — looks messy. Changed to centered layout with centered meta icons. | **fixed this PR** |
| F18 | passport-photo.html footer (phone) | Simple `.links` footer looks messy on phone — links run together without clear spacing. Converted to flex-wrap centered layout with proper gap. | **fixed this PR** |
| F19 | passport-photo.html (phone) | Upload card ("Drop your photo here") gets cut off at top and bottom on phone screens. Added padding to `.canvas-area` and increased min-height from 180px to 220px at ≤640px. | **fixed this PR** |

### Learnings for future sessions

1. **Don't over-glorify a single feature.** When a website has multiple planned tools (Passport Photo, Document Sheet, Certificate Editor, etc.), avoid creating dedicated floating CTAs, hero animations, and workflow demos that only showcase one tool. Every such element will need reworking when the next feature launches.
2. **Footer quality reflects on Devin AI credit.** The footer says "Built with Devin AI" — if the footer looks bad (wasted space, misaligned, broken features), it directly reflects on Devin's quality. Always test footer on real mobile/tablet viewports.
3. **Test language switcher before shipping.** P16 shipped a non-functional Hindi toggle — it should have been tested with actual translated content or not shipped at all.
4. **Compact footers on mobile.** Multi-column footers need aggressive compacting on phones and tablets. Don't just stack columns — reduce gaps, font sizes, and padding proportionally.
5. **Upload areas need breathing room on mobile.** Interactive areas (drop zones, upload cards) should have padding around them on small screens so they don't clip against viewport edges or adjacent elements.

---

## G. Single-feature glorification cleanup (2026-04-24, session #4)

Owner-reported: the homepage over-glorifies Passport Photo as if it's the only product.
When more tools (Document Sheet, Certificate Editor, Background Studio) launch,
every feature-specific CTA, hero animation, and workflow demo will need reworking.

**Rule (permanent):** Never create dedicated hero CTAs, floating buttons, or
separate workflow sections for a single feature. Keep all CTAs generic
("See all tools", "Get started", "Explore the tools") and let the features
grid serve as the entry point for each tool.

| # | Area | Finding | Status |
|---|------|---------|--------|
| G1 | Hero CTA (`index.html`) | "Open Passport Photo →" replaced with "See all tools →" linking to `#features`. | **fixed this PR** |
| G2 | CTA band (`index.html`) | "Open Passport Photo — free →" replaced with "Explore the tools →" linking to `#features`. | **fixed this PR** |
| G3 | 404 page | "Open Passport Photo" button replaced with "Explore the tools" linking to `index.html#features`. | **fixed this PR** |
| G4 | `assets/lang.js` | Dead file — lang switcher was removed from shared pages in PR #139 but file was never deleted. Removed. | **fixed this PR** |
| G5 | `passport-photo.html` | Dead `.lang-toggle` / `.lang-btn` CSS rules removed (no HTML element uses them). | **fixed this PR** |

### Learnings for future sessions

6. **No single-feature glorification.** When a website has multiple planned tools, hero CTAs, floating buttons, and workflow demos must be generic. Each tool gets promoted through its own card in the features grid — not through dedicated hero buttons or floating CTAs. This avoids costly rework when the next tool launches.
7. **Delete dead code immediately.** When a feature is removed (e.g. lang switcher), delete ALL related files and CSS in the same PR. Don't leave orphaned files or dead CSS rules — they confuse future sessions and bloat the codebase.
8. **Devin's credit is on the line.** The footer says "Built with Devin AI". Every messy footer, broken toggle, or wasted space reflects directly on Devin's quality. Test every viewport before shipping.

---

## H. Document Sheet feature (2026-04-25, session #5)

Studio Print's second tool — Document Sheet (Aadhaar / PAN PDF → A4 sheet).
Shipped in two PRs:

| # | PR | What shipped | Status |
|---|------|---------|--------|
| H1 | PR #156 | **Feature card + multi-tool copy.** Features grid: new "Document Sheet" card with `Soon` tag. Nav dropdown on all 10 pages: Document Sheet entry with `Soon` tag. Density-break, how-it-works, FAQ copy updated from photo-only to generic multi-tool. Footer: Document Sheet + All Features links. New `#i-file-text` SVG icon. CSS: `.dd-tag.soon` + `.tag.soon` styles. | **merged** |
| H2 | PR #157 | **Document Sheet tool page (Phase 1).** New `document-sheet.html` (647 lines): drag-and-drop + file-picker PDF upload (max 10 MB), automatic password-protected PDF detection, password input with tips (Aadhaar: first 4 letters + birth year; PAN: DOB DDMMYYYY), client-side PDF unlock via pdf.js 3.11.174 (CDN), page thumbnail preview (up to 6 pages), on-device badge. Shared header/nav/footer/auth/pricing modules. BreadcrumbList JSON-LD, OG/Twitter meta, robots directive. Responsive (375–1920 px). `index.html` features grid Soon→Live. Nav dropdown all pages Soon→Live link. `build.js` + `sitemap.xml` updated. | **merged** |

## I. Document Sheet — detection, editor & A4 sheet (2026-04-25, sessions #6–#8)

| # | PR | What shipped | Status |
|---|------|---------|--------|
| I1 | PR #159 | **Dropdown feature icons fix.** Added missing `.ix` CSS rule (`fill:none; stroke:currentColor`) on `document-sheet.html` so nav dropdown SVG icons render correctly. | **merged** |
| I2 | PR #160 | **Aadhaar/PAN card detection.** Text extraction via pdf.js `getTextContent()`, keyword matching (2+ hits confirms doc type), styled detection badge (amber=Aadhaar, green=PAN), unsupported document rejection with error message. | **merged** |
| I3 | PR #163 | **Document Sheet Phase 2 — editor + A4.** Editor step with brightness/contrast/saturation/warmth/shadows sliders. Full Document / Photo Only toggle (photo excluded from edits in full-document mode). Card crop + photo crop extraction from rendered PDF at 300 DPI. A4 sheet generation (2480×3508 canvas), download PNG + print. | **merged** |
| I4 | PR #165 | **Full Document photo fix + Back button.** Fixed photo protection in Full Document mode — now restores original photo pixels directly from same card buffer with bounds checking (previous approach used separate `photoImageData` with coordinate translation that could fail). Added "Back to Edit" button on A4 result page so user can return to editor and adjust settings. | **merged** |

**Next:** PAN Photo Only bug (see §J below).

---

## J. PAN Photo Only — face isolation bug (2026-04-25, session #9)

**Status: SUPERSEDED — old `document-sheet.html` deleted (PR #185), new
`id-print.html` (PR #188) uses a completely different crop system. This
bug no longer applies.**

### Problem

PAN Photo Only mode does NOT isolate the face photo. Instead it shows
a large region of the card (header text, name, DOB etc.) instead of
just the passport-size face.

Aadhaar Photo Only works correctly — cleanly extracts just the face.

### Root cause analysis

`detectPhotoInCard()` in `document-sheet.html` uses pixel density
analysis to find the photo region inside the card crop. This works for
Aadhaar but **fails for PAN** because:

1. **Hindi header text** (आयकर विभाग / INCOME TAX DEPARTMENT) at the
   top of the card has dark pixels in the same x-columns as the photo.
2. **Name/DOB text** (DHARMENDER, RAJENDER, 05/07/1999) below the photo
   also has dark pixels in the same x-columns.
3. The vertical density scan merges header + photo + text into one
   giant region instead of isolating just the face.

### What was tried (didn't work)

1. **PR #170 (merged):** Added PAN-specific vertical scan bounds
   (`vTop=2%`, `vBot=58%` of card height) to limit the vertical scan
   range. Result: still showed card header + photo merged together.
   The Hindi header text within the left 22% strip still produces
   enough density to merge with the photo run.

2. **Hardcoded `PAN_PHOTO_FRAC` approach (not merged):** Defined
   `PAN_PHOTO_FRAC = { x0: 0.02, y0: 0.14, x1: 0.27, y1: 0.58 }`
   as fraction of card crop, bypassing density detection for PAN.
   Code was pushed to PR #170 branch but coordinates may need
   calibration against the actual PAN PDF.

### Suggested fix approach for next session

1. **Load the test PAN PDF** (`072679701357620_signed.pdf`, password:
   `05071999`) in the browser on `document-sheet.html`.
2. **Add `console.log` debugging** inside `processPdf()` to print the
   actual pixel coordinates of `cardCropInfo` (cx0, cy0, cw, ch) and
   the detected/hardcoded photo region (px0, py0, pw, ph).
3. **Use browser DevTools** to inspect the rendered PDF canvas and
   measure the exact photo position within the card crop.
4. **Calibrate `PAN_PHOTO_FRAC`** coordinates based on actual
   measurements. The photo position varies slightly between PAN card
   versions but is always in the upper-left quadrant.
5. **Test both PAN and Aadhaar** to confirm Aadhaar is unaffected.

### Key file locations

- `document-sheet.html` lines ~886–956: crop constants + `detectPhotoInCard()`
- `document-sheet.html` lines ~985–1012: `processPdf()` where photo extraction happens
- Card crop constants: `AADHAAR_CROP`, `PAN_CROP`
- Photo detection: `detectPhotoInCard(cardData, docType)` — works for Aadhaar, fails for PAN
- Test PDFs saved in repo: `test-pdfs/pan-test.pdf` (password: `05071999`), `test-pdfs/aadhaar-test.pdf` (password: `SUNI1986`)

---

## K. Card size standardization + lamination fit (2026-04-25, session #10)

**Status: SUPERSEDED — old code deleted (PR #185), rebuilt from scratch
in `id-print.html` (PR #188) with correct CR80 sizing baked in.**

### Problem

PAN card printed smaller than Aadhaar on A4 sheet. Both cards should be
identical size for 65×95mm lamination pouches (Reston 125 micron).

### Root cause

`buildA4Sheet()` drew each card at its native PDF crop pixel size. Since
PAN and Aadhaar PDFs have different page sizes and the cards occupy different
proportions, the resulting printed cards were different sizes.

### Fix (PR #182)

1. **CR80 standard size constants** — `CARD_PRINT_W` (1011 px) and
   `CARD_PRINT_H` (638 px) = 85.6×54mm at 300 DPI. Industry standard
   PVC card size that fits inside 65×95mm lamination with ~4.7mm margin
   on width and ~5.5mm on height.
2. **Both cards scaled to CR80** — `drawImage` in `buildA4Sheet()` now
   uses fixed `CARD_PRINT_W × CARD_PRINT_H` instead of native `ci.sw × ci.sh`.
3. **Auto-trim for both card types** — `trimCardEdges()` was PAN-only,
   now runs on Aadhaar too for cleaner card boundaries.
4. **Test PDFs committed** — `test-pdfs/pan-test.pdf` (pw: `05071999`)
   and `test-pdfs/aadhaar-test.pdf` (pw: `SUNI1986`) saved in repo.

### Still open

- **§J PAN Photo Only face isolation** — `PAN_PHOTO_FRAC` may still need
  calibration. Separate fix, separate PR.
- **Card crop fractions** (`AADHAAR_CROP`, `PAN_CROP`) may need tuning
  for edge cases with different PDF layouts. Current values work for
  standard government-issued ePAN and eAadhaar PDFs.

---

## L. Full Aadhaar/PAN card system rebuild (2026-04-25, session #11)

**Status: RESOLVED — PR #185 deleted old `document-sheet.html`, PR #188
rebuilt from scratch as `id-print.html` (ID Card Print Phase 1 MVP).
PR #189 fixed Aadhaar detection. PR #191 added Phase 2 photo editing.**

### Background

Owner tested PR #182 output (CR80 card size standardization). Despite
the fix forcing both cards to identical pixel dimensions on the A4
canvas, the **PDF crop itself** is still wrong — the extracted card
region includes extra whitespace, cut marks, or text outside the actual
card boundary. This means the "standardised" output is scaling a badly
cropped region, not a clean card.

Owner's directive: **delete the entire old card crop/detection/sizing
system and rebuild from scratch.** Step-by-step, one PR per step.

### User workflow (print → cut → fold → laminate)

1. Upload eAadhaar or ePAN PDF → tool detects card type
2. Tool extracts the card from the PDF page (front side only currently)
3. Editor step: adjust brightness/contrast/saturation/warmth/shadows
4. Build A4 sheet with card centered
5. Download PNG or print directly
6. **User cuts** the printed card with scissors
7. **User folds** (front + back together — currently only front is placed)
8. **User laminates** in a 65×95 mm thermal pouch (Reston 125 micron)

For the lamination to work:
- The printed card must be **exactly CR80** (85.6 × 54 mm)
- The card crop from PDF must be **clean** — no extra whitespace, cut
  marks, or text bleed outside the card boundary
- Both PAN and Aadhaar must produce **identical output dimensions**

### Card size research

| Item | Dimensions | Notes |
|------|-----------|-------|
| CR80 standard (PVC card) | 85.6 × 54 mm (= 85.5 × 54 mm) | Same as credit/debit cards. Industry standard. |
| CR80 at 300 DPI | 1011 × 638 px | Current `CARD_PRINT_W` / `CARD_PRINT_H`. |
| Lamination pouch | 65 × 95 mm | Reston 125 micron thermal pouch. |
| Card inside pouch | ~4.7 mm margin width, ~5.5 mm margin height | Card fits with lamination seal on all 4 sides. |
| PVC blank card | 85.5 × 54 × 0.76 mm | For direct PVC printing (Epson L805/L8050 tray). |
| eAadhaar PDF page | ~595 × 842 pt (A4) | Card is in lower ~21% of page height. |
| ePAN PDF page | ~842 × 595 pt (A4 landscape) or varies | Card is in lower ~20% of page height. |

Source: IndiaMART PVC card listings, MySea Solutions CardXpress software,
UIDAI/NSDL standard specifications.

### Current problems with existing code

1. **Crop coordinates are approximate.** `AADHAAR_CROP` and `PAN_CROP`
   were manually estimated as fractions of page dimensions. Different
   PDF versions (UIDAI layout changes, different ePAN providers) may
   have slightly different card positions.

2. **Auto-trim is fragile.** `trimCardEdges()` uses a simple dark-pixel
   density threshold (8% of row/col pixels below brightness 220). This
   can fail when:
   - Card has a dark border/frame that the trim should keep
   - Cut marks or dashed lines near the card edges create false positives
   - White card background near edges has very few dark pixels

3. **PAN Photo Only detection fails (§J).** Hindi header text and name
   text merge with photo in density analysis → `detectPhotoInCard()`
   returns a huge region instead of just the face.

4. **Only front side placed on A4.** The current `buildA4Sheet()` places
   one card image. For the fold-and-laminate workflow, both front and
   back should be on the sheet.

5. **No visual validation.** There's no way for the user to see the crop
   boundary before committing to the A4 sheet. A preview with adjustable
   crop would catch bad extractions early.

### Rebuild plan (step by step, one PR per step)

**Step 1: Fix PDF → card crop extraction**
- Recalibrate `AADHAAR_CROP` and `PAN_CROP` against actual test PDFs
  using precise pixel measurements
- Improve `trimCardEdges()` or replace with a more robust approach
- Validate visually: the cropped region should contain ONLY the card,
  no extra whitespace or cut marks
- Test with both `test-pdfs/pan-test.pdf` and `test-pdfs/aadhaar-test.pdf`

**Step 2: Standardize output to exact CR80 dimensions**
- Both cards drawn at exact same pixel dimensions (1011 × 638) on A4
- Aspect ratio handling: if crop aspect ratio differs from CR80, decide
  whether to letterbox, stretch, or crop-to-fit
- Verify with ruler measurement on printed output

**Step 3: Fix PAN Photo Only face isolation**
- Replace density-based detection with hardcoded `PAN_PHOTO_FRAC`
- Calibrate coordinates using actual test PAN PDF
- Ensure Aadhaar Photo Only is unaffected

**Step 4: Front + back layout on A4**
- Currently only front side is placed on A4 sheet
- Add back side (from same PDF or second page) next to front
- Layout: front | back side by side, both at CR80 size
- User cuts around the pair, folds in middle, laminates

**Step 5: Print alignment + margin fine-tuning**
- Ensure the printed output matches physical measurements
- Account for printer margins (most printers have 3-6mm unprintable margins)
- Test with actual lamination pouches

### Test PDFs

Already saved in repo — do NOT need to be re-provided:
- `test-pdfs/pan-test.pdf` (password: `05071999`)
- `test-pdfs/aadhaar-test.pdf` (password: `SUNI1986`)

### Key file locations

**NOTE:** `document-sheet.html` was DELETED in PR #185. The file
references below are historical only — they no longer exist in the repo.
The new feature will be built from scratch as `id-print.html` (see §M).

- ~~`document-sheet.html` lines ~890–892: `AADHAAR_CROP`, `PAN_CROP`, `getCrop()`~~
- ~~`document-sheet.html` lines ~898–944: `trimCardEdges()` auto-trim~~
- ~~`document-sheet.html` lines ~946–947: `PAN_PHOTO_FRAC` hardcoded photo region~~
- ~~`document-sheet.html` lines ~950–1013: `detectPhotoInCard()` density analysis~~
- ~~`document-sheet.html` lines ~1022–1023: `CARD_PRINT_W`, `CARD_PRINT_H` (CR80 at 300 DPI)~~
- ~~`document-sheet.html` lines ~1026–1094: `processPdf()` — crop + detect + editor~~
- ~~`document-sheet.html` lines ~1240–1340: `buildA4Sheet()` — A4 canvas generation~~

---

## M. ID Card Print feature — research + implementation plan (2026-04-25)

**Status: Phase 1 COMPLETE (PR #188, verified 2026-04-26). Phase 2 photo
editing SHIPPED (PR #191). Remaining Phase 2/3 items open — see §M.6.**

PR #185 deleted the old broken `document-sheet.html`. This section
documents the competitor research and implementation plan for the
replacement feature: `id-print.html`.

### M.1 Competitor landscape

| Software | Type | Price | Key Features |
|----------|------|-------|-------------|
| **CardXpress (MySea Solutions)** | Desktop (Windows .NET) | Rs 2500 lifetime | Aadhaar/PAN/Voter/Ayushman PDF crop, photo edit, font change, bold, BigQR, front+back preview, positioning controls, Epson L805/L8050 tray + A4 (5-10 cards) + Dragon sheet (4×6, 2 cards) |
| **Smart Identity Pro (Radiumbox)** | Desktop (Windows) | Rs 3500 lifetime | One-click eAadhaar parse, card customization (header/footer/barcode/photobox toggle), photo edit, font adjust, preprinted card offset, print reports, A4 bulk (10 cards) |
| **eCardCutter (go24.info)** | Web (browser) | FREE unlimited | Aadhaar/PAN/Voter/Jan Aadhaar/Ayushman/eShram/ABC ID crop. Advance: issue date toggle, download date, front QR, mobile no, photo brightness/contrast, rounded borders. Paper + PVC print. |
| **DocSet.in** | Web (browser) | FREE | Aadhaar print — auto-align front+back on A4. 5 cards per A4 sheet. CR80 size (8.6×5.4 cm). High-res PDF. No install. |
| **PVC Pro** | Web (browser) | Rs 1/file credits | Aadhaar/PAN/Voter/Ayushman/eShram/ABHA/DL/RC. Auto-crop AI. Live preview. Batch processing. Watermarked free demo. |

### M.2 Card sizes and lamination

| Item | Dimensions (mm) | Pixels (300 DPI) | Notes |
|------|-----------------|-------------------|-------|
| CR80 (standard ID card) | 85.6 × 54 | 1011 × 638 | ISO/IEC 7810 ID-1. Same as credit/debit cards. |
| Lamination pouch (small) | 65 × 95 | 768 × 1122 | Most common for Aadhaar/PAN. Reston 125 micron. |
| Lamination pouch (medium) | 70 × 100 | 827 × 1181 | BigFalcon brand. Slightly more margin. |
| A4 paper | 210 × 297 | 2480 × 3508 | Standard print paper. |
| Dragon sheet (4×6) | 102 × 152 | 1205 × 1795 | Fits 2 cards. PVC coated. |
| PVC blank card | 85.5 × 54 × 0.76 | — | For Epson L805/L8050 card tray. |

**Lamination math:** Card (85.6×54mm) inside pouch (65×95mm portrait).
Card placed landscape → 85.6mm ≤ 95mm height (4.7mm margin each side),
54mm ≤ 65mm width (5.5mm margin each side). Front+back printed, folded,
placed inside pouch, heat-sealed.

### M.3 PDF structures

**eAadhaar PDF:**
- Size: A4 portrait (~595 × 842 pt = 2480 × 3508 px at 300 DPI)
- Pages: Usually 1 page with full letter format
- Front card area: Upper portion (~top 60-65%)
- Back card area: Lower portion (~bottom 30-35%)
- Password: First 4 letters of name (CAPS) + birth year (e.g., SUNI1986)
- Contents: Photo, name, DOB/age, gender, Aadhaar number, address,
  QR code (front), VID, download date, address continued (back)
- Source: UIDAI portal / Digilocker / mAadhaar (layout may vary slightly)

**ePAN PDF:**
- Size: Varies — some A4 portrait, some landscape
- Pages: Usually 1 page
- Password: DOB in DDMMYYYY format (e.g., 05071999)
- Providers: NSDL, UTI-ITSL, Income Tax eFiling — each has slightly
  different layout
- Contents: PAN number, name, father's name, DOB, photo, signature,
  hologram area (front), Hindi text, terms, QR code (back)

### M.4 How print shops actually work

1. Customer comes → shop downloads PDF from gov website
2. PDF is password-protected → enter password
3. Software auto-detects card type → auto-crops front + back
4. Optional: photo edit (brightness/contrast)
5. Print on: PVC tray (Epson L805) / Dragon sheet 4×6 / A4 paper
6. Cut the printed card with scissors
7. Fold front + back together
8. Laminate in 65×95mm thermal pouch (125 micron)
9. Charge customer Rs 30-100 per card

### M.5 Studio Print advantage over competitors

1. **Browser-based** — no software install needed
2. **Mobile-friendly** — phone se bhi kaam chalega
3. **Free unlimited** — no per-file charge, no license
4. **Privacy-first** — PDF browser mein hi process hota hai, server pe
   upload nahi (like passport photo tool)
5. **Modern UI/UX** — 2026 dark theme, smooth interactions
6. **Multi-device** — Chrome/Edge/Firefox sab pe chalega
7. **PWA** — installable, offline capable
8. **Auto-detect** — card type from PDF text extraction

### M.6 Implementation plan — phased

**Phase 1 (MVP) — one PR:**
1. New page: `id-print.html`
2. PDF upload + drag-and-drop + password unlock (pdf.js)
3. Auto-detect Aadhaar vs PAN (text extraction via `getTextContent()`)
4. Auto-crop front + back from PDF page (render page to canvas, crop
   card regions using calibrated coordinates)
5. CR80 sized output (1011 × 638 px at 300 DPI)
6. Front + back side-by-side preview (dark canvas area)
7. A4 sheet layout with both sides for fold-and-laminate
8. Download PNG + Print button (window.print with CSS @media print)
9. All processing client-side (no server upload)
10. Shared nav/auth/footer (legal.css, nav.js, auth.js, pricing.js)
11. Update homepage features grid card (currently "Soon" or missing)
12. Update nav dropdown with link to new page

**Phase 2 (follow-up PRs):**
- ~~Photo editing (brightness/contrast/saturation)~~ — **shipped PR #191**
- ~~Multiple cards per A4 sheet (5 card pairs per sheet)~~ — **shipped PR #193**
- ~~Cut marks / dashed guides on A4 output~~ — **shipped PR #193**
- ~~Rounded border option~~ — **shipped PR #194, bug fix PR #197**
- ~~Voter ID support~~ — **shipped PR #202**
- ~~Dragon sheet (4×6) layout option (2 cards per sheet)~~ — **shipped PR #203**

**Phase 3 (partial):**
- ~~Ayushman / Jan Aadhaar / eShram support~~ — **shipped PR #205**
- ~~Batch processing (multiple PDFs at once)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

### M.7 Technical constants

```javascript
// Card dimensions
const CR80_W_MM = 85.6;
const CR80_H_MM = 54;
const CR80_W_PX = 1011;  // at 300 DPI
const CR80_H_PX = 638;   // at 300 DPI

// Paper dimensions at 300 DPI
const A4_W_PX = 2480;
const A4_H_PX = 3508;
const DRAGON_W_PX = 1205;  // 4×6 inch
const DRAGON_H_PX = 1795;

// Lamination pouch
const POUCH_W_MM = 65;
const POUCH_H_MM = 95;

// Card type detection keywords (2+ matches confirms)
// Aadhaar: "aadhaar", "uid", "uidai", "unique identification",
//          "government of india", "vid", "enrolment",
//          "download date", "issue date"
//   (PR #189: added enrolment/download date/issue date — eAadhaar
//    PDFs often lack "aadhaar"/"uid" in text layer but always have
//    these 3. Verified 2026-04-26: 4 keyword hits on test PDF.)
// PAN: "permanent account number", "income tax", "pan",
//      "department", "nsdl", "utiitsl"
// Voter: "election commission", "epic", "voter", "electoral",
//        "electors photo identity", "polling station",
//        "assembly constituency", "parliamentary constituency"
// Ayushman: "ayushman", "pmjay", "pradhan mantri jan arogya",
//           "national health authority", "nha", "health card",
//           "beneficiary", "jan arogya", "health id", "ayushman bharat"
// Jan Aadhaar: "jan aadhaar", "janaadhaar", "rajasthan", "family id",
//              "jan aadhar", "planning department",
//              "rajasthan jan aadhaar authority", "janaadhar"
// eShram: "eshram", "e-shram", "unorganised worker",
//         "unorganized worker", "ministry of labour", "uan",
//         "universal account number", "shram card",
//         "labour and employment"
//
// Detection order (PR #205): Ayushman → Jan Aadhaar → eShram →
// Aadhaar → PAN → Voter (specific before generic to avoid
// keyword overlap, e.g. "jan aadhaar" contains "aadhaar")
```

### M.8 Key file locations (CREATED — PR #188)

- `id-print.html` — ID Card Print tool page (Phase 1 MVP shipped)
- Homepage `index.html` — features grid card links to id-print.html
- Nav dropdown on all pages — links to id-print.html
- `build.js` — includes id-print.html in build pipeline

### M.9 Phase 1 MVP verification (2026-04-26)

Tested locally with both test PDFs after PR #189 merge:

| Test | Result |
|------|--------|
| PAN PDF upload | PASSED |
| PAN password unlock (05071999) | PASSED |
| PAN auto-detect | PASSED |
| PAN front+back preview | PASSED |
| PAN CR80 output (1011×638px, 300 DPI) | PASSED |
| PAN A4 fold-and-laminate sheet | PASSED |
| PAN Download PNG + Print buttons | PASSED |
| Aadhaar PDF upload | PASSED |
| Aadhaar password unlock (SUNI1986) | PASSED |
| Aadhaar auto-detect (4 keyword hits) | PASSED |
| Aadhaar front+back preview | PASSED |
| Aadhaar CR80 output (1011×638px, 300 DPI) | PASSED |

**Phase 1 MVP is COMPLETE and VERIFIED. Ready for Phase 2 when requested.**

---

## N. ID Card Print — Phase 2 photo editing (2026-04-26, session #13)

**Status: SHIPPED — PR #191.**

| # | PR | What shipped | Status |
|---|------|---------|--------|
| N1 | PR #190 | **Docs update.** Updated shipped summary + verification results for PRs #186–#189. | **merged** |
| N2 | PR #191 | **Photo editing controls.** Real-time brightness/contrast/saturation sliders on preview step. Canvas `ctx.filter` (CSS filter syntax). Edited output carries through to A4 sheet generation. Reset button. Hidden in `@media print`. Mobile-responsive (sliders stack vertically ≤640px). Existing design tokens only, no new deps. | **merged** |

## O. ID Card Print — Phase 2 multi-card + rounded corners (2026-04-26, sessions #14–#15)

**Status: SHIPPED — PRs #193, #194, #197.**

| # | PR | What shipped | Status |
|---|------|---------|--------|
| O1 | PR #192 | **Docs update.** Updated shipped summary for PRs #190–#191 + new prompt. | **merged** |
| O2 | PR #193 | **Multi-card A4 layout.** 5 card pairs per sheet, cut marks/dashed guides, layout toggle (single fold-and-laminate vs 5-pair multi-card), column headers (Front/Back), corner marks for precision cutting. | **merged** |
| O3 | PR #194 | **Rounded corners toggle.** Checkbox in preview step — “Rounded Corners” on/off. Canvas `roundedRectPath` + `drawCardClipped` clip-path via `arcTo`. Applies to preview canvases (CSS `border-radius` + canvas clip) and A4 sheet (canvas clip). Default off. `CARD_RADIUS = 36` px. | **merged** |
| O4 | PR #197 | **Bug fix: `var r` variable shadowing + docs update.** In `buildMultiCardSheet()`, the loop variable `r` (row index) was overwritten by `var r = roundedCorners ? CARD_RADIUS : 0`. With `var` being function-scoped, this caused infinite loop when rounded corners off (r resets to 0 every iteration) and only 1 row drawn when on (r becomes 36, exceeds rows=5). Fix: moved radius calculation outside loop as `var radius`. Also updated SKILL.md, AGENTS.md, issues.md with shipped summary for PRs #192–#197. | **merged** |
|| O5 | PR #201 | **Docs update.** Fill Voter ID task in prompt, update AGENTS.md. | **merged** |
|| O6 | PR #202 | **Voter ID multi-page PDF support.** Multi-page Voter ID PDF (front page 1, back page 2), auto-detect via keywords, renders both pages at 300 DPI, auto-crop front+back, CR80 output, preview, A4 sheet. | **merged** |
|| O7 | PR #203 | **Dragon sheet (4×6) layout.** Third layout toggle option — 1205×1795px sheet, 2 cards stacked vertically (front + back), cut marks, corner marks, rounded corners support, dedicated download filename. | **merged** |

### What's still open (Phase 3)

**Phase 2 — COMPLETE.** All items shipped (photo editing PR #191, multi-card A4 PR #193, cut marks PR #193, rounded corners PR #194/#197, Voter ID PR #202, Dragon sheet PR #203).

**Phase 3 (partial):**
- ~~Ayushman / Jan Aadhaar / eShram support~~ — **shipped PR #205**
- ~~Batch processing (multiple PDFs at once)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## P. ID Card Print — Phase 3 Ayushman/Jan Aadhaar/eShram (2026-04-26, session #16)

**Status: SHIPPED — PR #205.**

|| # | PR | What shipped | Status |
||---|------|---------|--------|
|| P1 | PR #205 | **Ayushman Bharat (PMJAY) support.** Auto-detect via 10 keywords (`ayushman`, `pmjay`, `pradhan mantri jan arogya`, `national health authority`, `nha`, `health card`, `beneficiary`, `jan arogya`, `health id`, `ayushman bharat`). Crop regions for single-page and multi-page PDFs. Pink badge (`#f472b6`). CR80 output. | **merged** |
|| P2 | PR #205 | **Jan Aadhaar (Rajasthan family ID) support.** Auto-detect via 8 keywords (`jan aadhaar`, `janaadhaar`, `rajasthan`, `family id`, `jan aadhar`, `planning department`, `rajasthan jan aadhaar authority`, `janaadhar`). Crop regions for single-page and multi-page PDFs. Orange badge (`#fb923c`). CR80 output. | **merged** |
|| P3 | PR #205 | **eShram (unorganized worker UAN) support.** Auto-detect via 9 keywords (`eshram`, `e-shram`, `unorganised worker`, `unorganized worker`, `ministry of labour`, `uan`, `universal account number`, `shram card`, `labour and employment`). Crop regions for single-page and multi-page PDFs. Green badge (`#34d399`). CR80 output. | **merged** |
|| P4 | PR #205 | **Detection order fix.** Specific types checked before generic ones to avoid keyword overlap (e.g. `jan aadhaar` contains `aadhaar`). Order: Ayushman → Jan Aadhaar → eShram → Aadhaar → PAN → Voter. | **merged** |
|| P5 | PR #205 | **Multi-page PDF support generalized.** Previously Voter-only (`if detectedType === 'voter'`), now works for all card types with `frontPage`/`backPage` crop regions (`if pdf.numPages >= 2 && crop.frontPage`). | **merged** |
|| P6 | PR #205 | **UI updates.** Hero text, drop zone text, password hints, meta descriptions, nav dropdown, footer tagline — all updated to include new card types. | **merged** |

### What's still open (Phase 3 remaining)

- ~~Batch processing (multiple PDFs at once)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## Q. ID Card Print — Phase 3 Batch Processing (2026-04-26, session #17)

**Status: SHIPPED — PR #208.**

|| # | PR | What shipped | Status |
||---|------|---------|--------|
|| Q1 | PR #208 | **Multi-file upload.** `<input type="file" multiple>` + drag-and-drop now accepts multiple PDFs at once. Single-file uploads still work via legacy path (no queue UI shown). | **merged** |
|| Q2 | PR #208 | **File queue UI.** `.idp-queue` displays each queued file with name, processing status badge (queued/processing/done/error), and a remove button (×). Styled with existing tokens (`--surface`, `--border`, `--text`). | **merged** |
|| Q3 | PR #208 | **Queue actions.** "+ Add More PDFs" button to add more files after initial selection. "Process All →" button to start batch processing. Both hidden until 2+ files queued. | **merged** |
|| Q4 | PR #208 | **Per-file password prompts.** Password-protected PDFs in batch are prompted one at a time via `pendingPasswordIdx`. After password entry, processing continues with remaining files. | **merged** |
|| Q5 | PR #208 | **Batch auto-detect + auto-crop.** Each PDF individually auto-detected (Aadhaar/PAN/Voter/Ayushman/Jan Aadhaar/eShram) and auto-cropped. Results stored in `batchCards[]` array with type, front/back image data, and file name. | **merged** |
|| Q6 | PR #208 | **Batch preview.** All processed cards shown in preview step with individual card pairs (front + back) per file. `batchCardsContainer` dynamically generates card pair elements for each processed PDF. Batch count info displayed. | **merged** |
|| Q7 | PR #208 | **Batch A4 sheet.** All cards from batch combined onto single A4 sheet. Works with existing layout modes (single/multi-card/Dragon). | **merged** |
|| Q8 | PR #208 | **Type labels + icons.** `TYPE_LABELS` and `TYPE_ICONS` maps for display names and emoji icons per card type (Aadhaar 🆔, PAN 💳, Voter 🗳️, Ayushman 🏥, Jan Aadhaar 👨‍👩‍👧‍👦, eShram 👷). | **merged** |

### What's still open (Phase 3 remaining)

- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## R. ID Card Print — Phase 3 PVC Card Tray Layout (2026-04-26, session #18)

**Status: SHIPPED — PR #210.**

|| # | PR | What shipped | Status |
||---|------|---------|--------|
|| R1 | PR #210 | **PVC card tray layout.** Fourth layout toggle option — 1417×1417px (120×120mm at 300 DPI) square canvas sized for Epson L805/L8050 CD/DVD card tray. | **merged** |
|| R2 | PR #210 | **Dual card slots.** Front card at top, back card below with 71px gap matching physical tray slot spacing. Both centered horizontally. | **merged** |
|| R3 | PR #210 | **Tray guides.** Dashed border around full canvas area to represent physical tray outline. Card slot outlines (dashed) around each card position for alignment. | **merged** |
|| R4 | PR #210 | **Corner marks + labels.** Corner marks on both card positions for precision alignment. "Front" / "Back" labels above each slot. | **merged** |
|| R5 | PR #210 | **Rounded corners support.** Existing rounded corners toggle applies to PVC tray layout — both card slots respect the setting. | **merged** |
|| R6 | PR #210 | **Footer + download.** Footer text: "PVC Tray · Epson L805/L8050 · 120×120 mm · 300 DPI — Studio Print". Download filename suffix: `-pvc-tray.png`. | **merged** |

### What's still open (Phase 3 remaining)

- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## S. Copy update — ID Card Print nav dropdown + feature card (2026-04-26, session #19)

**Status: SHIPPED — PR #213.**

||| # | PR | What shipped | Status |
|||---|------|---------|--------|
||| S1 | PR #213 | **Nav dropdown subtitle update (7 pages).** Changed from "Aadhaar · PAN · Voter ID · CR80 sheet" to "Aadhaar · PAN · Voter · Ayushman · more" on index.html, about.html, contact.html, privacy.html, terms.html, refund.html, shipping.html. Now matches id-print.html which was already updated in PR #205. | **merged** |
||| S2 | PR #213 | **Homepage feature card description.** Updated to mention all 6 card types (Aadhaar, PAN, Voter ID, Ayushman, Jan Aadhaar, eShram) plus batch processing, multi-card A4, Dragon sheet, PVC tray print, photo editing. | **merged** |

---

## T. ID Card Print — Phase 3 Toggle Options (Aadhaar) — Research Complete

**Status: RESEARCH DONE (PR #215 docs). Coding pending.**

### T.1 What this feature is

Aadhaar card ke preview + output (A4, Dragon sheet, PVC tray, multi-card) mein
4 checkbox toggles add karne hain jo specific fields ko hide/show karein:
- **Issue Date** (back card)
- **Download Date** (back card)
- **Mobile Number** (back card, partially masked)
- **QR Code** (back card, bottom-right)

Competitor reference: eCardCutter (go24.info) — already has this feature free.

### T.2 Technical approach

Card rendering is canvas-based — PDF page rasterized, then crop region extracted
and scaled to CR80 (1011×638px). Fields ko hide karne ka method:
**white rectangle overlay drawn post-crop** over fixed pixel regions.

After `drawFilteredToCanvas()` ya `drawCardClipped()`, ek `applyAadhaarMasks()`
function call hoga jo checked toggles ke basis par white/background-colored
rectangles draw karega un regions par.

### T.3 Approximate field positions on Aadhaar BACK card at CR80 (1011×638px)

Ye positions eAadhaar standard layout se estimated hain — test PDF se
verify + fine-tune karna hoga.

```javascript
const AADHAAR_FIELD_MASKS = {
  qrCode:       { side: 'back', x: 710, y: 10,  w: 295, h: 615 }, // right column, full height
  mobileNumber: { side: 'back', x:   8, y: 310, w: 580, h:  80 }, // middle-left row
  issueDate:    { side: 'back', x:   8, y: 460, w: 480, h:  70 }, // lower-left row
  downloadDate: { side: 'back', x:   8, y: 540, w: 480, h:  85 }, // bottom-left row
};
```

**Note:** These are approximate — run test PDF (aadhaar-test.pdf pw: SUNI1986),
visually inspect rendered back card, adjust x/y/w/h values to precisely cover
each field without touching adjacent content.

### T.4 Implementation plan (id-print.html only)

1. **Add 4 checkboxes** in the preview step UI (`.idp-options` section, after
   the existing Rounded Corners checkbox). Show only when `detectedType === 'aadhaar'`.
   Labels: "Hide QR Code", "Hide Mobile No.", "Hide Issue Date", "Hide Download Date".
   Default: all unchecked (show everything).

2. **Add `applyAadhaarMasks(ctx, w, h)` function** — reads the 4 checkbox states,
   draws `ctx.fillStyle = '#ffffff'` rectangles over matched regions (scaled to
   actual canvas dimensions using w/h ratio from CR80 reference).

3. **Call `applyAadhaarMasks()` everywhere a card canvas is finalized:**
   - After `drawFilteredToCanvas()` in `refreshPreview()`
   - After `drawCardClipped()` / `ctx.drawImage()` in `buildA4Sheet()`
   - After card drawing in `buildDragonSheet()`
   - After card drawing in `buildPvcTray()`
   - After card drawing in batch preview refresh

4. **Live toggle effect:** Each checkbox `change` event calls `refreshPreview()`
   (already exists) — so masks apply immediately on toggle without re-processing
   the PDF.

5. **Batch mode:** In batch, `detectedType` per card is `card.type` — only show
   mask UI for Aadhaar cards. For non-Aadhaar cards in batch, skip masks.

### T.5 CSS / UI notes

- Use existing `.idp-option` class for each checkbox row (same as Rounded Corners).
- Group the 4 Aadhaar toggles under a small label like "Aadhaar field options"
  or just add them as 4 separate `.idp-option` rows.
- Hide the group with `display:none` for non-Aadhaar card types (JS toggle on
  detect badge update).
- No new CSS tokens — use existing `--surface`, `--border`, `--text`.

### T.6 What's NOT in scope for this PR

- PAN/Voter ID toggles — separate PR later, explicitly requested.
- Auto photo enhancement, signature box, hologram overlay — separate PRs.

## U. ID Card Print — Phase 3 Signature Box (PAN) — Research Complete

**Status: RESEARCH DONE (this PR docs). Coding pending — separate code PR per Rule #14.**

### U.1 What this feature is

PAN card ke FRONT side preview + saare output layouts (A4 fold-and-laminate,
multi-card A4, Dragon sheet, PVC tray, batch) mein ek **empty signature box
overlay** add karne ka option. Use case: ePAN PDFs (NSDL / UTI-ITSL / Income
Tax e-Filing) mein cardholder ki signature kabhi missing hoti hai, kabhi
faded hoti hai, ya physical signature ki zaroorat hoti hai post-lamination.
Ye toggle ek labelled white box draw karta hai jahan user laminate karne ke
baad pen se sign kar sake.

Competitor reference:
- **CardXpress (MySea Solutions)** — has dedicated "Signature Box" toggle for
  PAN cards (paid Rs 2500 desktop tool).
- **eCardCutter (go24.info)** — free web tool, has signature box overlay
  option for PAN.

Pattern is well-established; not a UX risk.

### U.2 Technical approach

Mirror `applyAadhaarMasks()` design exactly — same architecture, different
visual (border + label vs solid white fill), different toggle scope (PAN
only vs Aadhaar only).

Steps:
1. Single checkbox in preview UI (`#chkSignatureBox`) inside a new wrapper
   `#panToggles` (parallels existing `#aadhaarToggles`). Visible only when
   `detectedType === 'pan'`.
2. New constant `PAN_OVERLAY_REGIONS.signatureBox = { side, x, y, w, h }`
   at CR80 1011×638px reference.
3. New function `applyPanOverlays(ctx, ox, oy, side)` — reads `chkSignatureBox.checked`,
   draws a white-filled rectangle with a 2px black stroke and a small
   "Signature" label above (DM Mono 18px, centered) inside `PAN_OVERLAY_REGIONS.signatureBox`
   when `side === 'front'`.
4. Wire `applyPanOverlays()` at the **same three call sites** as
   `applyAadhaarMasks()`:
   - `drawFilteredToCanvas()` — preview canvases (single + batch)
   - `drawFiltered()` — A4/Dragon/PVC/multi-card output paths
   - `applyBatchFilters()` — batch preview cache
5. Visibility toggle on detect: extend the existing
   `aadhaarToggles.classList.toggle('idp-hidden', detectedType !== 'aadhaar')`
   line with a parallel `panToggles.classList.toggle('idp-hidden', detectedType !== 'pan')`.
6. Live update: hook `chkSignatureBox.addEventListener('change', refreshPreview)`
   alongside the existing Aadhaar toggle listeners.

### U.3 Approximate signature-box position on PAN FRONT card at CR80 (1011×638px)

Standard physical PAN card layout (NSDL/UTI/Income Tax e-Filing all share
the same trim layout):
- Top band: government emblem + "INCOME TAX DEPARTMENT" header
- Left bottom: cardholder photo (~200×260px area at CR80)
- Right column: Name / Father's Name / DOB / PAN number
- Bottom-right: signature region (often empty in ePAN)

Recommended box placement (signature region — bottom-right, below DOB):

```javascript
const PAN_OVERLAY_REGIONS = {
  signatureBox: { side: 'front', x: 540, y: 470, w: 380, h: 110 },
};
```

Visual specification:
- Fill: `#ffffff` (solid white, covers any faded signature underneath)
- Stroke: `#000000`, `lineWidth: 2`
- Optional label: `"Signature"` in DM Mono / sans-serif `18px`, color `#333`,
  drawn above the box top edge with `~6px` padding. Centered horizontally
  within the box.
- Inside the box: empty white space for ink-signing post-print.

**Note:** Coordinates approximate — verify with `test-pdfs/pan-test.pdf`
(password: `05071999`). May need ±20–30px tuning to:
- Avoid clipping the printed PAN number / DOB row above
- Stay clear of the bottom card edge (keep ≥10px margin)
- Not overlap the photo on the left edge

### U.4 Implementation plan (id-print.html only — ~50 line diff)

1. **HTML** — after `#aadhaarToggles` block (line ~440), add:
   ```html
   <!-- PAN field overlays — shown only for PAN cards -->
   <div id="panToggles" class="idp-hidden">
     <label class="idp-option"><input type="checkbox" id="chkSignatureBox"> Add Signature Box</label>
   </div>
   ```

2. **JS constants** — after `AADHAAR_FIELD_MASKS` block (line ~625), add
   `PAN_OVERLAY_REGIONS` constant.

3. **DOM refs** — add `const chkSignatureBox = $('#chkSignatureBox');` and
   `const panToggles = $('#panToggles');` near the existing Aadhaar refs.

4. **Detect-time visibility** — at line ~1034, add:
   ```js
   panToggles.classList.toggle('idp-hidden', detectedType !== 'pan');
   ```

5. **`applyPanOverlays(ctx, ox, oy, side)`** — new function right after
   `applyAadhaarMasks()` (line ~1146). Returns early if box unchecked or
   side !== 'front'. Draws white rect, then 2px black stroke, then "Signature"
   label above using `ctx.fillText`.

6. **Call sites** — extend the 3 existing Aadhaar mask call sites:
   - `drawFilteredToCanvas()` line ~1162: add
     `if (cardType === 'pan' && side) applyPanOverlays(ctx, 0, 0, side);`
   - `applyBatchFilters()` lines ~1177, ~1189: add parallel PAN overlay calls
     for front (and skip back since signature box is front-only).
   - `drawFiltered()` line ~1620: add
     `if (side && detectedType === 'pan') applyPanOverlays(ctx, 0, 0, side);`

7. **Live toggle** — add `chkSignatureBox.addEventListener('change', refreshPreview);`
   alongside the existing 4 Aadhaar checkbox listeners.

8. **Reset path** — in the existing reset/back logic that clears state
   (line ~1726), uncheck `chkSignatureBox` so a fresh upload starts clean.

### U.5 Batch mode behaviour

- `panToggles` visibility is driven by the **first card's** detected type
  in single-card mode and by the existing per-card `card.type` check inside
  `applyBatchFilters()` for batch.
- In a mixed batch (e.g. 2 Aadhaar + 1 PAN), the PAN-only signature box
  applies only to PAN-type cards inside the loop — non-PAN cards skip the
  overlay. Same pattern as `applyAadhaarMasks` already uses for Aadhaar.
- If batch contains zero PAN cards, hide `#panToggles` entirely.

### U.6 CSS / UI notes

- Use existing `.idp-option` class — no new CSS tokens.
- `#panToggles` uses the same `idp-hidden` toggle pattern as `#aadhaarToggles`.
- Single checkbox for now (room to grow later — e.g. "Add Photo Box" if
  any ePAN provider strips the photo).

### U.7 What's NOT in scope for this PR (or its follow-up code PR)

- Back-side hologram overlay (PAN) — separate research + code PRs later.
- Custom signature image upload (sign once, paste on every card) — out of
  scope; this is just the empty-box overlay.
- Per-card signature box position tuning UI — fixed coordinates only.
- Voter ID / Ayushman / Jan Aadhaar / eShram signature boxes — PAN only.

---

## V. ID Card Print — Phase 4 Scope Reset (CardXpress Feature Parity)

**Trigger:** User feedback (2026-04-26): "signature box ek chhota piece hai,
website pe abhi bhi bhut kuch karna baaki hai." User shared 8 reference
images they originally gave to the previous agent (Devin) when planning
this feature. Reviewing those images shows the §U signature box scope is
~10% of the actual target — a single small overlay vs. a full
competitor-parity card-print suite.

This section captures the broader scope and corrects two issues found in
§U / PR #221 during the image review.

### V.0 Reference images (committed to repo)

All 8 images live in `.agents/references/`:

- `competitor-cardxpress-ui.jpeg` — CardXpress Pro v8.1 main window (the
  paid competitor). The single most important reference.
- `pan-target-output-with-hologram.png` — PAN front+back ePAN PDF with
  HOLOGRAM patch visible on the back. Shows real signature position.
- `pan-clean-pvc-layout.png` — same PAN, cropped to clean CR80 PVC layout.
- `aadhaar-target-output.png` — clean Aadhaar PVC layout, full address.
- `aadhaar-clean-pvc-layout.png` — Aadhaar front+back at print-ready size.
- `workflow-pan-photoshop-demo.jpg` — competitor's Photoshop "one-click"
  PAN action demo (input PDF → output PVC sheet).
- `workflow-aadhaar-photoshop-demo.jpg` — same for Aadhaar.
- `workflow-aadhaar-tutorial-thumbnail.jpg` — YouTube tutorial thumbnail
  for context on the manual workflow we're replacing.

### V.1 CardXpress UI feature breakdown (from `competitor-cardxpress-ui.jpeg`)

The competitor exposes the following controls that we currently lack:

| # | Control                  | What it does                                               | We have it? |
|---|--------------------------|------------------------------------------------------------|-------------|
| 1 | Card-type tabs           | Aadhaar / PAN / Voter / Ayushman tabs at top               | Auto-detect (better) |
| 2 | PDF Path + Password      | File picker + password field                               | Yes |
| 3 | Photo Editor button      | Opens dedicated photo-tweak panel (separate window)        | Inline sliders only |
| 4 | Settings button          | Per-user prefs (default printer, layout, etc)              | No |
| 5 | Master Setting button    | Calibration: DPI, padding, A4 margins                      | No |
| 6 | PrePrinted Card mode     | Skip empty front, print only fillable fields on back       | No |
| 7 | Move pad (X/Y/XZ/YZ)     | Per-side nudge to fix mis-aligned crops                    | **No — high value** |
| 8 | Front/Back radio         | Pick which side the Move/Zoom controls target              | No |
| 9 | Zoom dial                | Per-side scale within CR80 frame                           | **No — high value** |
| 10 | Quality dropdown         | Medium / High / Draft print quality                        | No |
| 11 | Bold checkbox            | Bolden printed text on card                                | No |
| 12 | BigQR checkbox           | Enlarge QR for easier scan                                 | No |
| 13 | Aadhaar Note checkbox    | Show/hide the info-note overlay                            | No |
| 14 | Printer selector         | "Epson L805" → printer-specific DPI/margin profile         | No |
| 15 | Preview / Card Print     | Two-step workflow buttons                                  | Yes (Generate Sheet) |

We already win on: auto-detect (no tab clicking), batch upload, modern UI,
in-browser (no install). We lose on: fine-alignment controls, calibration,
printer presets.

### V.2 PAN target-output analysis (from `pan-target-output-with-hologram.png`)

Two critical findings that **invalidate parts of §U / PR #221**:

#### V.2.a §U signature box coordinates are WRONG

§U set `signatureBox: { side: 'front', x: 540, y: 470, w: 380, h: 110 }`.
That box sits at the **right-middle** of the front card — directly on top
of the QR code, not over the signature area.

In the reference image, the actual signature row is at the **bottom-left
to bottom-center**, below the photo + DOB columns:

- Approx coords at CR80 1011×638px:
  `signatureBox: { side: 'front', x: 280, y: 540, w: 280, h: 75 }`
- Label "हस्ताक्षर / Signature" appears below the box at y ≈ 620.

**Action:** PR #221 needs a coords-only follow-up patch (~4 lines) before
shipping to users. Mark as P1.

#### V.2.b PAN HOLOGRAM patch is the real missing overlay

The back of every genuine PAN PVC card has a silver/grey **HOLOGRAM**
square at the **top-right** corner. ePAN PDFs ship with the hologram
area visible as a faded watermark. For PVC printing, the convention is
to draw a labelled silver rectangle so the print shop can stick a real
hologram sticker on top after lamination.

- Approx coords at CR80 1011×638px:
  `hologram: { side: 'back', x: 800, y: 30, w: 180, h: 220 }`
- Fill: silver gradient (`#c0c0c0` → `#e8e8e8`) or flat `#d0d0d0`.
- Label: "HOLOGRAM" in DM Mono, white, centred, ~24px.
- Toggle: `chkHologram` in `#panToggles` (alongside `chkSignatureBox`).

This is **higher priority** than the signature box because hologram is
visible on every PAN card, while the signature box only matters for
unsigned ePANs.

### V.3 Aadhaar target-output analysis (from aadhaar-clean / target images)

- Confirms §S/§T hide-toggles (QR / Mobile / Issue Date / Download Date)
  are correct and well-positioned.
- Address block on back is the most important content — must NEVER be
  cropped or masked. Our current crop ratios preserve it.
- No new Aadhaar overlays needed from these images.

### V.4 Phase 4 backlog — prioritized

Each item is a separate research + code PR pair (per Rule #14).

| Pri | Item                                    | Est PR size | Why |
|-----|-----------------------------------------|-------------|-----|
| P1  | Fix §U signature box coordinates        | ~4 lines    | Current coords overlap QR — broken in PR #221 |
| P1  | PAN HOLOGRAM overlay                    | ~40 lines   | Visible on 100% of PAN cards, simple fill+label |
| P2  | Per-side Move controls (X/Y nudge)      | ~120 lines  | Highest competitor-parity value; fixes off-centre crops |
| P2  | Per-side Zoom (scale within CR80)       | ~80 lines   | Pairs with Move; fixes too-small/large crops |
| P3  | Photo Editor split panel                | ~150 lines  | Reorganize sliders + add Bold + add presets |
| P3  | Master Settings (DPI/padding/margins)   | ~200 lines  | Calibration screen with localStorage persistence |
| P3  | PrePrinted Card mode                    | ~60 lines   | Skip front render, output back-only sheets |
| P4  | Printer presets (Epson L805 etc)        | ~80 lines   | Dropdown of DPI/margin profiles per printer |
| P4  | Bold / BigQR text-emphasis toggles      | ~40 lines   | Aadhaar text bolden + QR upscale |
| P4  | Voter / Ayushman / Jan Aadhaar overlays | ~60 lines each | Same pattern as PAN once it lands |

### V.5 Recommended next 2 PRs (single session, ~half day)

1. **PR #222 — fix-pan-signature-coords** (~4 line patch)
   - Change `PAN_OVERLAY_REGIONS.signatureBox` to the corrected coords.
   - Ship before any user notices PR #221 draws over the QR.

2. **PR #223 — pan-hologram-overlay** (~40 line patch)
   - Add `hologram` entry to `PAN_OVERLAY_REGIONS`.
   - Add `chkHologram` checkbox to `#panToggles`.
   - Extend `applyPanOverlays` to draw silver fill + "HOLOGRAM" label.
   - Wire into the same 3 call-sites + listener array + reset.

After those two, pick one P2 item (Move OR Zoom) for the next session.

### V.6 What's NOT in scope for §V (this is research only)

- Any code changes — this is a docs-only PR.
- Implementing P1-P4 items — each gets its own Research → Docs → Code PR.
- Choosing colours, exact pixel coords beyond §V.2 estimates — refine
  during each item's research PR using the committed reference images.
- Removing or rewriting §U — §U stays valid except for the wrong
  signatureBox coords flagged in §V.2.a.

---

## §W ID Card Print Phase 4 P2 — Per-side Move (X/Y nudge) research

**Status:** Research-only PR (Rule #14 first half). Code PR follows in
a separate session.

**Goal:** Match CardXpress "Move pad" UX so users can nudge the
front/back crop window inside the CR80 1011×638 frame to fix
off-centre PDFs (very common with ePAN re-issues and Aadhaar QR-shifts).

### W.1 Current render pipeline (id-print.html, scouted 2026-04-26)

Two filter functions both use `ctx.drawImage(srcCanvas, 0, 0, w, h)`:

1. `drawFiltered(destCanvas, srcCanvas, w, h, filterStr, side)` —
   line ~1639. Single-card editor preview (`cardFrontCanvas` /
   `cardBackCanvas`). Called from the slider change handler at ~1655.
2. `drawFilteredToCanvas(canvas, srcCanvas, w, h, cardType, side)` —
   line ~1175. Batch grid preview (per-card mini canvases under
   `#batchCardsContainer`).
3. `applyBatchFilters()` — line ~1193. Rebuilds every cached
   `card.front` / `card.back` from `card.originalFront` /
   `card.originalBack` using `ctxF.drawImage(card.originalFront, 0, 0,
   CR80_W, CR80_H)` and the same for back.

Output sheets (A4, Dragon, PVC tray, multi-card) **all** consume the
already-filtered `card.front` / `card.back` canvases — see
`ctx.drawImage(card.front, ...)` at lines 1294, 1374, 1450, 1522 and
back equivalents at 1302, 1379, 1456, 1527. **This means Move only
needs to be inserted in the three filter passes above; output sheets
inherit it for free** — same architectural property the §V overlays
relied on.

Overlays (`applyAadhaarMasks`, `applyPanOverlays`) draw at fixed
PVC-card coords and **must NOT move with the photo** (the silver
HOLOGRAM patch and signature box have to land at the printer's
expected position regardless of crop offset). Overlay calls stay at
`(ctx, 0, 0, side)` — no change required.

### W.2 State shape

Add per-card per-side offsets, default `{dx:0, dy:0}`:

```js
batchCards[i].offset = {
  front: { dx: 0, dy: 0 },
  back:  { dx: 0, dy: 0 }
};
```

Initialise at the two card-creation sites:
- Line ~968 (worker result push) — extend the `card:` literal.
- Line ~1036 (single-card synchronous path) — extend the `batchCards = [{...}]` literal.

Single-card editor reads/writes `batchCards[0].offset[side]`. No
separate global needed (mirror not required since `batchCards` is
always populated when the editor is visible).

Clamp range: `±100px` per axis (≈ ±10% of CR80 width / 16% of height).
Anything beyond that crops away too much real card area. Use
`clamp(v, -100, 100)`.

### W.3 Render insertion

Three minimal edits, identical pattern:

```js
// drawFiltered — line ~1650
var off = (batchCards[0] && batchCards[0].offset && batchCards[0].offset[side]) || { dx: 0, dy: 0 };
ctx.drawImage(srcCanvas, off.dx, off.dy, w, h);
```

```js
// drawFilteredToCanvas — line ~1187
// caller passes card index; resolve offset there or accept an `offset` arg
ctx.drawImage(srcCanvas, off.dx, off.dy, w, h);
```

```js
// applyBatchFilters — lines ~1203 and ~1216
var off = card.offset && card.offset.front || { dx:0, dy:0 };
ctxF.drawImage(card.originalFront, off.dx, off.dy, CR80_W, CR80_H);
// (same for back at 1216)
```

`drawFilteredToCanvas` currently has no card-index argument. Cleanest
fix: add an optional `offset` arg defaulting to `{dx:0, dy:0}` and
have the three call sites (lines 1114, 1115, 1229) resolve it from
their `card`/`batchCards[idx]` reference. ~6 lines.

Edge case — transparent strip: when `dx>0`, the left edge of the
destination is uncovered. Source PDFs render onto an opaque white
canvas during PDF.js extraction (see PDF render paths upstream), so
the destination canvas keeps the white fill from the prior
`ctx.fillRect`/`clearRect` step — visually equivalent to a white
margin, which is the desired "PVC card edge" look. **No background
fill needed.**

### W.4 UI — Move pad (CardXpress-style)

Insert a new block inside `.idp-editor` between the title row and
`.idp-sliders` (line ~448). Shown only when `batchCards.length === 1`
(V1 scope — multi-card batch needs a card picker which is out of
scope for this PR pair).

```html
<div class="idp-move" id="movePad">
  <div class="idp-move-row">
    <span class="idp-move-label">Move</span>
    <label><input type="radio" name="moveSide" value="front" checked> Front</label>
    <label><input type="radio" name="moveSide" value="back"> Back</label>
    <span class="idp-move-step">Step
      <input type="number" id="moveStep" value="5" min="1" max="50" step="1">px
    </span>
  </div>
  <div class="idp-move-pad">
    <button type="button" id="moveUp">↑</button>
    <button type="button" id="moveLeft">←</button>
    <button type="button" id="moveReset">⌖</button>
    <button type="button" id="moveRight">→</button>
    <button type="button" id="moveDown">↓</button>
    <span class="idp-move-readout" id="moveReadout">0, 0</span>
  </div>
</div>
```

Layout: 3-column grid for the pad (↑ centred top row, ← ⌖ → middle
row, ↓ centred bottom row) — matches CardXpress reference image. CSS
~10 lines using existing tokens (no new colours, no new fonts).

Visibility toggle: when `batchCards.length === 1`, remove
`idp-hidden` from `#movePad`; otherwise add it. Hook into the same
place the editor is shown (~line 1042).

### W.5 Listeners

```js
const movePad = $('#movePad');
const moveStep = $('#moveStep');
const moveReadout = $('#moveReadout');
const moveSideRadios = document.getElementsByName('moveSide');

function currentMoveSide() {
  for (const r of moveSideRadios) if (r.checked) return r.value;
  return 'front';
}
function nudge(axis, dir) {
  if (batchCards.length !== 1) return;
  const side = currentMoveSide();
  const step = Math.max(1, Math.min(50, parseInt(moveStep.value, 10) || 5));
  const o = batchCards[0].offset[side];
  o[axis] = Math.max(-100, Math.min(100, o[axis] + dir * step));
  moveReadout.textContent = o.dx + ', ' + o.dy;
  // re-render via the existing slider-change path
  onFilterChange();         // or whatever the slider handler is named
}
$('#moveUp').addEventListener('click',    () => nudge('dy', -1));
$('#moveDown').addEventListener('click',  () => nudge('dy',  1));
$('#moveLeft').addEventListener('click',  () => nudge('dx', -1));
$('#moveRight').addEventListener('click', () => nudge('dx',  1));
$('#moveReset').addEventListener('click', () => {
  if (batchCards.length !== 1) return;
  const side = currentMoveSide();
  batchCards[0].offset[side] = { dx: 0, dy: 0 };
  moveReadout.textContent = '0, 0';
  onFilterChange();
});
moveSideRadios.forEach(r => r.addEventListener('change', () => {
  const o = batchCards[0].offset[currentMoveSide()];
  moveReadout.textContent = o.dx + ', ' + o.dy;
}));
```

The slider re-render handler (around line 1655–1680) already calls
`drawFiltered(...)` for both sides and `applyBatchFilters()` for
batch mode — `nudge()` reuses that same function (likely named
`renderFiltered` / `redraw` / similar; confirm during code PR).

### W.6 Reset wiring

Two places:

1. `btnResetEdit` (Photo Adjust → Reset, ~line 448 + handler) — add
   `batchCards[0].offset = { front:{dx:0,dy:0}, back:{dx:0,dy:0} };`
   and `moveReadout.textContent = '0, 0';` to the existing handler.
2. Full reset at ~line 1762 (clears toggles when a new PDF is loaded
   or batch is cleared) — extend the existing forEach by zeroing
   any in-memory offsets and resetting the readout. Since
   `batchCards` is reassigned on PDF load, the per-card init at
   §W.2 covers fresh loads automatically.

### W.7 Estimated diff

| Area                                           | Lines |
|------------------------------------------------|-------|
| HTML (#movePad block)                          | ~20   |
| CSS (.idp-move / .idp-move-pad grid)           | ~15   |
| State init (2 sites + clamp helper)            | ~8    |
| `drawFilteredToCanvas` offset arg + 3 callers  | ~10   |
| `drawFiltered` + `applyBatchFilters` insertion | ~10   |
| Visibility toggle + DOM refs                   | ~10   |
| Listeners (6 handlers + side-change)           | ~30   |
| Reset wiring (2 sites)                         | ~10   |
| **Total (net)**                                | **~110–125** |

Within the ~120-line estimate from §V.4. Single-problem PR per Rule #12.

### W.8 V1 scope limits (NOT in this PR)

- **Batch-mode Move** (per-card editing in a batch of 5+ cards) — needs
  a card picker UI first. Defer to a follow-up.
- **Drag-to-move** on the preview canvas — V2; arrows are V1.
- **Keyboard arrows** — V2; on-screen buttons cover the primary use
  case (touch devices, print-shop counter staff).
- **Per-side independent Step values** — V1 uses a single step input
  applied to whichever side is selected.
- **Persistence across PDF reloads** — out of scope; offsets reset
  with each new PDF (matches CardXpress behaviour).

### W.9 Test plan (for the code PR)

1. Load `test-pdfs/pan-test.pdf` (pw `05071999`). Confirm Move pad
   appears, both readouts show `0, 0`.
2. Front + ↑×3 with step 5 → readout `0, -15`, photo nudges up,
   white strip appears at bottom edge of front preview. QR/HOLOGRAM
   stay in place (overlays at fixed coords).
3. Switch radio to Back → readout shows back's current `0, 0`. ↓×2
   → readout `0, 10`, back photo nudges down.
4. Reset button on Move pad → only the current side zeros.
5. Photo Adjust Reset → both sides + sliders zero together.
6. Generate PVC tray sheet → both cards land at the nudged crop
   confirming output pipeline carries the offset through.
7. Load `test-pdfs/aadhaar-test.pdf` (pw `SUNI1986`). Repeat steps
   2–3. Confirm Aadhaar QR/Mobile/Issue/Download masks stay at
   fixed coords when the photo nudges underneath.
8. Load a multi-page batch PDF → Move pad hides
   (`batchCards.length > 1`); existing batch flow unchanged.

### W.10 Acceptance

- Per-side `dx, dy` survive between side switches.
- Single Reset (Photo Adjust) zeroes Move + sliders together.
- Output sheets (A4 / Dragon / PVC tray / multi-card) reflect the
  per-side offset without any sheet-pipeline code change.
- Overlays (Aadhaar masks, PAN signature, PAN HOLOGRAM) remain at
  fixed coords irrespective of Move offsets.
- No regression in batch-mode rendering (Move pad hidden, existing
  pipeline untouched).


---

## §X ID Card Print Phase 4 P2 — Per-side Zoom (scale within CR80) research

**Status:** Research-only PR (Rule #14 first half). Code PR follows
after §W Move code lands so they can be tested together.

**Goal:** Match CardXpress "Zoom" dial — scale the front/back photo
inside the CR80 1011×638 frame (50%–200%) so users can fix
too-small ePAN scans (where the actual card is tiny on a big white
page) and too-large Aadhaar PDFs (where the card overflows the crop).
Pairs naturally with §W Move — Zoom alone is rarely useful, but
Zoom + Move covers ~95% of "my card looks weird" support tickets.

### X.1 Why this pairs with §W

Same architectural levers as §W:
- Same three filter passes (`drawFiltered`,
  `drawFilteredToCanvas`, `applyBatchFilters`) — see §W.1.
- Same per-card per-side state container — extend the §W shape, do
  **not** add a parallel one.
- Same "edit only when `batchCards.length === 1`" V1 scope.
- Same cached-`card.front`/`card.back` propagation to all output
  sheets (A4 / Dragon / PVC tray / multi-card) — no sheet-pipeline
  changes required.
- Same Photo Adjust Reset entry point.

This is why Move ships first: the state shape, listener pattern,
visibility toggle, and reset wiring all already exist after §W. §X
adds one number per side and one `ctx.scale` call per render path.

### X.2 State shape (extends §W)

```js
batchCards[i].offset = {
  front: { dx: 0, dy: 0, scale: 1 },
  back:  { dx: 0, dy: 0, scale: 1 }
};
```

Add `scale: 1` to the §W init at the two card-creation sites (lines
~968 and ~1036). Clamp `scale` to `[0.5, 2.0]`.

### X.3 Render insertion (centred zoom)

Zoom must scale around the **card centre** so the photo doesn't slide
to the top-left when zoomed in. Standard transform sandwich:

```js
function drawWithTransform(ctx, src, w, h, off) {
  ctx.save();
  ctx.translate(w / 2 + off.dx, h / 2 + off.dy);
  ctx.scale(off.scale, off.scale);
  ctx.drawImage(src, -w / 2, -h / 2, w, h);
  ctx.restore();
}
```

Replaces the §W-modified `ctx.drawImage(src, off.dx, off.dy, w, h)`
calls in all three filter passes:

- `drawFiltered` — line ~1650.
- `drawFilteredToCanvas` — line ~1187.
- `applyBatchFilters` — lines ~1203 and ~1216.

The `ctx.save`/`ctx.restore` matters because `ctx.filter` is set
just before the `drawImage` and we don't want the transform to leak
into the overlay calls that follow.

Edge cases:
- Zoom out (`scale < 1`): leaves blank strips on all 4 sides — same
  white-canvas-underneath behaviour as §W's transparent-strip case.
  No fill needed.
- Zoom in (`scale > 1`): photo overflows CR80; `drawImage` on the
  destination canvas naturally clips to the canvas bounds. No
  manual clipping required.
- Overlays still draw at fixed `(0,0)` coords (HOLOGRAM patch,
  signature box, Aadhaar masks) — `ctx.restore()` ensures the
  transform is gone before `applyPanOverlays` / `applyAadhaarMasks`
  run.

### X.4 UI — Zoom strip (CardXpress-style)

Add a single row inside the §W `#movePad` block, below the pad grid:

```html
<div class="idp-zoom-row">
  <span class="idp-move-label">Zoom</span>
  <button type="button" id="zoomOut">−</button>
  <input type="range" id="zoomSlider" min="50" max="200" value="100" step="5">
  <button type="button" id="zoomIn">+</button>
  <span class="idp-move-readout" id="zoomReadout">100%</span>
</div>
```

- Range slider 50–200 with step 5 (matches CardXpress dial granularity).
- −/+ buttons step by 10% per click.
- Readout shows current % for the selected side (reuses §W side radio).
- No new fonts, colours, or design tokens — reuses `.idp-move-*` styles.

### X.5 Listeners

```js
const zoomSlider = $('#zoomSlider');
const zoomReadout = $('#zoomReadout');

function setZoom(pct) {
  if (batchCards.length !== 1) return;
  const side = currentMoveSide();
  const s = Math.max(0.5, Math.min(2.0, pct / 100));
  batchCards[0].offset[side].scale = s;
  zoomReadout.textContent = Math.round(s * 100) + '%';
  zoomSlider.value = Math.round(s * 100);
  onFilterChange();
}
zoomSlider.addEventListener('input', () => setZoom(parseInt(zoomSlider.value, 10)));
$('#zoomIn').addEventListener('click',  () => setZoom(parseInt(zoomSlider.value, 10) + 10));
$('#zoomOut').addEventListener('click', () => setZoom(parseInt(zoomSlider.value, 10) - 10));
```

Side-radio change handler from §W extended to also refresh the zoom
readout/slider:

```js
moveSideRadios.forEach(r => r.addEventListener('change', () => {
  const o = batchCards[0].offset[currentMoveSide()];
  moveReadout.textContent = o.dx + ', ' + o.dy;
  zoomReadout.textContent = Math.round(o.scale * 100) + '%';
  zoomSlider.value = Math.round(o.scale * 100);
}));
```

### X.6 Reset wiring

Photo Adjust Reset (button at line ~448) — extend the §W reset to
also zero scale:

```js
batchCards[0].offset = {
  front: { dx: 0, dy: 0, scale: 1 },
  back:  { dx: 0, dy: 0, scale: 1 }
};
zoomReadout.textContent = '100%';
zoomSlider.value = 100;
```

Move pad reset button (`#moveReset` from §W) resets dx/dy only — does
**not** touch scale (separate semantic). To reset zoom, user can
double-click the slider thumb to 100% or press the centre of the
range.

### X.7 Estimated diff

| Area                                       | Lines |
|--------------------------------------------|-------|
| HTML (zoom row inside #movePad)            | ~10   |
| CSS (.idp-zoom-row layout)                 | ~8    |
| State init (extend §W defaults + clamp)    | ~4    |
| `drawWithTransform` helper                 | ~8    |
| Replace 4 drawImage call sites             | ~12   |
| DOM refs + listeners (3 handlers)          | ~20   |
| Side-change handler extension              | ~4    |
| Reset wiring (extend §W reset)             | ~6    |
| **Total (net)**                            | **~70–80** |

Within §V.4 estimate. Single problem per Rule #12 (Zoom is one
feature; pairs with Move at the architectural level but ships as its
own diff so reviewers can isolate the scale-transform behaviour).

### X.8 V1 scope limits (NOT in this PR)

- **Zoom around mouse cursor / pinch point** — V2; centred zoom is V1.
- **Independent X/Y scale** (anamorphic) — out of scope; uniform scale only.
- **Persistence across PDF reloads** — same as §W, out of scope.
- **Batch-mode Zoom** (per-card in 5+ batch) — needs the same card
  picker §W defers.
- **Keyboard shortcuts** (`+`/`-` / scroll wheel) — V2.

### X.9 Test plan (for the code PR)

1. Land §W Move code first. Confirm Move pad works.
2. Apply §X. Load `test-pdfs/pan-test.pdf` (pw `05071999`).
3. Front + zoom slider to 150% → photo zooms in around centre, edges
   crop equally on all 4 sides. Readout `150%`.
4. Switch to Back radio → readout reverts to back's `100%`.
5. Front + Move ↑×3 + Zoom 130% → Move and Zoom compose correctly
   (zoomed photo nudged up).
6. Zoom out to 70% → photo shrinks centred, white margin appears on
   all 4 sides. PAN HOLOGRAM patch (back) and signature box (front)
   stay at their fixed coords — they do **not** shrink.
7. Photo Adjust Reset → both Move (dx/dy) and Zoom (scale) zero
   together for both sides; sliders reset; readouts reset.
8. Generate PVC tray + 5-Pairs + Dragon sheets → Move + Zoom carry
   through to all output sheets via the cached `card.front`/`card.back`.
9. Load `test-pdfs/aadhaar-test.pdf` (pw `SUNI1986`) → repeat 3, 6.
   Aadhaar QR/Mobile/Issue/Download masks stay at fixed coords when
   the photo zooms underneath.
10. Multi-page batch PDF → Move + Zoom controls hide; existing batch
    flow unchanged.

### X.10 Acceptance

- Zoom is centred (no slide to top-left when zoomed in).
- Move and Zoom compose correctly (translate → scale → drawImage).
- Single Photo Adjust Reset zeroes Move + Zoom + sliders together.
- Output sheets reflect both transforms with no sheet-pipeline change.
- Overlays (Aadhaar masks, PAN signature, PAN HOLOGRAM) remain at
  fixed coords irrespective of Zoom or Move.
- `ctx.save`/`ctx.restore` brackets every transform so subsequent
  overlay draws are unaffected.
- No regression in batch-mode rendering.

