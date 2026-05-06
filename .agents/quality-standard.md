# Studio Print Production Quality Standard

Last updated: 2026-05-06 IST

This file is mandatory reading for every Studio Print chat. Studio Print must
be treated like a real production product used by real customers, not like a
quick static website.

## Product bar

- Every task must improve or protect user trust, business growth, speed,
  security, reliability, SEO, accessibility, visual quality, or maintainability.
- Small fixes should stay small, but no chat should ship half-working,
  unverified, or visually broken work.
- Before editing, state the owned file scope, user impact, main risk, success
  criteria, and verification plan.
- Prefer the existing design system, tokens, module boundaries, and local
  patterns. Do not introduce new fonts, palettes, frameworks, or broad
  abstractions without explicit owner approval.

## Required checks by work type

### UI, design, or tool workflow

- Check desktop, tablet, and phone layouts where the changed surface appears.
- Verify key user flow, loading state, empty state, error/failure state, and
  any disabled or fallback state touched by the change.
- Check browser console when browser tooling is available.
- Confirm no horizontal overflow, text clipping, incoherent overlap, hidden
  controls, broken sticky/fixed header spacing, or unreadable contrast.
- For canvas/print/photo/PDF workflows, verify generated output visually and
  check that download/print still works for the affected mode.

### SEO and growth

- Verify title, description, canonical, Open Graph/Twitter metadata, robots,
  sitemap, indexability, structured data, and internal links for affected pages.
- Sitemap entries must be real indexable pages, not hash fragments or stale
  `.html` URLs when pretty routes are canonical.
- Search Console actions should happen only after live HTML and sitemap checks
  pass. Do not repeatedly request indexing for the same URL.
- Growth work should target Indian user intent first: passport photo maker,
  Aadhaar/PAN print sheet, ID card PDF print, and printable government forms.

### Security, backend, auth, and payments

- Never commit or paste secrets, PATs, API tokens, private keys, OTP secrets,
  Razorpay secrets, Google OAuth secrets, or Cloudflare tokens.
- Check auth/session/token storage, CORS, input validation, rate limits, abuse
  handling, payment verification, security headers, logging, and safe error
  messages when touching backend or auth/payment flows.
- Do not claim a flow is secure just because the frontend works; verify the
  backend contract and deployment settings when they matter.

### Performance and reliability

- Keep heavy libraries lazy-loaded unless they are essential for first paint.
- Re-check service worker/cache markers, asset cache headers, and live freshness
  when app shell files or deploy config change.
- If GitHub Actions waits 10-15 minutes for a hosted runner, stop waiting and
  use the documented Cloudflare dashboard/direct deploy fallback.
- For production deploys, verify the live URL after deploy before telling the
  owner or Search Console that the update is live.

## Tooling and fallbacks

- Browser/visual checks are required for UI work when the tools are available.
- If `Access is denied` or browser automation fails, use available fallbacks:
  runtime Node, PowerShell inspection, live URL fetches, manual screenshots, or
  Cloudflare deployment URLs. Record the exact failing command and fallback.
- Windows Security allowlist was added by the owner on 2026-05-06 for Chrome,
  Edge, Codex bundled Node/rg, and runtime Node; re-test tooling after Codex is
  restarted.

## Parallel chat coordination

- Multiple chats should keep working in parallel when their owned file scopes
  are disjoint.
- An active scoped work lock is a warning to compare scopes, not an automatic
  reason to abandon the assigned task.
- Stop only for overlapping files, shared app-shell/cache/config files,
  `.agents` coordination files, generated `dist/**`, or live deploy/release
  ownership.
- Before commit/push/deploy, re-check locks, pull latest `main`, and stage only
  files owned by the current task.

## Done means verified

A task is not done until the chat reports what changed, what was not touched,
what was tested, what could not be tested, and any remaining risk.
