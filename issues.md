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
| F6 | home `/` | all | nit | The `.audience-grid` has only **2 cards** ("Print shops & photo studios" / "Home users, students & parents"). On desktop this produces a wide empty column to the right (grid defined as `repeat(auto-fit, minmax(…,1fr))` → 2 full-width cards). Section feels sparse for the amount of vertical space it occupies. Either add a 3rd audience card (e.g. "Teachers / certificate printers") or shrink the gap and centre the 2 cards with `max-width`. |
| F7 | `passport-photo.html` | all | nit | Console noise: four `Unrecognized feature: 'publickey-credentials-create' / 'web-share' / 'local-network-access' / 'loopback-network'.` warnings on every load. These come from the `<iframe>` Google GSI injects; Chrome doesn't recognise some Permissions-Policy tokens the GSI iframe requests. Not our code, but clutters the console. Harmless — keep an eye on it if the GSI SDK is ever updated. |
| ~~F8~~ | `about.html`, `contact.html` | all | **resolved PR #77** | Email `loginfaster89@gmail.com` was exposed as plain text (clickable `mailto:` + visible text) on both pages. Scrapable by spam bots within days. Fixed via `<a class="email-obf" data-u="…" data-d="…">` + tiny per-page IIFE that assembles the mailto on DOMContentLoaded. A contact form (P10) is still the full fix. |
| ~~F9~~ | home `/` | desktop 1440 | **resolved PR #80.** Ribbon re-centered on the card's top edge. |
| ~~F10~~ | home `/` | desktop 1440 | **resolved PR #81.** Fake window-chrome dots replaced with a single live-preview indicator. |
| F11 | `passport-photo.html` | desktop 1440 | nit | At 1440×900, almost the entire lower half of the viewport (below the upload card, above the footer) is empty black space. Consider raising the footer or adding a "While you wait, try…" section to pull the fold up. |
| ~~F12~~ | home `/` | all | **resolved PR #85.** Emoji replaced with inline Lucide-style SVG sprite (`<use href="#i-…">`). No new fonts/deps. |

## B. "2026 multinational" polish gaps

These are NOT bugs — they're positioning/presentation gaps if the goal
is to make Studio Print feel like a polished 2026 multinational product
rather than a well-built indie tool. Each is a candidate logical task
for a follow-up PR.

| # | Area | Finding / suggestion |
|---|------|---------------------|
| P1 | Hero | Static background (radial glow + grid pattern). Add a subtle **animated gradient pulse** on the accent glow (6-8 s ease loop) and a low-amplitude parallax on the grid pattern tied to scroll. Preserves the palette, adds life. |
| ~~P2~~ | Hero | **resolved PR #100.** Two decorative A4 passport-photo sheets (left -11°, right +9°) in hero with dashed cut marks + five 5×1 silhouette placeholders (matches post-PR-#58 sheet default). Pure CSS, no raster/SVG asset. Respects `prefers-reduced-motion` + hides on narrow screens. |
| ~~P3~~ | Cards (features/why/steps/audience/pricing) | **resolved PR #76.** `.why/.step/.audience/.pricing-card` pe `transition` + `:hover{translateY(-4px); amber-tinted shadow}`. Uses existing tokens. |
| P4 | Icons | Replace emoji with a consistent SVG icon pack (see F12). Lucide icons are MIT-licensed, small, and render consistently. |
| ~~P5~~ | Motion | **resolved PR #91.** New `assets/reveal.js` + `.reveal/.in-view` CSS on homepage: 6 sections + CTA band fade + slide up (14 px → 0, 450 ms) once on first enter. One-shot observer, respects `prefers-reduced-motion`. |
| ~~P6~~ | FAQ | **resolved PR #82.** `details[open] summary::after{content:"−"}` + soft `faq-fade` keyframe on `.faq-body` for smooth open. |
| ~~P7~~ | Hero CTAs | **resolved PR #76** (tactile half). `.btn:active{transform:scale(.97);}` aur `.pricing-card .pcta:active` bhi. Optional spinner on primary CTA during nav still open — separate item if we want that. |
| P8 | Social proof | Homepage has no testimonials, no "used by N shops", no logo strip, no press mentions. A multinational feel needs at least one of: a testimonials section, a "trusted by" row, or concrete numbers ("5,000 passport photos printed this month"). |
| ~~P9~~ | About page | **resolved PR #96.** Mission-hero (`Make every ₹10 print job feel like a browser tab.`) + founder-style pull-quote + 2024→2026 timeline (Idea / Prototype / Launch / Now) + 'What ships next' card (4 upcoming tools). Inline styles only, existing tokens. |
| ~~P10~~ | Contact page | **resolved PR #98.** Inline `Send us a message` form on `contact.html` (name / email / 7-option category / message), `Replies within 1–2 working days` SLA badge, submit builds a prefilled `mailto:` with structured body. Obfuscated email block kept as fallback. |
| P11 | Pricing | No **monthly/yearly toggle**. Even though you only have weekly+monthly today, a toggle that shows "₹149/month → ₹1,499/year (save 16%)" preview would frame Monthly as the default and prime upsell. (Requires backend change later; phase 1 can be copy-only.) |
| P12 | Pricing | No comparison matrix ("Free vs Weekly vs Monthly" feature table). Multinational SaaS standard. |
| ~~P13~~ | Pricing | **resolved PR #89.** `ribbon-pulse` + `featured-glow` keyframes on `.pricing-card.featured::before` and `.pricing-card.featured` (3.2s infinite, 0.45 → 0.75 alpha). Disabled under `prefers-reduced-motion`. |
| ~~P14~~ | Navigation | **resolved PR #83.** `.sp-mobile-cta` pill on `≤640px`, shows after scroll > 1 viewport. |
| ~~P15~~ | Footer | **resolved PR #95.** Multi-column footer — Product / Resources / Company / Legal + newsletter signup + social icon + locale switcher. Shared across all 8 pages via `legal.css` + `assets/footer.js`. |
| P16 | Internationalisation | No language switcher. Hindi copy was removed (SKILL §5), but adding `हि` ↔ `EN` toggle for Indian multinational feel would be a 1-day add. Current copy is English-only — acceptable, but a locale selector UI affordance signals "we thought about it". |
| ~~P17~~ | Accessibility | **resolved PR #76.** Site-wide `:focus-visible{outline:2px solid var(--accent); outline-offset:2px}` added to `assets/legal.css`, with `:focus{outline:none}` fallback so mouse clicks don't show rings. Keyboard users now get a clean amber ring on nav links, Features dropdown, Login button, `<details>`, form elements. |
| ~~P18~~ | Accessibility | **resolved PR #88.** Stable ids on all 8 FAQs (`faq-free-tier`, `faq-privacy`, `faq-countries`, `faq-no-software`, `faq-aadhaar-pan`, `faq-mobile`, `faq-refund`, `faq-print-shop`) + small IIFE opens the targeted `<details>` on hash match and smooth-scrolls. |
| ~~P19~~ | Product-demo | **resolved PR #99.** Inline animated demo strip inside the hero tools-preview card on `index.html`: 3-phase ~9 s loop (upload → background removed → A4 sheet slides in). Pure CSS + tiny DOM primitives, no `<video>` asset. Respects `prefers-reduced-motion`. |
| P20 | Loading / perceived perf | No skeleton shimmer anywhere. `passport-photo.html` loads transformers.js (~large). On first visit there's no indication that a heavier model is being downloaded. Add a top-of-page thin progress bar for AI-model download. |
| P21 | Error / empty states | Haven't been able to audit them without signing in, but from code review `passport-photo.html` has toast-based errors only. A small "something went wrong — retry" inline banner near the upload zone would feel more polished. |
| ~~P22~~ | SEO / social | **resolved PR #84.** Proper 1200×630 `assets/og-image.png` + richer social meta across 8 pages. |
| ~~P23~~ | SEO | **resolved PR #90.** `<lastmod>2026-04-23</lastmod>` on every entry + 4 in-page landing sections (`/#features`, `/#how`, `/#pricing`, `/#faq`) with their own priorities. |
| P24 | Performance | Fonts are loaded from Google Fonts CDN (`fonts.googleapis.com`). Self-hosting Syne + DM Mono (woff2, subset to Latin + ₹) removes a third-party request and shaves 100–200 ms FCP. |
| ~~P25~~ | Performance | **resolved PR #87.** Backend preconnect added to all 7 shared-header pages (about/contact/privacy/terms/refund/shipping/404). |
| P26 | Cookies / privacy | No cookie banner. India has no strict cookie-consent law yet, but EU / UK visitors expect one and the Google Identity SDK drops cookies. A lightweight self-hosted banner ("We only use essential cookies for login. [OK]") is enough for global polish. |
| ~~P27~~ | Tooling | **resolved PR #86.** Branded `404.html` with shared legal-header/footer, big amber "404" numeral, two CTAs, `noindex` meta, build.js now minifies it into `dist/`. |
| ~~P28~~ | Tooling | **resolved PRs #93 + #94.** `assets/manifest.webmanifest` + installable icons on index + 7 legal pages (PR #93); `sw.js` with network-first HTML + stale-while-revalidate assets + `/offline.html` fallback (PR #94). Registered via `assets/pwa.js`. |
| P29 | Passport-photo step bar | Static 1→2→3→4 pills. At 2026 polish level, fill a progress line as steps complete (with a 300 ms ease), highlight the active pill with the accent glow. |
| P30 | Homepage density | Homepage is 6380 px tall on desktop (current audit measured). Every section is "header + 1 sentence + grid of cards + dots" — feels repetitive. Consider a single "live product" section between HERO and FEATURES (a real working mini-demo, or an embedded screenshot stack), to break the rhythm. |

## C. Suggested PR sequence

All of the quick-win queue from the 2026-04-23 audit is now merged. The**open backlog** for future sessions (larger scope, pick per session):

**Functional nits remaining:**
- `F6` audience grid sparse (2 cards on desktop) — either add 3rd card or `max-width` + centre.
- `F7` GSI iframe Permissions-Policy console warnings — not our code; monitor on SDK updates.
- `F11` passport-photo 1440 empty space below upload card — **locked file**, needs explicit user approval.

**2026 polish roadmap (ordered by impact):**
1. **P8** — Social proof (testimonials / "trusted by" logo row / concrete numbers).
2. **P11** — Pricing monthly/yearly toggle (copy-only phase 1).
3. **P12** — Pricing comparison matrix (Free vs Weekly vs Monthly feature table).
4. **P1** — Hero animated gradient pulse on accent glow (CSS-only).
5. **P30** — Homepage density break — one real "live demo" section between HERO and FEATURES.
6. **P24** — Self-host Syne + DM Mono fonts (woff2 subset) — removes Google Fonts third-party.
7. **P16** — Language switcher (`हि` ↔ `EN`) UI affordance.
8. **P26** — Cookie banner (self-hosted, essential-only).

**Recently resolved (since last audit refresh):** P10 contact form (PR #98), P19 inline tools-preview demo strip (PR #99), P2 hero A4-sheet mockup (PR #100).

**Locked-file items (needs user approval to touch `passport-photo.html`):**
- `F1` Razorpay `/build/undefined` 403 residual (payment flow works, SDK's own bug).
- `F11` 1440 empty space below upload card.
- `P20` top-of-page thin progress bar for AI-model download.
- `P21` inline "something went wrong — retry" banner near upload zone.
- `P29` step-bar progress line fill animation.

Section B items not listed above are still open but lower-impact — revisit as the project owner picks priorities.
