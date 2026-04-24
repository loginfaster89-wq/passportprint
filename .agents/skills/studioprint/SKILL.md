# Studio Print — Devin skill (condensed recipe)

Short checklist for Devin sessions on `loginfaster89-wq/passportprint`.
Deeper context lives in `AGENTS.md` at the repo root — read that file too,
this is just the "what do I run, what do I avoid" cheat sheet.

## 0. Vision — DO NOT DELETE

**This section defines how Devin approaches every task on Studio Print.
Read it first, internalise it, and let it guide every decision.**

Studio Print ka goal hai ki jab bhi koi user is website par aaye, toh
wo **bhool na paaye**. Design, fonts, visuals, micro-interactions,
layout, spacing — **sab kuch next level** hona chahiye. Ye ek indie
tool nahi hai — ye ek **2026 ka top-tier product** hai aur aise dikhna
chahiye.

**Devin ka role:** Devin ne is website ko banane mein actively help ki
hai. Devin sirf code nahi likhta — wo **design quality ka co-owner** hai.
Har PR mein:
- Existing design tokens (`--accent`, `--surface`, `--border`, etc.) ko
  **maximum effect** ke liye use karo.
- Har element ka spacing, alignment, aur visual weight check karo.
- Responsive behaviour har viewport pe polished hona chahiye — phone se
  desktop tak.
- Micro-interactions (hover, focus, transitions) subtle aur consistent
  hone chahiye.
- Copy terse, confident, non-salesy honi chahiye.

**Bottom line:** Jab tak website "wow" na lage, kaam khatam nahi hua.
Ye section kabhi delete mat karo — ye Devin ka design compass hai.

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
8. **Design / fonts / animations / effects = case-by-case approval
   (2026-04-24).** Project owner wants top-tier 2026 polish, but any new
   font, palette, token, animation, transition, hover effect, decorative
   element, or layout restructuring requires **explicit owner approval
   in-thread before the PR opens**. Modern motion / micro-interactions
   are welcome *within* the existing tokens — but ask first. Minor
   spacing / responsive fixes from `issues.md` do not need per-change
   approval.
9. **No single-feature glorification (2026-04-24).** Never create
   dedicated hero CTAs, floating buttons, or workflow sections that
   promote only one tool. Studio Print has multiple planned tools
   (Passport Photo, Document Sheet, Certificate Editor, Background
   Studio). Keep CTAs generic ("See all tools", "Explore the tools")
   and let the features-grid cards serve as entry points per tool.
   This avoids costly rework when the next feature launches.
10. **Delete dead code in the same PR.** When a feature is removed,
    delete ALL related files, CSS rules, and JS in the same PR. Don't
    leave orphaned files — they confuse future sessions.
11. **Devin's credit is on the line.** The footer says "Built with
    Devin AI". Every messy footer, broken toggle, or wasted space
    reflects directly on Devin's quality. Test every viewport.
12. **One problem at a time.** When fixing issues from `issues.md` or
    any backlog, solve them **one by one** — one issue per PR, one PR
    per commit cycle. Do not batch multiple unrelated fixes into a
    single PR. Keeps diffs small, reviews fast, rollbacks safe.

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
- Eyebrow: `NO UPLOADS · PRINT-READY`
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

## 7b. Shared pricing module (post PR #114)

`assets/pricing.js` + `assets/pricing.css` — shared 2-step modal:
Choose Plan → Complete Payment → Razorpay. Included on every page
except `passport-photo.html` (which keeps its own inline copy).

- On load, if `passport-photo.html`'s `#plansModal` / `window.openPlans`
  already exist, pricing.js steps aside (no double-modal).
- Exposes `window.openPlans` and `window.startCheckout` globally.
- `assets/auth.js` Upgrade/Change Plan button calls `window.openPlans()`
  on the current page instead of redirecting to `passport-photo.html#plans`.
- If `window.Razorpay` SDK isn't loaded, falls back to navigating to
  `passport-photo.html#buy-<planId>`.
- Hash handling: `#pricing` / `#plans` opens plan picker; `#buy-<planId>`
  goes straight to checkout.

Include order on each page:
```html
<link rel="stylesheet" href="assets/pricing.css">
<script src="assets/pricing.js" defer></script>
<!-- AFTER auth.js so window.currentUser / window.openAuth are available -->
```

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

**All quick-win + responsive + flow items are now merged (do NOT re-fix):**
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
- `R1/R2/R3/R5/R6` responsive polish (hero H1 clamp, hero-sheet clamp, 820 breakpoint, 24 px slider-dot tap, footer link padding) → PR #108.
- `U1` pricing buy-flow (`#buy-<planId>` hash handler + CTA hrefs) → PR #109.
- Docs: unlock `passport-photo.html` → PR #110.
- Homepage inline Razorpay checkout from pricing CTAs → PR #112.
- Shared pricing modal (`assets/pricing.js` + `assets/pricing.css`) — every page now has a 2-step Choose Plan → Complete Payment flow without navigating to `passport-photo.html` → PR #114.

**2026-04-24 re-audit (session #2): ALL CLEAR.** 9 pages × 8 viewports
(72 combos) — zero horizontal scroll, zero broken images, no new console
errors, no new layout bugs. Only pre-existing F1/F7/R2 cosmetic nits
remain. See `issues.md` §E for details.

**Open backlog (default priority order for next session):**

*Functional nits:* `F6` audience grid sparse, `F7` GSI iframe warnings
(harmless, not our code), `F11` passport-photo 1440 empty space
(passport-photo edit, minimum-diff).

*2026 polish roadmap (by impact):*
1. ~~`P12` Pricing comparison matrix~~ — **shipped PR #119.**
2. ~~`P30` Homepage density break — live-demo section between HERO/FEATURES.~~ — **shipped PR #123.**
3. ~~`P24` Self-host Syne + DM Mono (woff2 subset).~~ — **shipped PR #124.**
4. ~~`P16` Language switcher UI affordance.~~ — **shipped PR #125.**
5. ~~`P26` Cookie banner (self-hosted, essentials-only).~~ — **shipped PR #120.**

*Responsive items — only low-priority nits remain:*
- ~~`R4` passport-photo upload-card frame-corners clip at iPhone SE~~ — **shipped PR #130.**
- ~~`R7` No dedicated 768 px hero breakpoint~~ — **shipped PR #131.** New `@media (min-width:761px) and (max-width:768px)` in `index.html` switches hero-preview to single column at iPad portrait.

*Passport-photo-specific backlog* (file is no longer locked, but still
requires minimum-diff care — see Hard rule #1): ~~`F11` 1440 empty space~~ —
**shipped PR #129**, ~~`P21` inline error banner~~ — **shipped PR #130**,
~~`P29` step-bar progress fill~~ — **shipped PR #126**,
~~`R4` frame-corners clip at 375 px~~ — **shipped PR #130**.

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
repo / PAT / rules / concrete scope so a new session can start working
without re-auditing.

```
Studio Print frontend par kaam karo.
Repo: loginfaster89-wq/passportprint (private)
PAT: GITHUB_PAT_PASSPORTPRINT (fine-grained, repo-scoped —
Contents + Pull requests: Read and write on this repo).
Agar saved secret na mile to session-only provide karunga.

Clone ke baad pehle ye teen files padho:
1. .agents/skills/studioprint/SKILL.md — Devin recipe (build/preview,
   hard rules, PAT curl snippet, Hinglish style, §9 merged/open backlog).
2. AGENTS.md — full source of truth.
3. issues.md — 2026-04-23 site audit + 2026-04-24 §D responsive / flow
   follow-up + §E full re-audit + §F footer cleanup + §G single-feature
   glorification cleanup + §H upload card mobile polish.
last pr - PR #146 (docs: add §H upload card mobile issues + update prompt)

Shipped summary (don't redo):

PRs #70–#114: all original audit quick-wins + responsive + flow fixes.
PRs #118–#132: stats-grid slider, self-host fonts, lang switcher, step-bar
progress, audience grid, AI download bar, F11 empty space, error banner,
frame-corners, 768px breakpoint, font preload.
PRs #134+#137: FAQPage + WebApplication JSON-LD.
PR #139: footer/UX cleanup (F14–F19).
PR #141: single-feature glorification cleanup (G1–G5).
PR #142: BreadcrumbList + Organization JSON-LD, max-image-preview.
PR #143: pricing cards removed, buy buttons in comparison table, trust
pills 2-row, footer email icon removed.
PR #145: hero eyebrow pill shrunk + text changed to "No uploads ·
Print-ready", one-at-a-time rule added.
PR #146: docs — §H upload card mobile issues noted (H1–H5).

<yahan apna task likho> baaki task start kro

## Open backlog — pick one per session

All 5 polish roadmap items (P12/P30/P24/P16/P26) shipped. F6 + F11 +
P21 + R4 + R7 + P31 (font preload) + S1 (FAQ JSON-LD) + S2
(WebApplication JSON-LD) also shipped.

Passport-photo nits: all shipped (P21 PR #130, R4 PR #130, F11 PR #129,
P29 PR #126, P20 PR #128).

Responsive nits: all shipped (R4 PR #130, R7 PR #131).

Functional nits: `F7` GSI iframe warnings (not our code, harmless).

P11 (monthly/yearly toggle) dropped — PR #113. Do not re-propose.

**Footer & UX cleanup** (PR #139, session #3): lang switcher removed
from all shared pages, floating "Open Passport Photo" CTA removed,
footer compact on tablet/phone, upload card clipping fixed.

**Single-feature glorification cleanup** (this PR, session #4): hero
+ CTA band "Open Passport Photo" buttons replaced with generic "See
all tools" / "Explore the tools". 404 CTA made generic. Dead
`assets/lang.js` deleted. Dead lang-toggle CSS removed from
`passport-photo.html`. See `issues.md` §G.

**SEO ideas (all shipped):**
- ~~WebApplication JSON-LD on `passport-photo.html`~~ — **shipped PR #137.**
- ~~BreadcrumbList JSON-LD on legal pages~~ — **shipped PR #142.**
- ~~Organization JSON-LD on `about.html`~~ — **shipped PR #142.**
- ~~`<meta name="robots" content="max-image-preview:large">` on all pages~~ — **shipped PR #142.**

**Eyebrow + one-at-a-time rule** (PR #145, session #5): hero eyebrow
pill shrunk + text changed to "No uploads · Print-ready", one-at-a-time
rule added to SKILL.md.

**Open — passport-photo upload card mobile polish (§H, session #5):**
- `H1` Card content too dense on mobile (icon + title + 2 subtitles + 5 pills + CLICK button).
- `H2` "or drop your photo here" text misleading on mobile (no drag-drop).
- `H3` Feature pills wrap to 2 rows — cluttered.
- `H4` Corner brackets add visual noise on small phones.
- `H5` "CLICK" label should be "TAP" on phones.

## Default rules (same every session)
- `passport-photo.html` editable (2026-04-24 unlock), minimum diff.
- `.github/workflows/*.yml` mat chhedo.
- Fonts / palette / CSS tokens unchanged.
- One PR per logical task, minimum diff.
- `npm run build` run karke verify karo.
- Hinglish updates, quota-conscious, zero jargon.
- Devin files (SKILL.md, issues.md) ko session ke kaam se time to time
  jaldi se update karo.
- Session ke end mein naya prompt bna ke SKILL.md §11 mein update karo
  taaki next chat ready rahe.
- **Terse mode:** Jab user chat start kare toh Devin auto terse mode
  mein rahe — minimum messages, sirf important updates, zero
  re-explanation.
```
