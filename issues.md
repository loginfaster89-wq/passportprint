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
| F9 | home `/` | desktop 1440 | nit | "MOST POPULAR" ribbon on the Monthly pricing card sits **on the border** (negative top position). On desktop the badge partially overhangs the card's rounded corner. Looks intentional but at 1440px the overlap renders as slightly misaligned. Inspect the `::before` offset at the desktop breakpoint. |
| F10 | home `/` | desktop 1440 | nit | `Tools preview` card header has three circles that mimic macOS window-chrome red/yellow/green, but all three are styled with amber (two gray, one orange). Reads as a broken/loading browser chrome to some users. Pick a clearer visual metaphor or drop the window chrome entirely. |
| F11 | `passport-photo.html` | desktop 1440 | nit | At 1440×900, almost the entire lower half of the viewport (below the upload card, above the footer) is empty black space. Consider raising the footer or adding a "While you wait, try…" section to pull the fold up. |
| F12 | home `/` | all | medium | **Emoji icons** (`🪪 🏠 ⏱️ 🔒 🖨️ ⚡ 📤 🤖 🔍 📸 📇 📃 ✂️`) are used throughout feature / audience / why / steps / tools-preview sections. Cross-platform emoji rendering varies significantly (Apple-color, Google Noto, Windows Segoe) — some Android devices render `🪪` as `□` (no glyph). Swap for consistent SVG icons (Feather / Lucide / Phosphor) for brand consistency. Tokens/fonts stay locked per project rules; SVG icons don't add new fonts. |

## B. "2026 multinational" polish gaps

These are NOT bugs — they're positioning/presentation gaps if the goal
is to make Studio Print feel like a polished 2026 multinational product
rather than a well-built indie tool. Each is a candidate logical task
for a follow-up PR.

| # | Area | Finding / suggestion |
|---|------|---------------------|
| P1 | Hero | Static background (radial glow + grid pattern). Add a subtle **animated gradient pulse** on the accent glow (6-8 s ease loop) and a low-amplitude parallax on the grid pattern tied to scroll. Preserves the palette, adds life. |
| P2 | Hero | No **product visual**. Add a real mockup of the passport-photo tool output (an A4 sheet with cutting lines and 5 passport photos arranged on it) floating in the hero, subtly rotated. Converts "what is this?" to "oh, I see" in 1 s. |
| ~~P3~~ | Cards (features/why/steps/audience/pricing) | **resolved PR #76.** `.why/.step/.audience/.pricing-card` pe `transition` + `:hover{translateY(-4px); amber-tinted shadow}`. Uses existing tokens. |
| P4 | Icons | Replace emoji with a consistent SVG icon pack (see F12). Lucide icons are MIT-licensed, small, and render consistently. |
| P5 | Motion | No scroll-reveal anywhere. Add a single lightweight `IntersectionObserver` that toggles `.in-view { opacity:1; transform:translateY(0);}` on sections as they enter the viewport. Keep durations short (250 ms) — no AOS-style bounces. |
| P6 | FAQ | Native `<details>` accordion jumps open/close with no transition and the `+` sign stays as `+`. Polish: use `details[open] summary::after { content:"−"; }` + CSS `grid-template-rows` transition trick (or tiny JS) for smooth slide-open. |
| ~~P7~~ | Hero CTAs | **resolved PR #76** (tactile half). `.btn:active{transform:scale(.97);}` aur `.pricing-card .pcta:active` bhi. Optional spinner on primary CTA during nav still open — separate item if we want that. |
| P8 | Social proof | Homepage has no testimonials, no "used by N shops", no logo strip, no press mentions. A multinational feel needs at least one of: a testimonials section, a "trusted by" row, or concrete numbers ("5,000 passport photos printed this month"). |
| P9 | About page | Wall of text. Needs: a mission-hero with a large founder quote, a timeline of 2024→2026 roadmap, a "What ships next" card. Re-use existing tokens, no new fonts. |
| P10 | Contact page | Static email + "email us" copy. Multinational polish: an inline contact form (name, email, message, category) POSTed to an existing serverless endpoint or to `mailto:` as a fallback. Also: response-time SLA visible in a badge. |
| P11 | Pricing | No **monthly/yearly toggle**. Even though you only have weekly+monthly today, a toggle that shows "₹149/month → ₹1,499/year (save 16%)" preview would frame Monthly as the default and prime upsell. (Requires backend change later; phase 1 can be copy-only.) |
| P12 | Pricing | No comparison matrix ("Free vs Weekly vs Monthly" feature table). Multinational SaaS standard. |
| P13 | Pricing | Card border glow on the "Most Popular" (Monthly) card is amber but doesn't pulse / shimmer. A one-frame-per-second low-opacity glow ping would draw the eye without being annoying. |
| P14 | Navigation | No **sticky CTA on mobile** when scrolling past the hero. A floating "Open Passport Photo →" pill anchored to `bottom:16px; right:16px` on `≤640px` after scroll > 1× viewport height improves conversion a lot. |
| P15 | Footer | Single-row footer (`Home · About · Privacy · Terms · Refund · Delivery · Contact`). Multinational: multi-column — **Product** / **Resources** / **Company** / **Legal** + a newsletter signup field + social icons + locale switcher. |
| P16 | Internationalisation | No language switcher. Hindi copy was removed (SKILL §5), but adding `हि` ↔ `EN` toggle for Indian multinational feel would be a 1-day add. Current copy is English-only — acceptable, but a locale selector UI affordance signals "we thought about it". |
| ~~P17~~ | Accessibility | **resolved PR #76.** Site-wide `:focus-visible{outline:2px solid var(--accent); outline-offset:2px}` added to `assets/legal.css`, with `:focus{outline:none}` fallback so mouse clicks don't show rings. Keyboard users now get a clean amber ring on nav links, Features dropdown, Login button, `<details>`, form elements. |
| P18 | Accessibility | `<details>` FAQ items don't have unique `id`s — deep-linking to a specific question (e.g. `/#faq-is-it-free`) is impossible. Add stable slugs on each `<details>`. |
| P19 | Product-demo | No **inline product demo / video** on the homepage. A 10-15 s muted autoplay `<video>` loop inside the tools-preview card (real tool, sped up) proves the product without requiring a click. |
| P20 | Loading / perceived perf | No skeleton shimmer anywhere. `passport-photo.html` loads transformers.js (~large). On first visit there's no indication that a heavier model is being downloaded. Add a top-of-page thin progress bar for AI-model download. |
| P21 | Error / empty states | Haven't been able to audit them without signing in, but from code review `passport-photo.html` has toast-based errors only. A small "something went wrong — retry" inline banner near the upload zone would feel more polished. |
| P22 | SEO / social | `og:image` points at `apple-touch-icon.png` (a 180×180 rounded-corner icon). WhatsApp / Twitter / LinkedIn unfurls will show a tiny square. Generate a proper 1200×630 OG image (product shot + tagline). |
| P23 | SEO | `sitemap.xml` only lists the 8 pages. Worth adding per-feature anchor landing targets (`/#pricing`, `/#how`, `/#features`) with `<lastmod>`. |
| P24 | Performance | Fonts are loaded from Google Fonts CDN (`fonts.googleapis.com`). Self-hosting Syne + DM Mono (woff2, subset to Latin + ₹) removes a third-party request and shaves 100–200 ms FCP. |
| P25 | Performance | `preconnect` to Render backend on home is smart but users who deep-link directly to `/passport-photo.html` still pay the full cold-start. Add the same `<link rel="preconnect" href="https://passportprint-studio.onrender.com">` to **every** shared header page, not just `index.html`. |
| P26 | Cookies / privacy | No cookie banner. India has no strict cookie-consent law yet, but EU / UK visitors expect one and the Google Identity SDK drops cookies. A lightweight self-hosted banner ("We only use essential cookies for login. [OK]") is enough for global polish. |
| P27 | Tooling | No 404 page. Hitting `/anything-else.html` returns the default Cloudflare Pages 404 — not on-brand. Ship a `404.html` using the shared `legal-header` / `legal-footer`. |
| P28 | Tooling | No PWA manifest / service worker. The whole value prop is "on-device AI" — making the site installable and offline-capable for `passport-photo.html` would be a genuine differentiator, not a gimmick. |
| P29 | Passport-photo step bar | Static 1→2→3→4 pills. At 2026 polish level, fill a progress line as steps complete (with a 300 ms ease), highlight the active pill with the accent glow. |
| P30 | Homepage density | Homepage is 6380 px tall on desktop (current audit measured). Every section is "header + 1 sentence + grid of cards + dots" — feels repetitive. Consider a single "live product" section between HERO and FEATURES (a real working mini-demo, or an embedded screenshot stack), to break the rhythm. |

## C. Suggested PR sequence for the fixing session

Ordered by impact / ease, one logical task per PR, minimum diff each:

1. ~~**F1**~~ — merged PR #70.
2. ~~**F2**~~ — merged PR #71.
3. ~~**F4**~~ — merged PR #74.
4. ~~**F3**~~ — merged PR #73.
5. ~~**P3 + P7 + P17**~~ — PR #76 (card hover lift + button active state + focus-visible rings, one CSS-only pass).
6. ~~**F8**~~ — PR #77 (email obfuscation on about / contact).
7. ~~**F5**~~ — PR #78 (pricing-card heights balanced at 820).
8. **P6** — FAQ open/close smooth transition + `+`/`−` toggle.
9. **P14** — Mobile sticky CTA pill.
10. **P22** — Generate proper 1200×630 OG image and swap meta tags.
11. **F9** — Most-Popular ribbon alignment at 1440.
12. **F10** — Tools-preview window-chrome dots clarity.
13. **F12 / P4** — Emoji → SVG icon pack (cross-platform consistency, larger diff).

Everything else from section B is a multi-PR roadmap — pick per session.
