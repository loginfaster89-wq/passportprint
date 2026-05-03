# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns the Forms Hub ration-card / NFSA cleanup.
- Scope lock: this chat is working on `/forms` only. Do not touch `id-print.html` from this task.
- Active task: replace bundled Rajasthan Food PDFs with separate use-case entries after reading the official PDFs.
- Result: old combined `Ration Card Form - New/Update` entry removed.
- Result: official ration-card source split into:
  - `Ration Card APL - New Card`
  - `Ration Card BPL/Antyodaya - New Card`
  - `Ration Card - Update/Member Change`
- Result: ration-card update/member-change pages are now upright in the split PDF and preview images.
- Result: old combined `NFSA Food Security Application` entry removed.
- Result: official NFSA source split into:
  - `NFSA Food Security - Rural Appeal`
  - `NFSA Food Security - Urban Appeal`
- Result: Forms Hub count is now 49 forms.
- Cache bumped to `studioprint-v41`; `id-print-v40` preserved from the latest ID Print commits.
- Build result: bundled Node command `node build.js` passed.
- Local QA result: built `dist/forms.html` opened in installed Chrome via Playwright; total count was 49, old combined titles were absent, ration search showed all 3 ration flows, NFSA search showed rural/urban, and ration update preview loaded upright at `673 x 920`; no page/console errors.
- Feature commit pushed: `e87cf9e0d086258efc47787afc561f918097df75` (`fix(forms): split Rajasthan ration and NFSA forms`).
- Live QA result: `https://studioprint.pages.dev/forms?qa=forms-split-e87cf9e` contains the new ration/NFSA split entries, does not contain the old combined titles, and reports 49 forms.
- Live browser QA result: production `/forms` search for `ration` showed all 3 ration flows; `Ration Card - Update/Member Change` preview loaded upright at `673 x 920`; no page/console errors.
- Live SW QA result: `https://studioprint.pages.dev/sw.js?qa=forms-split-e87cf9e` contains `studioprint-v41` and `id-print-v40`.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, `assets/forms/**` ration/NFSA split PDFs and previews, `sw.js`, `dist/forms.html`, `dist/sw.js`, `dist/assets/forms/**` ration/NFSA assets, `.agents/research/forms-rajasthan-ration-nfsa-split-20260503.md`, `.agents/live-status.md`, `.agents/handoff.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump to `studioprint-v41`.

## Commit / deploy / QA

- Website source commit pushed: `e87cf9e0d086258efc47787afc561f918097df75`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local QA: passed.
- Live QA: passed after Cloudflare propagation.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, old-dated, dark, rotated, unclear, or third-party PDFs.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.

## Pending work

- Forms update has been pushed and live-verified.
- Existing residual local dirty files from before this Forms task may still appear for unrelated `dist/*` pages. Do not stage unrelated source files.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
