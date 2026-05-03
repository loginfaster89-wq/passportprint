# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched Rajasthan Revenue/eMitra official forms and added 10 clean blank PDFs.
- Result: `/forms` now has 85 forms total.
- Result: added separate Rajasthan Revenue/eMitra entries for domicile/bonafide, OBC/SBC caste, SC/ST caste, minority community, general caste, EWS state, EWS central/state, land mutation, Seemagyan/boundary, and solvency/Haisiyat workflows.
- Cache bumped to `studioprint-v45`; `id-print-v44` preserved from the latest ID Print commit.
- Feature commit pushed: `34a75f5` (`feat(forms): add Rajasthan revenue forms`).
- Previous Forms batch: `ae66863` added 24 official Rajasthan Transport forms.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Revenue/eMitra PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-revenue-20260503.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local note: `passport-photo.html` and `dist/passport-photo.html` are currently modified in the working tree from unrelated work and were not staged in this Forms commit.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump and to preserve remote `id-print-v44`.

## Commit / deploy / QA

- Website source commit pushed: `34a75f5`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local validation: passed. Manifest has 85 entries; 10 new Revenue/eMitra entries; all referenced source PDFs/previews/page-previews exist; manifest page counts match actual PDF page counts.
- Local browser smoke: passed using installed Chrome headless DOM check on `dist/forms.html`; page rendered 85 total forms and contained Domicile/Bonafide, EWS Central/State, and Land Mutation entries.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-revenue-34a75f5-final`; page contains new Revenue forms, `/sw.js` contains `studioprint-v45` plus `id-print-v44`, and `domicile-bonafide-certificate-rajasthan.pdf` returns 200.
- Live browser smoke: passed using installed Chrome headless DOM check on production `/forms`; page rendered 85 total forms and contained Domicile/Bonafide, EWS Central/State, and Land Mutation entries.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.

## Pending work

- Rajasthan is still not complete. Pending official clean standalone PDFs still need research for general income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, appeal forms, and any remaining citizen-service forms not yet verified.
- Rejected in this pass: eMitra manuals/guides, NFSA guide `GAndE_1547797511819.pdf`, Labour guide `GAndE_1492663583401.pdf`, and old image-only ration duplicate/cancellation PDFs because they are not better clean blank printable forms than the existing Rajasthan Food ration-card entry.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
