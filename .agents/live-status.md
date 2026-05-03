# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: refreshed 7 existing Rajasthan forms from official clean/current sources after PDF inspection.
- Result: `/forms` now has 85 forms total.
- Result: Birth Form 1, Death Form 2, Still Birth Form 3, NFSA Rural, NFSA Urban, Domicile/Bonafide, and Minority Community now point to inspected official clean PDFs with regenerated previews/page previews.
- Cache bumped to `studioprint-v46`; `id-print-v46` preserved from the latest ID Print commits.
- Feature commit pushed: `1114eb2` (`feat(forms): refresh Rajasthan official PDFs`).
- Previous Forms commit: `34a75f5` added 10 official Rajasthan Revenue/eMitra forms.
- Previous Forms batch: `ae66863` added 24 official Rajasthan Transport forms.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, refreshed Rajasthan PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-refresh-20260503.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local note: `passport-photo.html`, `dist/passport-photo.html`, `assets/legal.css`, `dist/assets/legal.css`, and `dist/_headers` are currently modified in the working tree from unrelated work/build output and were not staged in this Forms commit.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump and to preserve remote `id-print-v46`.

## Commit / deploy / QA

- Website source commit pushed: `1114eb2`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local validation: passed. Manifest has 85 entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Local build: passed with bundled Node `build.js`.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-refresh-1114eb2-count`; live page has 85 JS entries and references refreshed Birth/Death/Still Birth/NFSA PDFs, `/sw.js` contains `studioprint-v46` plus `id-print-v46`, and refreshed Birth/NFSA PDFs return 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.

## Pending work

- Rajasthan is still not complete. Pending official clean standalone PDFs still need research for general income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, appeal forms, and any remaining citizen-service forms not yet verified.
- Rejected/not added in this pass: Pehchan 2025 rules/manual PDF for Form 1-A/adopted child because it is not a standalone printable citizen form; multiple guessed official standalone `FORM_1A` URLs were not found. Rejected dirty/pen-marked eMitra candidate `GAndE_1511777404417.pdf`. Existing clean Pehchan marriage application remains preferred over older eMitra marriage candidate.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
