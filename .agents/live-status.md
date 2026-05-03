# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched Rajasthan Transport official forms and added 24 clean blank PDFs.
- Result: `/forms` now has 75 forms total.
- Result: added separate Rajasthan Transport entries for driving licence, medical certificate, vehicle registration/RC, transfer/NOC, address change, hypothecation, fitness, and stage carriage permit workflows.
- Cache bumped to `studioprint-v44`; `id-print-v43` preserved from the latest ID Print commit.
- Feature commit pushed: `ae66863` (`feat(forms): add Rajasthan transport forms`).
- Previous Forms batch: `05ff784` added Rajasthan civil-registration forms and removed the old 2019-20 scholarship income entry.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Transport PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, `dist/sw.js`, and `.agents/research/forms-rajasthan-transport-20260503.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump and to preserve remote `id-print-v43`.

## Commit / deploy / QA

- Website source commit pushed: `ae66863`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local validation: passed. Manifest has 75 entries; 24 Transport entries; all referenced source PDFs/previews/page-previews exist; manifest page counts match actual PDF page counts.
- Local browser smoke: passed using installed Chrome headless DOM check on `dist/forms.html`; page rendered 75 total forms and contained new Transport entries.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-transport-ae66863`; page contains new Transport forms, `/sw.js?qa=forms-transport-ae66863` contains `studioprint-v44` plus `id-print-v43`, and `transport-vehicle-registration-form-20-rajasthan.pdf` returns 200.
- Live browser smoke: passed using installed Chrome headless DOM check on production `/forms`; page rendered 75 total forms and contained `Learner Licence Form 2`, `Vehicle Registration Form 20`, and `Stage Carriage Permit Form RS-5.2`.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.

## Pending work

- Rajasthan is still not complete. Pending official clean standalone PDFs still need research for caste, domicile/bonafide, EWS, general income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, and appeal forms.
- eMitra caste/domicile/income/EWS manuals and service lists were checked but not added because clean official standalone printable PDFs were not verified in this pass.
- Rejected earlier: Rajasthan LSG `BPL.pdf` because it is a 2003 scanned BPL survey document, not a clean current printable form.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
