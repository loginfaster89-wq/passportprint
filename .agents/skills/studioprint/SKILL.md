# Studio Print — Devin skill (condensed recipe)

Short checklist for Devin sessions on `loginfaster89-wq/passportprint`.
Deeper context lives in `AGENTS.md` at the repo root — read that file too,
this is just the "what do I run, what do I avoid" cheat sheet.

## 1. Clone & build

```bash
# Clone (PAT is already a repo-scoped secret: GITHUB_PAT_PASSPORTPRINT)
git clone "https://x-access-token:${GITHUB_PAT_PASSPORTPRINT}@github.com/loginfaster89-wq/passportprint.git"
cd passportprint
npm install
npm run build              # minified + obfuscated → ./dist
npx http-server dist -p 8080
# or: python3 -m http.server 8080 --directory dist
```

No dev server — edit source, `npm run build`, preview from `dist/`.
`npm run clean` removes `dist/`.

## 2. Hard rules (do NOT break these)

1. **`passport-photo.html` is editable — but minimum-diff only.** 5000+
   line working feature with its own inline copies of nav / auth / header
   plus a hash-open script (`#plans`, `#buy-<planId>`). Shared-module
   changes elsewhere must stay compatible with those inline copies.
   (Previously locked, unlocked 2026-04-24 at the owner's request —
   PR #109 U1 buy-flow was the first approved edit.)
2. **Never edit `.github/workflows/*.yml`** unless user confirms the PAT
   has `Actions: Read and write` (default fine-grained PAT only has
   Contents + Pull requests).
3. **Fonts, palette, CSS tokens are locked.** `Syne` (headings), `DM Mono`
   (body), `--bg: #0D0D0D`, `--accent: #F0A500`, etc. Use the existing
   vars in `assets/legal.css`; don't add new colour/spacing tokens.
4. **One PR per logical task, minimum diff.** No drive-by refactors.
5. **No secrets in commits.** Razorpay keys, Google OAuth secrets,
   `CLOUDFLARE_API_TOKEN`, `GITHUB_PAT_*` all live only in GitHub /
   Render settings.
6. **Shared header/nav/auth** = `assets/legal.css`, `assets/nav.js`,
   `assets/auth.js`, `assets/auth.css`. Don't fork into per-page copies.
7. **Pricing numbers** (free: 2 sheets/day; weekly: ₹59/7 days; monthly:
   ₹149/30 days) appear in `index.html`, `terms.html`, `refund.html`,
   `shipping.html`. If one changes, update all four.

## 3. Create a PR (fine-grained PAT flow)

`git_pr` / `list_repos` often return "Not Found" because the session's
GitHub user isn't the repo owner. Fall back to REST with the PAT:

```bash
# After commit + push
cat > /tmp/pr_body.json <<'JSON'
{
  "title": "Short, present-tense summary",
  "head": "devin/<timestamp>-<slug>",
  "base": "main",
  "body": "## What\n...\n\n## Why\n...\n\n## Change\n...\n\n## Scope\n..."
}
JSON

curl -sS -X POST \
  -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d @/tmp/pr_body.json \
  https://api.github.com/repos/loginfaster89-wq/passportprint/pulls
```

Branch convention: `devin/<unix-timestamp>-<short-slug>`.

## 4. Deploy

- **Primary:** Cloudflare Pages, project name `studioprint`.
  `.github/workflows/deploy.yml` on every `main` push:
  `npm ci` → `npm run build` → `wrangler pages deploy dist --project-name=studioprint`.
- **Fallback:** Netlify (`netlify.toml`).
- CF Pages statuses don't post back to PRs. To verify:
  `curl https://studioprint.pages.dev` — prod URL propagation 10–60s;
  per-deploy hash URL is instant.
- Manual `wrangler` fallback: see `CLOUDFLARE_DEPLOY.md`.

## 5. 2026 copy tone (post PR #61)

- Hero: **"Every print job. One browser tab."** (accent on second line)
- Eyebrow: `ON-DEVICE AI · BUILT IN INDIA · NEW IN 2026`
- CTA heading: "Your next print job — right in this tab."
- Passport-photo page title + plan tags refreshed to match.
- English only — Hindi copy was removed site-wide in PR #60.

Keep future copy in that same confident, terse, non-salesy register.

## 6. Homepage grid → slider behaviour (post PR #64 / #65)

`assets/sliders.js` (plain, not obfuscated) adds `.is-slider` to
`.why-grid`, `.features-grid`, `.audience-grid`, `.steps-grid` when:
- viewport ≤ 760px, **or**
- any row has an orphan (right edge trails widest row by > 10px).

If you touch that script, smoke-test at 820px (iPad Air), 1280px
(desktop), 375px (iPhone SE). 820px must show 1 row + 4 dots; 1280px
must show plain grid; 375px must show slider.

## 7. Shared header layout (post PR #54 / #66)

```html
<header class="legal-header">
  <a href="index.html" class="logo">Studio <em>Print</em></a>
  <nav id="primaryNav">…links…</nav>
  <button class="nav-login" id="hdrAuthBtn">Login</button>
  <button class="nav-toggle" aria-controls="primaryNav">☰</button>
</header>
```

`#hdrAuthBtn` sits **outside** `<nav>` so Login is visible beside the
☰ on mobile without expanding the drawer. At ≤900px `<nav>` becomes
`position:absolute` — only `.nav-login` gets `margin-left:auto`;
`.nav-toggle` is explicitly `margin-left:0` so both pin right together
(PR #66 fix — was previously splitting flex free space between them
and centering the Login button).

`passport-photo.html` has its own inline copy of this CSS — don't try
to dedupe it from here.

## 8. Communication style (quota-conscious)

- **Hinglish, zero jargon.** The project owner has explicitly said
  "muje coding ke baare main kuch nhi pta hai" — assume the reader does
  not know code, stack traces, network tooling, or CI/CD. Translate
  every technical finding into plain consequences: kya toota, kya kaam
  kar raha hai, kya decision chahiye.
- **Never paste** stack traces, CDP initiator dumps, Playwright logs,
  minified JS snippets, HTTP status codes, or internal symbol names in
  user messages. Keep that evidence in the PR body / commit message
  only.
- **Lead with the decision, not the investigation.** First line should
  tell the user what's fixed / what's broken / what choice they need to
  make. Details only if asked.
- **Short plan → get approval → implement.** One PR per logical task.
- **Concise updates only** — don't message after every tool call.
- Before reporting done: `npm run build` locally.
- Keep backend / CI / CD internals brief unless asked.
- **Quota-conscious:** the owner watches daily quota. If they flag it
  mid-task, drop to the most terse mode possible — fewer tool calls,
  no speculative exploration, no re-explaining already-agreed plans.

## 9. Known issues from the 2026-04-23 full-site audit

See `issues.md` at the repo root for the full findings table. This skill
just lists what's closed and what's still open so the next session
doesn't re-fix already-merged work.

**All quick-win queue items are now merged (do NOT re-fix):**
- `F1` Razorpay decl. script → PR #70. `F2` One-Tap auto-prompt → PR #71.
- `F3` features 820 heights → PR #73. `F4` hero H1 wrap → PR #74.
- `F5` pricing 820 heights → PR #78. `F8` email obfuscation → PR #77.
- `F9` ribbon centering → PR #80. `F10` preview chrome → PR #81.
- `F12/P4` SVG icon pack → PR #85.
- `P3+P7+P17` card/button/focus polish → PR #76.
- `P6` FAQ smooth open + `−` toggle → PR #82.
- `P13` Most-Popular ribbon pulse → PR #89.
- `P14` mobile sticky CTA pill → PR #83.
- `P18` FAQ deep-link IDs + auto-open → PR #88.
- `P22` 1200×630 OG image → PR #84.
- `P23` sitemap.xml lastmod + anchors → PR #90.
- `P25` backend preconnect on all legal pages → PR #87.
- `P27` branded 404 page → PR #86.
- `P5` scroll-reveal IntersectionObserver → PR #91.
- `P28` PWA manifest + installable icons → PR #93.
- `P28` offline-capable SW + `/offline.html` fallback → PR #94.
- `P15` multi-column footer (Product/Resources/Company/Legal + newsletter + social + locale) → PR #95.
- `P9` About page rework (mission-hero + timeline + ships-next card) → PR #96.
- `P10` contact form (name/email/category/message + SLA badge + mailto fallback) → PR #98.
- `P19` inline tools-preview demo strip (upload → bg-removed → A4 sheet, 9 s loop) → PR #99.
- `P2` hero A4-sheet mockups (two floating CSS sheets, pure CSS no raster) → PR #100.
- `P1` hero animated accent-glow pulse (7 s CSS-only loop, reduced-motion safe) → PR #102.
- `P8` `By the numbers` honest facts strip (4 stat cards, no testimonials) → PR #103.
- `R1` hero H1 clamp floor + `R2` `.hero-sheet.right` clamp + `R3` 820 px hide breakpoint + `R5` 24 px slider-dot tap area + `R6` footer link `padding-block` → PR #108.
- `U1` pricing buy-flow: homepage CTAs → `passport-photo.html#buy-<planId>` → `startCheckout(planId)` direct. Plan-picker middle step skipped. → PR #109.
- Policy unlock of `passport-photo.html` (locked-file rule lifted → minimum-diff rule in Hard rule #1) → PR #110.

**Open backlog (default priority order for next session):**

*Functional nits:* `F6` audience grid sparse, `F7` GSI iframe warnings
(harmless, not our code), `F11` passport-photo 1440 empty space
(passport-photo edit, minimum-diff).

*2026 polish roadmap (by impact):*
1. `P11` Pricing monthly/yearly toggle (copy-only phase 1) — highest value.
2. `P12` Pricing comparison matrix.
3. `P30` Homepage density break — live-demo section between HERO/FEATURES.
4. `P24` Self-host Syne + DM Mono (woff2 subset).
5. `P16` Language switcher UI affordance.
6. `P26` Cookie banner (self-hosted, essentials-only).

*Responsive + flow audit 2026-04-24 (details in `issues.md` §D):*
R1/R2/R3/R5/R6 shipped in PR #108 and U1 in PR #109 — see 'merged'
list above. Still open:
- `R4` passport-photo upload-card frame-corners clip at iPhone SE
  (low priority, `passport-photo.html` edit — minimum-diff).
- `R7` No dedicated 768 px hero breakpoint (optional polish).

*Passport-photo-specific backlog* (file is no longer locked, but still
requires minimum-diff care — see Hard rule #1): `F11` 1440 empty space,
`P20` AI-model download progress bar, `P21` inline error banner,
`P29` step-bar progress fill, `R4` frame-corners clip at 375 px.
(`U1` was this track's first unlock — shipped in PR #109.)

**How to audit again (reproducible)**

```bash
# 3 viewports × 8 pages via Playwright, ~30 s.
mkdir -p /home/ubuntu/audit-evidence
# See the script committed to issues.md's reference section; run:
python3 -c "import playwright" || pip install playwright && playwright install chromium
# Then adapt the PAGES/VIEWPORTS list in your script and iterate.
```

When auditing: check `audit.json` for `hasHScroll`, `brokenImages`,
`consoleErrors`, `netErrors`. Per-page `logs/<page>__<viewport>.json`
has full console + network.

## 10. Related repos

- Frontend (this repo): `loginfaster89-wq/passportprint`
- Backend: `loginfaster89-wq/PassportPrint-Studio` — Node/Express on
  Render. Handles auth (email OTP + Google), Razorpay, `/api/me`,
  `/api/google-login`, `/api/delete-account`. URL hardcoded as
  `https://passportprint-studio.onrender.com` in `passport-photo.html`
  and `assets/auth.js`.

## 11. Ready-to-paste prompt for a new Devin chat

Copy the block below into a fresh Devin session. It self-contains
repo / PAT / rules and points the session at the current top-priority
backlog item. Swap in a different backlog item (from §9) if you want
to work on something else that session.

```
Studio Print frontend par kaam karo.
Repo: loginfaster89-wq/passportprint (private)
PAT: GITHUB_PAT_PASSPORTPRINT (fine-grained, repo-scoped —
Contents + Pull requests: Read and write on this repo). Agar saved
secret na mile to session-only provide karunga.

Clone ke baad pehle ye teen files padho:
1. .agents/skills/studioprint/SKILL.md — Devin recipe (build/preview,
   hard rules, PAT curl snippet, Hinglish style, §9 merged/open backlog).
2. AGENTS.md — full source of truth.
3. issues.md — 2026-04-23 site audit + 2026-04-24 §D responsive / flow
   follow-up (R1–R7, U1). R1/R2/R3/R5/R6 shipped PR #108; U1 shipped
   PR #109; `passport-photo.html` unlocked in PR #110.

## Aaj ka kaam — Homepage-direct checkout (shared module refactor)

**User-reported (2026-04-24):** Homepage pricing cards se `Get weekly pass`
/ `Get monthly pass` click karne par user ko pehle `passport-photo.html`
par redirect hota hai, tab jakar Razorpay / Complete Payment modal khulta
hai. Expected behaviour — Razorpay modal homepage par hi khule, koi page
navigation nahi. PR #109 (U1 buy-flow) ne plan-picker middle step hata
diya tha, par redirect still happens kyunki checkout ka saara code sirf
`passport-photo.html` me hai.

**Root cause (aaj ka architecture):**
- `PLANS` constant — `passport-photo.html:4318`
- `api()` backend helper — `passport-photo.html:4301`
- `startCheckout(planId)` — `passport-photo.html:5062` (opens `payModal`)
- `completePayment()` — `passport-photo.html:5081` (loads Razorpay, creates
  order via `/api/create-order`, verifies via `/api/verify-payment`)
- `payModal` DOM (Complete Payment card) — `passport-photo.html` only
- Razorpay Checkout SDK `<script>` — `passport-photo.html` `<head>` only
- `index.html` me kuch bhi nahi hai checkout ka.

**Proposed refactor (approval liya ja chuka hai):**

1. Naya **`assets/checkout.js`** shared module banao (pattern: `auth.js`
   / `sliders.js`). Is me:
   - `PLANS` object (exact same weekly / monthly shape).
   - `api()` helper — ya to yahan duplicate karo ya
     `assets/auth.js` ke `api` ko export karke reuse karo (whichever
     keeps diff smaller; check auth.js existing shape pehle).
   - `startCheckout(planId)` aur `completePayment()` — exact same logic
     jo aaj `passport-photo.html` me hai. `currentUser()` /
     `showToast()` ko `window` se padh lo (auth.js + inline already
     expose karta hai).
   - Pay-modal DOM lazy-inject karo (jaisa `auth.js` apna modal inject
     karta hai) — ya `index.html` + `passport-photo.html` dono me
     inline `<template>` rakho. Jo bhi chhota diff de.
   - `window.startCheckout` / `window.completePayment` expose karo.

2. Naya **`assets/checkout.css`** (optional) — sirf pay-modal styles
   ke liye, `auth.css` pattern follow karte hue. Existing CSS tokens
   use karo, koi naya color/font/spacing token nahi.

3. **`index.html`** me changes:
   - `<head>` me Razorpay SDK declarative include karo (same as
     passport-photo.html): `<script src="https://checkout.razorpay.com/v1/checkout.js" async>`.
   - `assets/checkout.js` + `assets/checkout.css` include karo.
   - Pricing-card CTA click handler (line ~1485–1512 ka `<script>`
     block) update karo:
     - Logged-in users ke liye: `e.preventDefault()` + seedha
       `window.startCheckout(plan)` call — koi navigation nahi.
     - Logged-out users ke liye: signup modal kholo (current behavior),
       modal band hone par agar login successful hai to
       `window.startCheckout(plan)` call karo — `location.href`
       redirect hata do.
   - Pricing CTAs ka `href` ab `#buy-<plan>` ya sirf `#` rakh sakte
     ho — navigation ab JS-level hai, hash fallback optional.

4. **`passport-photo.html`** me changes:
   - Inline `PLANS` / `api` / `startCheckout` / `completePayment`
     hata ke shared module use karo (no duplication). `payModal` DOM
     bhi shared module inject karega.
   - `maybeOpen()` me `#buy-<planId>` branch preserve karo so passport-photo
     pe aane wale deep-links (ya cross-page CTAs) still direct checkout
     trigger karte rahein.
   - Baaki auth / upload / sheet-building code untouched.
   - **Locked file rule hat gaya hai (PR #110)** — minimum-diff still
     enforce karo, mostly code is being extracted not rewritten.

5. Backend untouched. `/api/create-order` aur `/api/verify-payment` same
   URL / same payload.

**Testing checklist:**
- Homepage `Get weekly pass` (logged-in): Complete Payment modal
  homepage par khule, URL change na ho.
- Homepage `Get weekly pass` (logged-out): signup modal → OTP login →
  modal close ke baad Complete Payment modal khule, URL change na ho.
- Google Sign-In bhi same flow par test karo.
- `passport-photo.html` par existing "Upgrade / Change Plan" button
  (`openPlans()` wala) — still working, same modal sequence.
- Razorpay test card: `4111 1111 1111 1111`, any future expiry / CVV.
  (Owner live Razorpay test khud chalayega; hum sirf build + flow
  verify karenge.)
- `npm run build` green; console me koi naya error nahi.
- Screenshots 375 / 820 / 1440 PR description me attach.

**Size estimate:** medium \u2014 ~200-300 lines shifted across
`assets/checkout.js` (new), `assets/checkout.css` (new, small),
`index.html` (+Razorpay include, +checkout include, handler update),
`passport-photo.html` (remove duplicated checkout code, keep
`#buy-<planId>` hash handler).

## Default rules (same every session)
- `passport-photo.html` editable hai (2026-04-24 unlock), but minimum
  diff only — 5000+ line file with inline nav/auth copies and a
  `#plans` / `#buy-<planId>` hash-open script. Shared-module churn
  elsewhere must stay compatible.
- `.github/workflows/*.yml` mat chhedo (fine-grained PAT has no
  `Actions: write` scope).
- Fonts / palette / CSS tokens unchanged.
- One PR per logical task, minimum diff.
- `npm run build` run karke verify karo.
- PR creation: `git_pr` 404s on this repo — curl + PAT fallback use
  karo (SKILL §3).
- Hinglish updates, quota-conscious, zero jargon.
```
