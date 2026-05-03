# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched and added 8 official Rajasthan Labour/Employment forms.
- Result: `/forms` now has 100 forms total.
- Result: added one Rajasthan Labour BOCW welfare scheme common application and seven Rajasthan Employment unemployment-allowance forms/certificates.
- Cache bumped to `studioprint-v50`; latest ID Print refresh marker `id-print-v49` preserved from the parallel ID Print commits.
- Feature commit pushed: `98dd9b2` (`feat(forms): add Rajasthan labour employment forms`).
- Latest parallel ID Print commit observed before push: `61a7d0b` (`fix(id-print): arrange PVC printer profile controls`).
- Previous Forms commits: `6772479` Police/SJE batch, `1114eb2` official PDF refresh, `34a75f5` Revenue/eMitra batch, `ae66863` Transport batch.

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan Labour/Employment PDFs/previews under `assets/forms/**`, `sw.js`, generated `dist/forms.html`, generated `dist/sw.js`, and `.agents/research/forms-rajasthan-labour-employment-20260503.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.
- Local note: `index.html`, `passport-photo.html`, `assets/legal.css`, `dist/_headers`, `dist/index.html`, `dist/passport-photo.html`, and `dist/assets/legal.css` are currently modified in the working tree from unrelated work/build output and were not staged in this Forms commit.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump and to preserve the latest remote ID Print refresh marker.

## Commit / deploy / QA

- Website source commit pushed: `98dd9b2`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js` after the final rebase.
- Local validation: passed. Manifest has 100 entries; `forms.html` and `dist/forms.html` each have 100 JS entries; all referenced source PDFs/previews/page-previews exist for the current manifest schema.
- Live HTML/SW/asset QA: passed on `https://studioprint.pages.dev/forms?qa=forms-labour-employment-98dd9b2-*`; live page has 100 JS entries and contains BOCW Welfare Scheme Common Application plus Unemployment Skill Training Attendance Certificate. `/sw.js` contains `studioprint-v50` and `id-print-v49`; `unemployment-allowance-income-i-rajasthan.pdf` returns 200.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, expired scheme-year, dark, rotated, unclear, or third-party PDFs.
- Old forms can be added only if still valid/current-use and clean.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.
- When an official combined PDF contains separate forms, split it into separate website entries/local PDFs.

## Pending work

- Rajasthan is still not complete. Continue official-source research for remaining clean citizen-service forms such as Pehchan 2025 Form 1-A/adopted-child, delayed registration documents, appeal forms, general income workflows, and remaining valid scheme/application PDFs.
- Rejected/not added in the latest pass: Labour BOCW beneficiary registration CamScanner PDF, yellow scanned Shop Act Form III certificate, Labour inspection-note pack, Employment punched/taped `Swaghoshana.pdf`, and scanned MYSY order/guideline bundle.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
