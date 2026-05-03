# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms Hub work only.
- Scope lock: `/forms` only. Do not touch `id-print.html` from this task.
- Active task completed: researched Rajasthan official civil-registration forms, added clean blank PDFs, and removed one old-dated scholarship income entry.
- Result: added `Birth Report Form 1`, `Death Report Form 2`, and `Still Birth Report Form 3` from official Rajasthan LSG source PDFs.
- Result: removed `Income Declaration - Scholarship` because the PDF text was for the 2019-20 scholarship year and no current clean official replacement was verified in this pass.
- Result: Forms Hub count is now 51 forms.
- Cache bumped to `studioprint-v43`; `id-print-v42` preserved from the latest ID Print commit.
- Feature commit pushed: `05ff784` (`feat(forms): add Rajasthan civil registration forms`).

## Owned file scope

- Owned and changed: `forms.html`, `assets/forms/manifest.json`, new Rajasthan civil-registration PDFs/previews under `assets/forms/**`, removed old scholarship income PDF/previews, `sw.js`, generated `dist/forms.html`, `dist/sw.js`, relevant tracked `dist/assets/forms/previews/pages/**`, `dist/_headers` build-sync output, and `.agents/research/forms-rajasthan-civil-registration-20260503.md`.
- Explicitly not owned/touched: `id-print.html`, `passport-photo.html`, `index.html`, `assets/legal.css`, shared auth/nav/pricing files, workflow files.

## Shared files touched

- `forms.html` touched only for Forms Hub data entries.
- `sw.js` touched only for cache-version bump and to preserve remote `id-print-v42`.

## Commit / deploy / QA

- Website source commit pushed: `05ff784`.
- Deploy triggered: yes, by push to `main`.
- Build run: yes, bundled Node `build.js`.
- Local validation: passed. Manifest has 51 entries; all referenced source PDFs/previews/page-previews exist; manifest page counts match actual PDF page counts; old income entry absent.
- Local browser smoke: passed using installed Chrome headless screenshot of `dist/forms.html`; page rendered 51 forms and showed the new birth/death/still-birth cards.
- Live HTML/SW QA: passed on `https://studioprint.pages.dev/forms?qa=forms-civil-05ff784`; page contains all 3 new civil-registration forms, does not contain old `Income Declaration - Scholarship`, and `/sw.js?qa=forms-civil-05ff784` contains `studioprint-v43` plus `id-print-v42`.
- Live browser smoke: passed using installed Chrome headless screenshot of production `/forms`; page rendered 51 forms and showed the new cards.

## Forms quality rule

- Before adding any new form, read the PDF and identify its actual use-case.
- Do not combine separate government workflows into one website card.
- Do not add filled, pen-written, signed, watermarked, old-dated, dark, rotated, unclear, or third-party PDFs.
- Prefer official government sources only; if the official file is dirty or only a guide/manual, do not list it as a blank printable form.

## Pending work

- Rajasthan is not complete yet. Pending official clean standalone PDFs still need research for caste, domicile/bonafide, EWS, income certificate, Pehchan 2025 Form 1-A/adopted child, delayed registration documents, and appeal forms.
- Rejected in this pass: Rajasthan LSG `BPL.pdf` because it is a 2003 scanned BPL survey document, not a clean current printable form.
- Before any new work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
