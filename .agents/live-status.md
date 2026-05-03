# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched and added 7 official clean Rajasthan Police/SJE forms.
- Result: `/forms` now has 92 forms total.
- Result: added split Bikaner Police servant/employee and tenant/PG verification forms, Rajasthan Police private-security agency Forms I/II/III, Palanhar scheme application, and RajSSP pension income certificate format.
- Cache bumped to `studioprint-v48`; `id-print-v47` preserved from the latest ID Print commits.
- Feature commit pushed: `6772479` (`feat(forms): add Rajasthan police and SJE forms`).
- Previous Forms commit: `1114eb2` refreshed 7 Rajasthan official PDFs.
- Previous Forms commit: `34a75f5` added 10 official Rajasthan Revenue/eMitra forms.
- Previous Forms batch: `ae66863` added 24 official Rajasthan Transport forms.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Police/SJE PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-police-sje-20260503.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local note: `passport-photo.html`, `dist/passport-photo.html`, `assets/legal.css`, `dist/assets/legal.css`, and `dist/_headers` are currently modified in the working tree from unrelated work/build output and were not staged in this Forms commit.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump and to preserve remote `id-print-v47`.

## Commit / deploy / QA

- Website source commit pushed: `6772479`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local validation: passed. Manifest has 92 entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Local build: passed with bundled Node `build.js`.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-police-sje-6772479-retry`; live page has 92 JS entries and contains Palanhar, Bikaner Police Tenant/PG, and RajSSP income entries. `/sw.js` contains `studioprint-v48` plus `id-print-v47`; `income-certificate-format-rajssp-rajasthan.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.

## Pending work

- Rajasthan is still not complete. Pending official clean standalone PDFs still need research for general income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, appeal forms, and any remaining citizen-service forms not yet verified.
- Rejected/not added in this pass: rotated coloured Kota Police servant/tenant/hostel scans, Rajasthan Police SHO report because it is office-filled, police enclosures checklist because it is not a standalone user form, SJE wrapper URLs that downloaded website chrome/HTML, and SJE scholarship wrapper because no clean direct standalone PDF was verified.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
