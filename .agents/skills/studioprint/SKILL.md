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

1. **Never edit `passport-photo.html`** unless the user explicitly asks.
   5000+ line working feature with its own inline copies of nav / auth /
   header — shared-module changes must stay compatible with those.
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

See `issues.md` at the repo root for the full findings table. One-line
summary per bucket (next sessions should treat these as the default
backlog unless the user redirects):

**Resolved this week (do NOT re-fix):**
- `F1` Razorpay undefined URL → PR #70 (declarative `<script async>` +
  preconnects). The remaining /build/undefined 403 is a Razorpay-SDK
  bug, payment flow actually works.
- `F2` Google One-Tap auto-prompt → PR #71 (prompt only fires on
  explicit Login click inside the auth modal).
- `F3` features-grid 820 uneven heights → PR #73 (explicit 2-col at
  761-899 with primary `grid-column:1/-1`, 3-col desktop moved to
  `min-width:900px`).
- `F4` hero H1 phrase wrap → PR #74 (explicit `<br>` between the
  two sentences + `text-wrap:balance` on `.hero h1`).
- `F5` pricing-card heights at 820 → PR #78 (narrow-tablet
  `@media (min-width:761px) and (max-width:899px)` shrinks `h3` to
  19px, `.amt` to 32px, `.per` to 11px; "Shop counter" +
  "for 30 days" both fit on one line; ≥900 untouched).
- `F8` plain-text email on about / contact → PR #77
  (`<a class="email-obf" data-u="…" data-d="…">` + tiny per-page
  IIFE assembles the mailto on DOMContentLoaded; regex scrapers
  no longer see the address, browser users see the full clickable
  `mailto:` as before. No new shared module).
- `P3 + P7 + P17` interaction polish → PR #76 (CSS-only, one PR).
  `.why/.step/.audience/.pricing-card` hover lift + shadow,
  `.btn:active{transform:scale(.97)}`, `.pricing-card .pcta:active`
  same. Site-wide `:focus-visible { outline:2px solid var(--accent);
  outline-offset:2px }` added to `assets/legal.css` with
  `:focus{outline:none}` fallback so mouse clicks don't show rings.
  Respects `prefers-reduced-motion: reduce`.

**Nits / polish queue (remaining):**
- `F6` audience grid sparse (2 cards) on desktop. `F7` GSI iframe
  permissions-policy console warnings (harmless). `F9` Most-Popular
  badge overlap at 1440. `F10` tools-preview window-chrome dots
  unclear. `F11` desktop 1440 empty space below upload card on
  passport-photo. `F12` emoji icons inconsistent across platforms —
  switch to SVG pack.
- 2026 polish: P6 (FAQ smooth slide + `−` toggle), P14 (mobile sticky
  CTA pill), P22 (proper 1200×630 OG image) are the next highest-
  impact quick wins. P4/F12 SVG-icon pack + P9/P10/P15/P19/P27/P28
  are larger scope items.

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
