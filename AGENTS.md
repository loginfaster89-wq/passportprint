# AGENTS.md — Studio Print frontend

This file is read automatically by coding agents (Devin, Cursor, etc.) when
they open this repo. Keep it short; deep implementation notes go in
`CLOUDFLARE_DEPLOY.md` or in source comments where they belong.

For Devin specifically, there is also a condensed recipe at
[`.agents/skills/studioprint/SKILL.md`](.agents/skills/studioprint/SKILL.md)
covering the build/preview/PAT-PR commands, hard rules, and current copy tone
so a new session can start work quickly without re-reading everything.

## What this repo is

Plain static HTML/CSS/JS frontend for [Studio Print](https://studioprint.pages.dev/) —
a browser-based passport photo, Aadhaar/PAN sheet and certificate print tool for
Indian print shops and home users. All customer photos are processed on-device
(AI background removal via `briaai/RMBG-1.4` through transformers.js); no photo
uploads to a server.

Backend is a separate repo: `loginfaster89-wq/PassportPrint-Studio` (Node.js +
Express on Render). Handles auth (email OTP + Google Sign-In), Razorpay
payments, and the `POST /api/google-login`, `POST /api/delete-account`, `GET
/api/me` endpoints. Backend URL is hardcoded in `passport-photo.html` and
`assets/auth.js` as `https://passportprint-studio.onrender.com`.

## Build & preview

```bash
npm install
npm run build               # outputs minified/obfuscated files to ./dist
npx http-server dist -p 8080
# or: python3 -m http.server 8080 --directory dist
```

There is no dev server — edit source files, run `npm run build`, then
preview `dist/`. `npm run clean` removes `dist/`.

## Deploy

- Primary: **Cloudflare Pages**, project name `studioprint` (not
  `passportprint`). Every push to `main` runs `.github/workflows/deploy.yml`
  which does `npm ci` → `npm run build` → `wrangler pages deploy dist
  --project-name=studioprint`. Secrets `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` are already configured in repo settings.
- Fallback: **Netlify**, reads `netlify.toml`. Both hosts honour the
  `_headers` / `_redirects` convention.
- Cloudflare Pages GitHub statuses do **not** post back to PRs. To verify a
  deploy, `curl https://studioprint.pages.dev` or check the CF API. Cache
  propagation for production `*.pages.dev` URLs can take 10–60s; the
  per-deployment URL (`https://<hash>.studioprint.pages.dev`) is always
  immediately fresh.
- See `CLOUDFLARE_DEPLOY.md` for the manual `wrangler` fallback if the
  workflow ever fails.

## Design tokens — do not change without approval

Design language is fixed. Don't introduce new fonts, colors, or CSS tokens.

- Fonts: `Syne` (headings), `DM Mono` (body/monospace accents).
- Dark theme: `--bg: #0D0D0D`, accent: `--accent: #F0A500`.
- Use the existing CSS variables (`--bg`, `--surface`, `--surface2`,
  `--border`, `--muted`, `--muted2`, `--accent`, `--accent-dim`, `--text`,
  `--success`) — do not add new color/spacing tokens.

Structure, copy, layout and placement changes are fair game. Fonts, palette
and overall aesthetic are not.

## File layout

| Path                       | What lives there                                      |
| -------------------------- | ----------------------------------------------------- |
| `index.html`               | Homepage (hero, features, audience, why, how, pricing, FAQ, CTA) |
| `passport-photo.html`      | The live passport photo tool (5000+ lines, **see rules below**) |
| `about.html`, `contact.html`, `privacy.html`, `terms.html`, `refund.html`, `shipping.html` | Legal / info pages, share the header + footer with `index.html` |
| `assets/auth.js` + `auth.css` | Shared login / signup / OTP / Google Sign-In modal + account modal (plan info, upgrade, delete account). `position: fixed; z-index: 10000` overlay. Include on any page that has `.legal-header` with a `#hdrAuthBtn` button. |
| `assets/nav.js`            | Shared hamburger + Features dropdown behaviour. Hamburger breakpoint is **900px**. |
| `assets/legal.css`         | Shared header/footer/typography for all legal pages. |
| `build.js`                 | Runs HTML minifier + JS obfuscator → `dist/`        |
| `.github/workflows/deploy.yml` | CI deploy to Cloudflare Pages on `main` push    |

### Header markup (shared pages)

Post-PR #54, the header puts `#hdrAuthBtn` **outside** `<nav>` so the Login
button is visible beside the ☰ hamburger on mobile and tapping it opens the
modal directly without expanding the nav:

```html
<header class="legal-header">
  <a href="index.html" class="logo">Studio <em>Print</em></a>
  <nav id="primaryNav">…links…</nav>
  <button type="button" class="nav-login" id="hdrAuthBtn">…Login…</button>
  <button class="nav-toggle" aria-controls="primaryNav">☰</button>
</header>
```

`passport-photo.html` keeps its own pre-PR-#54 inline copy of the header
(still `#hdrAuthBtn` inside `<nav>`) because we do not touch that file.

## Hard rules

1. **Do not modify `passport-photo.html`** unless the user explicitly asks.
   It is a 5000+ line working feature with its own inline copies of the
   nav/auth/Google Sign-In markup and a small hash-open script that calls
   `openPlans()` when the URL hash is `#plans`. Any shared-module change you
   make elsewhere should remain compatible with those inline copies.
2. **Do not edit `.github/workflows/*.yml`** from a Devin session unless the
   user confirms the fine-grained PAT (`GITHUB_PAT_PASSPORTPRINT`) has the
   `Actions: Read and write` scope. Without that scope GitHub rejects
   workflow-file commits with `refusing to allow a Personal Access Token to
   create or update workflow ... without 'workflow' scope`.
3. **Pricing numbers** (free: 2 sheets/day; weekly: ₹59/7 days; monthly:
   ₹149/30 days) appear in `index.html`, `terms.html`, `refund.html` and
   `shipping.html`. If they change, update all four.
4. **Do not commit secrets.** `CLOUDFLARE_API_TOKEN`, `GITHUB_PAT_*`,
   Razorpay keys, Google OAuth secrets etc. live only in GitHub/Render
   settings. The frontend only ever references the public Google Client ID
   and the backend URL.
5. **Shared auth/nav changes** live in `assets/auth.js`, `assets/auth.css`,
   `assets/nav.js`, `assets/legal.css`. Do not fork the shared module into a
   per-page copy.
6. **Shared auth toast.** On login / signup-verify / Google Sign-In /
   logout / account-delete, `assets/auth.js` fires `notify(msg)`. On
   `passport-photo.html` it delegates to the inline `window.showToast`
   (so the page's existing `.toast` element is reused); everywhere else
   it injects a `.sp-toast` element styled in `assets/auth.css`. Keep the
   two visually in sync — both use `var(--surface)` bg +
   `var(--accent)` border + `z-index: 10001`.

## Passport-photo defaults (post PR #58)

Reference only — do not modify `passport-photo.html` without user approval.

- **Default sheet layout:** 5 photos, 5 cols × 1 row (`sheetCols=5`,
  `sheetRows=1`, `sheetTotal=5`). Was previously 8 photos in 4 × 2.
- **Mobile step bar** (`.steps` with the 1 → 4 progress pills) is hidden
  on phones `≤640px` via the existing media block.
- **Mobile upload card** uses a 360px max-width with reduced padding /
  pill sizes so it sits centered in the canvas area on narrow screens.

## Working with the GitHub App / PAT

The Devin GitHub App is installed on both Studio Print repos, but a session's
GitHub user is often not the repo owner, so `git_pr` / `list_repos` can
return "Not Found". When that happens, fall back to the REST API using the
fine-grained PAT `GITHUB_PAT_PASSPORTPRINT`:

```bash
# Clone
git clone "https://x-access-token:${GITHUB_PAT_PASSPORTPRINT}@github.com/loginfaster89-wq/passportprint.git"

# Create PR
curl -sS -X POST \
  -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d @pr_body.json \
  https://api.github.com/repos/loginfaster89-wq/passportprint/pulls
```

PAT must have `Contents: Read and write` and `Pull requests: Read and write`
on this repo. Add `Actions: Read and write` only if editing workflow files.

## Working style for human collaborators

The project owner is non-technical, prefers **simple Hinglish** explanations,
and actively watches quota usage. Default workflow:

1. Read the relevant files and summarise the change in a **short plan** —
   list exactly which files and sections will change. Wait for approval.
2. Make the minimum diff needed. One PR per logical task.
3. Use the existing CSS variables and module boundaries — do not add new
   frameworks, libraries, or global tokens without approval.
4. Before reporting done, run `npm run build` locally.
5. Keep explanations of backend/CI/CD internals brief unless asked.
