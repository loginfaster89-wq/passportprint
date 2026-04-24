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
- `R1` Hero H1 wraps awkwardly on phones (375/390 px) — tighten the
  `.hero h1` clamp floor or drop `max-width:18ch` at ≤ 420 px.
- `R2` `.hero-sheet.right` overflows the viewport right edge on
  iPad-portrait + all desktop sizes; clip the `right` offset or add
  `overflow:hidden` to `.hero`.
- `R3` Same sheet still visible at iPad-portrait 768 — raise the
  `.hero-sheets{display:none}` breakpoint from 760 to 820, or shrink
  and inset the sheet further.
- `R5` Slider pagination dots are 7×7 px — expand tap area to ~24 px
  without changing the visual dot size.
- `R6` Footer column links have ~17 px tap rows on phones — add
  `padding-block:6px` on `.footer-col a` in `assets/legal.css`.
- `R4` passport-photo upload-card frame-corners clip at iPhone SE
  (low priority).
- `R7` No dedicated 768 px hero breakpoint (optional polish).
- `U1` Home paid-plan CTA → login → lands on `passport-photo.html#plans`
  and forces the user to re-pick the plan to reach Razorpay. Shipped
  via PR #109: `#buy-<planId>` hash handler added to `passport-photo.html`
  (calls `window.startCheckout(planId)` directly) + `index.html` CTA
  hrefs + post-login redirect target now carry the plan id.

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

Copy the block below into a fresh Devin session when you want to hand
off the responsive + pricing-flow follow-up work. It self-contains
repo / PAT / rules / concrete scope and references `issues.md` §D for
details, so a new session can start working without re-auditing.

```
Studio Print frontend par kaam karo.
Repo: loginfaster89-wq/passportprint (private)
PAT: GITHUB_PAT_PASSPORTPRINT (repo-scoped fine-grained secret —
Contents + Pull requests: Read and write on this repo).

Clone ke baad pehle ye teen files padho:
1. .agents/skills/studioprint/SKILL.md — Devin-specific recipe
   (build/preview, hard rules, PAT curl snippet, Hinglish style,
   §9 closed/open backlog including R1-R7 + U1).
2. AGENTS.md — full source of truth.
3. issues.md — 2026-04-23 full-site audit + 2026-04-24 §D responsive
   follow-up with R1–R7 (responsive gaps) and U1 (pricing buy-flow).

## Aaj ka kaam — 2 independent PRs

### PR 1 — Responsive polish (no locked-file edits, ship first)
- Fix R1: `.hero h1` ko phones par clean wrap karo. Clamp floor
  tight karo (e.g. `clamp(28px, 8.6vw, 64px)` at `≤ 420px`) ya
  `max-width:18ch` drop karo phones par, taaki `Every print job.`
  ek line me fit ho.
- Fix R2: `.hero-sheet.right` viewport ke right edge se bahar ja
  raha hai. Ya to `right` offset clamp karo (e.g. `right:max(-3%,
  -24px)`) ya `.hero { overflow:hidden }` lagao. Gray stripe gone.
- Fix R3: `.hero-sheets { display:none }` breakpoint 760 se 820 px
  tak uthao — iPad-portrait (768) par sheet nahi dikhni chahiye.
- Fix R5: slider pagination dots (`.slider-dots button`) ka
  clickable area ~24px karo (visual dot 7 px rehne do — padding
  + `::before` / transparent hit pad).
- Fix R6: `.footer-col a` me `padding-block:6px` add karo
  (`assets/legal.css`) — footer links phones par easy tap.
- Files: sirf `index.html` + `assets/legal.css`. No JS. No
  `passport-photo.html`. No `.github/workflows/*.yml`. Tokens /
  fonts / palette unchanged.
- `npm run build` run karke verify karo, screenshots 375 / 768 /
  820 / 1440 attach karo PR description me.

### PR 2 — Pricing buy-flow (U1) — shipped in PR #109

For reference (this work is done):

- `index.html` pricing CTAs (`a.pcta[data-plan-cta]`) ab directly
  `passport-photo.html#buy-weekly` / `#buy-monthly` par point karte hain,
  aur signup-modal post-login redirect target bhi `data-plan-cta` se
  build hota hai.
- `passport-photo.html` ke `maybeOpen()` hash handler me
  `#buy-<planId>` branch hai jo `window.startCheckout(planId)` call karke
  seedha Razorpay kholta hai, aur `history.replaceState` se hash clear
  kar deta hai (reload par dobara checkout trigger nahi hota).
- Actual function ka naam `startCheckout` hai (`passport-photo.html:5062`,
  exposed on `window` at 5132) — `purchasePlan` nahi, agar kahin
  purana reference dikhe to ignore karo.

## Default rules (same every session)
- `passport-photo.html` editable hai (2026-04-24 unlock), but minimum
  diff only — 5000+ line file with inline nav/auth copies and a
  `#plans` / `#buy-<planId>` hash-open script. Shared-module churn
  elsewhere must stay compatible.
- `.github/workflows/*.yml` mat chhedo.
- Fonts / palette / CSS tokens unchanged.
- One PR per logical task, minimum diff.
- `npm run build` run karke verify karo.
- Hinglish updates, quota-conscious, zero jargon.
```
